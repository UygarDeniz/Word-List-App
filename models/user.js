import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  wordlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Word" }],
});

export default mongoose.model("User", userSchema);
