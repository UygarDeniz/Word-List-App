import "dotenv/config";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "./models/user.js";
import Word from "./models/word.js";
import Thread from "./models/thread.js";
import Comment from "./models/comment.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(bodyParser.json());
app.use(express.static("public"));

const url = process.env.MONGODB_URL;
const secret = process.env.JWT_SECRET;
const api_url = process.env.DICT_API;
mongoose.connect(url);

app.post("/api/login", async (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.json({ success: false, err: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.json({ success: false, err: "Wrong password" });
    }

    const token = jwt.sign({ username: username }, secret);
    return res.json({ success: true, token: token });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const username = req.body.userName;
    const password = req.body.password;

    const user = await User.findOne({ username: username });

    if (user) {
      return res.json({ success: false, message: "Username already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ username: username }, secret);
      return res.json({ success: true, token: token });
    }
  } catch (error) {
    return res.json({ success: false, error: error.massage });
  }
});

app.get("/api/search/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const response = await axios.get(api_url + word);

    const data = {
      word: response.data[0].word,
      phonetics: response.data[0].phonetics,
      meanings: response.data[0].meanings,
    };

    let combinedData = data.meanings.map((item, index) => {
      return (
        `${item.partOfSpeech}\n` +
        `${item.definitions
          .slice(0, 2)
          .map(
            (definitionItem) =>
              `${definitionItem.definition}\n\n${
                definitionItem.example !== undefined
                  ? `Examples: ${definitionItem.example}\n`
                  : ""
              }`
          )}` +
        `${
          item.synonyms[0] !== undefined ? `Synonyms: ${item.synonyms[0]}` : ""
        }`
      );
    });
    combinedData =
      `\n${data.word}\n_________________________________________\n\n` +
      combinedData;

    return res.json({ word: word, text: combinedData });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/wordlist/save", async (req, res) => {
  try {
    const token = req.body.token;
    const text = req.body.text;
    const word = req.body.word;
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    const user = await User.findOne({ username }).populate("wordlist");
    const existingWord = user.wordlist.find((w) => w.word === word);

    if (existingWord) {
      console.log(text);
      existingWord.definition = text;
      existingWord.date = new Date();

      await existingWord.save();
    } else {
      const newWord = new Word({ word, definition: text });
      await newWord.save();

      user.wordlist.unshift(newWord);
      await user.save();
    }
    const sortedWords = user.wordlist.sort((a, b) => b.date - a.date);
    return res.json(sortedWords);
  } catch (error) {
    return res.json(error);
  }
});

app.post("/api/wordlist", async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    const user = await User.findOne({ username }).populate("wordlist");

    if (user) {
      return res.json(user.wordlist);
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, error: error.massage });
  }
});

app.get("/api/threads", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ date: -1 });
    return res.json(threads);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.delete("/api/wordlist", async (req, res) => {
  try {
    const token = req.body.token;
    const username = jwt.verify(token, secret).username;
    const word_id = req.body.word_id;

    const user = await User.findOne({ username }).populate("wordlist");

    user.wordlist.pull(word_id);

    await user.save();

    await Word.findByIdAndDelete(word_id);

    return res.json(user.wordlist);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});
app.post("/api/threads", async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const date = new Date();
    const token = req.body.token;
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      return res.json({ success: false, error: "User not found" });
    }

    const newThread = new Thread({
      postedBy: foundUser._id,
      title: title,
      content: content,
      date: date,
      likes: [],
    });

    const thread = await newThread.save();

    return res.status(201).json(thread._id);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/threads/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const thread = await Thread.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: "username",
        },
      })
      .populate({
        path: "postedBy",
        select: "username",
      });

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.json({ thread: thread, isOwner: false });
    } else {
      const token = authHeader.split(" ")[1];
      const username = jwt.verify(token, secret).username;
      const isOwner = thread.postedBy.username === username;
      const comments = thread.comments.map((comment) => ({
        ...comment.toObject(),
        isAuthor: comment.postedBy.username === username,
      }));

      return res.json({ thread: { ...thread.toObject(), comments }, isOwner });
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/threads/:id", async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    const thread_id = req.params.id;

    const deletedThread = await Thread.findByIdAndDelete(thread_id);

    await Comment.deleteMany({ _id: { $in: deletedThread.comments } });
    return res.status(200).json({ message: "Thread and comments deleted" });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/api/threads/:id", async (req, res) => {
  try {
    const token = req.body.token;
    const username = jwt.verify(token, secret).username;

    const reply = req.body.reply;
    const date = new Date();

    const thread_id = req.params.id;

    const foundUser = await User.findOne({ username });

    const newComment = new Comment({
      postedBy: foundUser._id,
      content: reply,
      date: date,
    });

    const comment = await newComment.save();

    const updatedThread = await Thread.findByIdAndUpdate(
      thread_id,
      {
        $push: { comments: comment._id },
      },
      { new: true }
    )
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: "username",
        },
      })
      .populate({
        path: "postedBy",
        select: "username",
      });
    const comments = updatedThread.comments.map((comment) => ({
      ...comment.toObject(),
      isAuthor: comment.postedBy.username === username,
    }));

    return res.json({ thread: { ...updatedThread.toObject(), comments } });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.delete("/api/threads/:threadId/comments/:commentId", async (req, res) => {
  try {
    const threadId = req.params.threadId;
    const commentId = req.params.commentId;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    const comment = await Comment.findById(commentId).populate("postedBy");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    console.log(comment.postedBy.username, username);
    if (comment.postedBy.username !== username) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Comment.findByIdAndDelete(commentId);

    await Thread.findByIdAndUpdate(threadId, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port 5000!");
});
