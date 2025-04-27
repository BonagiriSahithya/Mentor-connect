const Booking = require("../models/booking");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

// Book a slot
exports.bookSlot = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { menteeId, date, time, meetingLink, course, subtopics } = req.body;

    const mentor = await Mentor.findById(mentorId);
    const mentee = await Mentee.findById(menteeId);
    if (!mentor || !mentee)
      return res.status(404).json({ error: "Mentor or mentee not found" });

    const selectedSlot = mentor.availableSlots.find(
      (slot) => slot.date === date && slot.time === time
    );
    if (!selectedSlot)
      return res.status(400).json({ error: "Slot not available" });

    const existingBooking = await Booking.findOne({
      mentorId,
      menteeId,
      date,
      time,
      course,
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You've already booked this course with this mentor at this time.",
      });
    }

    const booking = new Booking({
      mentorId,
      menteeId,
      date,
      time,
      meetingLink,
      course,
      subtopics,
      menteeName: mentee.name,
      menteeEmail: mentee.email,
    });

    await booking.save();

    // ✅ Add to mentee's bookedSessions
    mentee.bookedSessions.push({
      mentorId,
      date,
      time,
      meetingLink,
      courseName: course,
      subtopics, // ✅ Store subtopics
    });

    await mentee.save();

    res.status(201).json({ message: "Session booked successfully", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get mentee's bookings
exports.getMenteeBookings = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const bookings = await Booking.find({ menteeId });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all mentees booked with a mentor
exports.getMentorMentees = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const bookings = await Booking.find({ mentorId }).populate("menteeId", "name email");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId, menteeId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.menteeId.toString() !== menteeId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Booking.findByIdAndDelete(bookingId);

    // ✅ Remove from mentee's bookedSessions using all fields
    await Mentee.findByIdAndUpdate(
      menteeId,
      {
        $pull: {
          bookedSessions: {
            date: booking.date,
            time: booking.time,
            courseName: booking.course,
            meetingLink: booking.meetingLink,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




