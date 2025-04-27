const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  senderName: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);




