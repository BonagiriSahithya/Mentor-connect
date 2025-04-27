// models/progress.js
const mongoose = require("mongoose"); 
const progressSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
    course: String,
    goals: [String],
  });
  
  module.exports = mongoose.model("Progress", progressSchema);
  