const Mentee = require("../models/mentee");

exports.submitFeedback = async (req, res) => {
  const { menteeId, mentorId, rating, message, courseName, subtopic } = req.body;

  try {
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    const hasBooked = mentee.bookedSessions.some(session =>
      session.mentorId.toString() === mentorId &&
      session.courseName === courseName &&
      session.subtopics.includes(subtopic)
    );

    if (!hasBooked) {
      return res.status(403).json({ message: "You can only give feedback for booked sessions." });
    }

    mentee.feedbackGiven.push({ mentorId, rating, message, courseName, subtopic });
    await mentee.save();

    res.status(200).json({ message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getFeedbackForMentor = async (req, res) => {
  const { mentorId } = req.query;

  try {
    const mentees = await Mentee.find({
      "feedbackGiven.mentorId": mentorId
    });

    const feedbackList = mentees.flatMap(mentee =>
      mentee.feedbackGiven
        .filter(fb => fb.mentorId.toString() === mentorId)
        .map(fb => ({
          menteeName: mentee.name,
          menteeEmail: mentee.email,
          courseName: fb.courseName,
          subtopic: fb.subtopic,
          rating: fb.rating,
          message: fb.message,
        }))
    );

    res.status(200).json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





