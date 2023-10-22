import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        
    },
    definition: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
});
export default mongoose.model("Word", wordSchema);