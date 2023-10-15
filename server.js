import "dotenv/config";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(bodyParser.json());
app.use(express.static("public"));

const url = process.env.MONGODB_URL;
const secret = process.env.JWT_SECRET;
const api_url = process.env.DICT_API;
mongoose.connect(url);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  wordlist: [{ word: String, text: String, date: Date }],
});

const User = mongoose.model("User", userSchema);

app.get("/api/search/:word", (req, res) => {
  const word = req.params.word;
  axios
    .get(api_url + word)
    .then((response) => {
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
            item.synonyms[0] !== undefined
              ? `Synonyms: ${item.synonyms[0]}`
              : ""
          }`
        );
      });
      combinedData =
        `\n${data.word}\n_________________________________________\n\n` +
        combinedData;

      res.json({ word: word, text: combinedData });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/api/login", (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;
  User.findOne({
    username: username,
  })
    .then((foundUser) => {
      if (foundUser.password === password) {
        const token = jwt.sign({ username: username }, secret);
        res.json({ success: true, token: token });
      } else {
        res.json({ success: false, err: "Wrong password" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, err: "User not found" });
    });
});

app.post("/api/signup", (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;

  User.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      return res.json({ success: false, message: "Username already exists" });
    } else {
      const newUser = new User({
        username: username,
        password: password,
      });
      newUser
        .save()
        .then((user) => {
          const token = jwt.sign({ username: username }, secret);
          res.json({ success: true, token: token });
        })
        .catch((err) => console.log(err));
    }
  });
});

app.post("/api/wordlist/save", (req, res) => {
  const token = req.body.token;
  const text = req.body.text;
  const word = req.body.word;
  const decoded = jwt.verify(token, secret);
  const username = decoded.username;
 
  User.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      const foundWordIndex = user.wordlist.findIndex(
        (item) => item.word === word
      );
      if (foundWordIndex !== -1) {
        user.wordlist[foundWordIndex].text = text;
        const updatedWord = user.wordlist.splice(foundWordIndex, 1);

        user.wordlist.unshift(updatedWord[0]);
      } else {
        user.wordlist.unshift({ word: word, text: text, date: Date.now() });
      }
      user.save();
      res.json(user.wordlist);
    } else {
      res.json({ success: false });
    }
  });
});

app.post("/api/wordlist", (req, res) => {
  const token = req.body.token;
  const decoded = jwt.verify(token, secret);

  const username = decoded.username;

  User.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      res.json({ success: true, userList: user.wordlist });
    } else {
      res.json({ success: false });
    }
  });
});

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});


app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port 5000!");
});
