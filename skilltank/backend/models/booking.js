const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  meetingLink: { type: String, required: true },
  course: { type: String,required: true,},
  subtopics: [String],
  menteeName: { type: String },
  menteeEmail: { type: String }
});

module.exports = mongoose.model("Booking", bookingSchema);

