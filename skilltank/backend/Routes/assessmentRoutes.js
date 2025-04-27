const express = require("express");
const router = express.Router();
const Mentee = require("../models/mentee");
const Mentor = require("../models/mentor");
const auth = require("../middleware/authMiddleware");
const {
  addAssessment,
  deleteAssessment,
  submitAssessment,
  deleteSubmission,
  getSubmittedAssessments,
} = require("../controllers/assessmentController");

// Mentor routes
router.post("/mentor/add", auth, addAssessment);
router.delete("/mentor/delete/:assessmentId", auth, deleteAssessment);
router.get("/mentee/submitted", auth, getSubmittedAssessments);



// Mentee routes
//router.post("/mentee/submit", auth, submitAssessment);
//router.delete("/mentee/delete/:submissionId", auth, deleteSubmission);
/*router.post("/mentee/submit", auth, async (req, res) => {
  const { course, subtopic, mentorId, answers } = req.body;

  try {
    const mentee = await Mentee.findById(req.user.id);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    const alreadySubmitted = mentee.submittedAssessments.find(
      (s) => s.course === course && s.subtopic === subtopic && s.mentorId.toString() === mentorId
    );
    if (alreadySubmitted) return res.status(400).json({ message: "Already submitted" });

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const assessment = mentor.assessments.find(
      (a) => a.courseName === course && a.subtopics.includes(subtopic)
    );
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    const answersWithQuestions = assessment.questions.map((q, i) => ({
      question: q,
      answer: answers[i] || "",
    }));

    mentee.submittedAssessments.push({
      course,
      subtopic,
      mentorId,
      answers: answersWithQuestions,
    });

    await mentee.save();
    res.status(200).json({ message: "Submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get submitted assessments by mentee
router.get("/mentee/submitted", auth, async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.user.id);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    res.json({ assessments: mentee.submittedAssessments });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Delete a submission
router.delete("/mentee/delete/:id", auth, async (req, res) => {
  try {
    await Mentee.updateOne(
      { _id: req.user.id },
      { $pull: { submittedAssessments: { _id: req.params.id } } }
    );
    res.status(200).json({ message: "Deleted submission" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});
*/
module.exports = router;
