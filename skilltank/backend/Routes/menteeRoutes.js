// Routes/menteeRoutes.js
const express = require("express");
const router = express.Router();
const Mentee = require("../models/mentee");

// Get mentee by ID
// Get submitted assessments for a specific mentee and mentor
router.get("/:menteeId/bookedSessions", async (req, res) => {
  const { menteeId } = req.params;
  try {
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.json(mentee.bookedSessions);  // or wherever the booked sessions are stored
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.params.id);
    if (!mentee) {
      console.warn(`⚠️ No mentee found with ID ${req.params.id}`);
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.json(mentee);
  } catch (error) {
    console.error("❌ Error fetching mentee:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Submit assessment answer
router.post("/assessments/mentee/submit", async (req, res) => {
  const { course, subtopic, answers, mentorId, menteeId } = req.body;

  try {
    console.log("📨 Incoming submission:", req.body); // Debugging

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid format: answers must be an array" });
    }

    const mentee = await Mentee.findById(menteeId);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    mentee.submittedAssessments.push({
      course,
      subtopic,
      mentorId,
      answers: answers.map((a, i) => ({
        question: a.question || `Q${i + 1}`,
        answer: a.answer,
      })),
    });

    await mentee.save();
    res.status(200).json({ message: "Submitted successfully" });
  } catch (err) {
    console.error("🔥 Submission error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

