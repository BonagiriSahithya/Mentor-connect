const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

// Add assessment (Mentor only)
exports.addAssessment = async (req, res) => {
  const { courseName, subtopics, questions } = req.body;
  const mentorId = req.user?.id;

  console.log("👉 Received body:", req.body);
  console.log("🔐 Mentor ID from token:", mentorId);

  try {
    if (
      !courseName?.trim() ||
      !Array.isArray(subtopics) || subtopics.length === 0 ||
      !Array.isArray(questions) || questions.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Normalize and validate
    const cleanAssessment = {
      courseName: courseName.trim(),
      subtopics: subtopics.map(s => s.trim()),
      questions: questions.map(q => q.trim())
    };

    mentor.assessments.unshift(cleanAssessment);
    await mentor.save();

    console.log("✅ Assessment saved!");
    res.status(201).json({ message: "Assessment added", assessments: mentor.assessments });
  } catch (err) {
    console.error("🔥 Error in addAssessment:", err);
    res.status(500).json({ message: "Error adding assessment", error: err.message });
  }
};



// Delete assessment (Mentor only)
exports.deleteAssessment = async (req, res) => {
  const { assessmentId } = req.params;
  const mentorId = req.user.id;

  console.log("🧹 Deleting assessment ID:", assessmentId);
  console.log("🔐 Mentor ID:", mentorId);

  try {
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      console.log("❌ Mentor not found");
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Log current assessments
    console.log("🧠 Current assessments:", mentor.assessments);

    mentor.assessments = mentor.assessments.filter(
      (a) => a._id.toString() !== assessmentId
    );

    await mentor.save();
    console.log("✅ Assessment deleted");
    res.status(200).json({ message: "Assessment deleted" });
  } catch (err) {
    console.error("🔥 Error deleting assessment:", err);
    res.status(500).json({ message: "Error deleting assessment", error: err.message });
  }
};



// Get current mentee's submitted assessments
exports.getSubmittedAssessments = async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.user.id);
    res.status(200).json({ assessments: mentee.submittedAssessments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions", error: err.message });
  }
};

// Submit assessment (Mentee only)
/*exports.submitAssessment = async (req, res) => {
  const { course, mentorId, subtopic, answers } = req.body;
  const menteeId = req.user.id;

  try {
    const mentee = await Mentee.findById(menteeId);

    const hasBooked = mentee.bookedSessions.some(
      b => b.courseName === course &&
           b.mentorId.toString() === mentorId &&
           b.subtopics.includes(subtopic)
    );

    if (!hasBooked) {
      return res.status(403).json({ message: "Subtopic not booked" });
    }

    mentee.submittedAssessments.push({
      course,
      subtopic,
      mentorId,
      answers,
    });

    await mentee.save();

    res.status(201).json({ message: "Assessment submitted" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting assessment", error: err.message });
  }
};


// Delete assessment submission (Mentee only)
exports.deleteSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const menteeId = req.user.id;

  try {
    const mentee = await Mentee.findById(menteeId);
    mentee.submittedAssessments = mentee.submittedAssessments.filter(s => s._id.toString() !== submissionId);
    await mentee.save();
    res.status(200).json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting submission", error: err.message });
  }
};*/
