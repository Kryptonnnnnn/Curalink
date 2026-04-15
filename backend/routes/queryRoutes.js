import express from "express";
import { handleQuery } from "../controllers/queryController.js";
import Chat from "../models/chatModel.js";

const router = express.Router();


router.post("/", handleQuery);


router.get("/history/:userId", async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId });

    if (!chat) {
      return res.json({ message: "No history found" });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;