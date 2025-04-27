// models/assessmentModel.js

const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  course: String,
  subtopic: String,
  mentorId: String,
  menteeId: String,
  answers: [
    {
      question: String,
      answer: String
    }
  ]
});

module.exports = mongoose.model('Assessment', assessmentSchema);

