const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "mentee" },
    chats: [{
        senderId: String,
        receiverId: String,
        senderName: String,
        message: String,
        createdAt: { type: Date, default: Date.now }
      }],
      bookedSessions: [{
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
        date: String,
        time: String,
        meetingLink: String,
        courseName: String,
        subtopics: [String]
      }],
      feedbackGiven: [
        {
          mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
          rating: Number,
          message: String,
          courseName: String,
          subtopic: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      submittedAssessments: [{
        course: String,
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
        subtopic: String,
        answers: [{
          question: String,
          answer: String,
        }],
        submittedAt: { type: Date, default: Date.now }
      }]
});

module.exports = mongoose.model("Mentee", MenteeSchema);