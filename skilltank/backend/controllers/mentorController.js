const Mentor = require("../models/mentor");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Booking = require('../models/booking');



exports.generateGoogleMeetLink = () => {
    return `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
};
exports.updateProfile = async (req, res) => {
    try {
        const { mentorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid mentor ID format" });
        }

        const allowedUpdates = [
            "name", "email", "areasOfExpertise", "experience",
            "linkedIn", "education", "coursesOffered"
        ];

        const updates = {};
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const updatedMentor = await Mentor.findByIdAndUpdate(
            mentorId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedMentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", mentor: updatedMentor });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// ➕ Add Slot (Only one slot per course allowed)
// ✅ Add Slot
exports.addSlot = async (req, res) => {
    try {
      const { date, time, meetingLink, course, subtopics } = req.body;
      const { mentorId } = req.params;
  
      if (!date || !time || !meetingLink || !course || !subtopics || !subtopics.length) {
        return res.status(400).json({ error: "All fields including subtopics are required!" });
      }
  
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) return res.status(404).json({ error: "Mentor not found!" });
  
      if (!mentor.coursesOffered.includes(course)) {
        return res.status(400).json({ error: "Course not offered by mentor!" });
      }
  
      const existingSlot = mentor.availableSlots.find(slot => (
        slot.course === course && slot.date === date && slot.time === time
      ));
      if (existingSlot) {
        return res.status(400).json({ error: "Slot already exists for this course at this time!" });
      }
  
      mentor.availableSlots.push({ course, subtopics, date, time, meetingLink });
      await mentor.save({ validateBeforeSave: false }); // ✅ Bypass validation issues from unrelated fields
  
      res.status(201).json(mentor.availableSlots);
    } catch (error) {
      console.error("❌ Error adding slot:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // ✅ Remove Slot
  exports.removeSlot = async (req, res) => {
    try {
      const { mentorId } = req.params;
      const { date, time, course } = req.body;
  
      console.log("🔍 RemoveSlot Request Body:", { date, time, course });
      console.log("📌 Mentor ID:", mentorId);
  
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  
      mentor.availableSlots = mentor.availableSlots.filter(slot =>
        !(slot.date === date && slot.time === time && slot.course === course)
      );
  
      await mentor.save({ validateBeforeSave: false }); // ✅ Bypass validation issues from unrelated fields
      res.status(200).json(mentor.availableSlots);
    } catch (error) {
      console.error("❌ Error removing slot:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  

// Get available slots for a mentor
exports.getMentorSlots = async (req, res) => {
    try {
      const { mentorId } = req.params;
      const mentor = await Mentor.findById(mentorId);
  
      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }
  
      // Return full slot info including subtopics
      res.status(200).json(mentor.availableSlots);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch slots" });
    }
  };
  



exports.uploadFile = async (req, res) => {
    try {
      if (req.user.role !== "mentor") return res.status(403).json({ message: "Only mentors can upload files" });
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
      const mentor = await Mentor.findById(req.user.id);
      if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  
      const fileData = {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
      };
  
      mentor.uploadedFiles.push(fileData);
      await mentor.save();
  
      res.status(201).json({ message: "File uploaded successfully", uploadedFiles: mentor.uploadedFiles });
    } catch (error) {
      res.status(500).json({ message: "Error uploading file", error: error.message });
    }
  };
  
  exports.deleteFile = async (req, res) => {
    try {
      if (req.user.role !== "mentor") return res.status(403).json({ message: "Only mentors can delete files" });
  
      const { mentorId, fileId } = req.params;
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  
      const file = mentor.uploadedFiles.id(fileId);
      if (!file) return res.status(404).json({ message: "File not found" });
  
      const filePath = path.join(__dirname, "..", "uploads", path.basename(file.fileUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  
      mentor.uploadedFiles = mentor.uploadedFiles.filter(f => f._id.toString() !== fileId);
      await mentor.save();
  
      res.json({ message: "File deleted successfully", uploadedFiles: mentor.uploadedFiles });
    } catch (error) {
      res.status(500).json({ message: "Error deleting file", error: error.message });
    }
  };
  
  exports.getMentorFiles = async (req, res) => {
    try {
      const { mentorId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(mentorId)) return res.status(400).json({ message: "Invalid mentor ID" });
  
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  
      res.status(200).json(mentor.uploadedFiles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching files", error: error.message });
    }
  };

// Get all mentors
exports.getAllMentors = async (req, res) => {
  try {
      const mentors = await Mentor.find(); // Fetch all mentors
      res.json(mentors);
  } catch (error) {
      res.status(500).json({ message: "Error fetching mentors", error });
  }
};

// Filter mentors by expertise
exports.filterMentorsByExpertise = async (req, res) => {
  try {
      const { expertise } = req.query;
      const mentors = await Mentor.find({ areasOfExpertise: { $regex: expertise, $options: "i" } });
      res.json(mentors);
  } catch (error) {
      res.status(500).json({ message: "Error filtering mentors", error });
  }
};

exports.getMentorById = async (req, res) => {
  try {
      const { mentorId } = req.params;
      console.log("🔍 Received mentorId:", mentorId); // ✅ Log mentorId

      // Ensure mentorId is valid
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
          console.log("❌ Invalid mentor ID format:", mentorId); // ✅ Debug log
          return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
          console.log("❌ Mentor not found for ID:", mentorId); // ✅ Debug log
          return res.status(404).json({ message: "Mentor not found" });
      }

      console.log("✅ Mentor found:", mentor); // ✅ Debug log
      res.json(mentor);
  } catch (error) {
      console.error("❌ Error fetching mentor details:", error);
      res.status(500).json({ message: "Error fetching mentor details", error: error.message });
  }
};
exports.bookSlot = async (req, res) => {
    try {
        if (req.user.role !== "mentee") {
            return res.status(403).json({ message: "Only mentees can book slots" });
        }

        const { slotId, mentorId } = req.body;
        const menteeId = req.user.id;

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const slot = mentor.availableSlots.id(slotId);
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Allow multiple mentees to book the same slot
        if (!slot.bookedBy.includes(menteeId)) {
            slot.bookedBy.push(menteeId);
            await mentor.save();
        }

        res.json({ message: "Slot booked successfully", slot });
    } catch (error) {
        res.status(500).json({ message: "Error booking slot", error });
    }
};



  
