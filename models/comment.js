import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    date: Date,
    });

export default mongoose.model("Comment", commentSchema);