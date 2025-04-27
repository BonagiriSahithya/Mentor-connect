const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");

// Get all messages between 2 users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const chats = await Chat.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Send message
router.post("/send", async (req, res) => {
  const { senderId, receiverId, senderName, message } = req.body;
  try {
    const newChat = new Chat({ senderId, receiverId, senderName, message });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Delete message
router.delete("/delete/:chatId/:userId", async (req, res) => {
  const { chatId, userId } = req.params;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Message not found" });
    if (chat.senderId !== userId) return res.status(403).json({ error: "Unauthorized" });

    await Chat.findByIdAndDelete(chatId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;

















