import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      disease: String,
      query: String,
      response: Object,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Chat", chatSchema);