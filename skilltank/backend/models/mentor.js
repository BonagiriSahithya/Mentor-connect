const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "mentor" },
  areasOfExpertise: [String],
  experience: { type: String },
  linkedIn: { type: String }, // ✅ New field
  coursesOffered: [String],   // ✅ New field
  education: { type: String }, // ✅ New field
  availableSlots: [{
    course: { type: String, required: true },  // 🔥 Associate slot with a course
    subtopics: [String], //
    date: { type: String, required: true },
    time: { type: String, required: true },
    meetingLink: { type: String, required: true }
  }],
  uploadedFiles: [{ fileName: String, fileUrl: String }],
  chats: [{
    senderId: String,
    receiverId: String,
    senderName: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  assessments: [{
    courseName: { type: String, required: true },
    subtopics: [String],  // Subtopic linked to assessment
    questions: [String],
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("Mentor", MentorSchema);