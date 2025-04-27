const express = require("express");
const mongoose = require("mongoose");
const { addSlot,getAssessmentQuestionsByMentor, removeSlot, getMentorSlots,getAllMentors,filterMentorsByExpertise,getMentorById,uploadFile,deleteFile,getMentorFiles,bookSlot} = require("../controllers/mentorController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUpload");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

const Assessment = require("../models/assessment");
const Progress = require("../models/progress");

const router = express.Router();

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const mentorId = req.params.id;
  
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
  
      // Ensure the logged-in user is deleting their own profile
      if (req.user.id !== mentorId) {
        return res.status(403).json({ message: "You can only delete your own profile" });
      }
  
      const deletedMentor = await Mentor.findByIdAndDelete(mentorId);
      
      if (!deletedMentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
  
      res.json({ message: "Mentor profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting mentor profile:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
     

  // ✅ Update Mentor Profile
router.put("/:id/update", authMiddleware, async (req, res) => {
  const mentorId = req.params.id;
  const {
    name,
    email,
    experience,
    areasOfExpertise,
    linkedIn,
    coursesOffered,
    education,
  } = req.body;

  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        name,
        email,
        experience,
        areasOfExpertise,
        linkedIn,
        coursesOffered,
        education
      },
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json(updatedMentor);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update mentor" });
  }
});

// ✅ Delete Mentor Profile
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.params.id;

    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);

    if (!deletedMentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json({ message: "Mentor profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting mentor profile:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



// ✅ Place fixed routes FIRST
router.get("/test", (req, res) => {
  res.json({ message: "Mentor test route working ✅" });
});


//router.put("/:mentorId/update", authMiddleware, updateProfile); 
router.get("/", getAllMentors);
router.get("/filter", filterMentorsByExpertise);
router.get("/:mentorId", getMentorById); // ✅ Get Slots (Public)


router.get("/:mentorId/slots", getMentorSlots);
// ✅ Add Slot (Mentors Only)
router.post("/:mentorId/slots", authMiddleware, addSlot);
// ✅ Remove Slot (Mentors Only)
router.delete("/:mentorId/slots", authMiddleware, removeSlot);
router.post("/book-slot", authMiddleware, bookSlot);


// ✅ Upload file (only mentors)
router.post("/:mentorId/upload-file", authMiddleware, upload.single("file"), uploadFile);
// Delete file
router.delete("/:mentorId/delete-file/:fileId", authMiddleware, deleteFile);
// Get files
router.get("/:mentorId/files", getMentorFiles);

router.get("/:mentorId/assessment-questions", async (req, res) => {
  const { mentorId } = req.params;
  console.log("🔍 Received mentorId:", mentorId);

  if (!mentorId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log("❌ Invalid mentor ID format:", mentorId);
    return res.status(400).json({ message: "Invalid mentor ID format" });
  }

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    res.json(mentor.assessments || []);
  } catch (err) {
    console.error("🔥 Error fetching mentor assessments:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get submitted assessments for a mentor from all mentees
router.get("/:mentorId/submitted-assessments", async (req, res) => {
  const { mentorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    return res.status(400).json({ message: "Invalid mentor ID format" });
  }

  try {
    const mentees = await Mentee.find({ "submittedAssessments.mentorId": mentorId });

    const allAssessments = mentees.flatMap(mentee => {
      return mentee.submittedAssessments
        .filter(assess => assess.mentorId.toString() === mentorId)
        .map(assess => ({
          menteeId: mentee._id,
          menteeName: mentee.name,
          menteeEmail: mentee.email,
          course: assess.course,
          subtopic: assess.subtopic,
          answers: assess.answers,
          submittedAt: assess.submittedAt,
        }));
    });

    res.json(allAssessments);
  } catch (error) {
    console.error("Error fetching submitted assessments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;




