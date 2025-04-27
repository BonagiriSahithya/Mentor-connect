const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/book/:mentorId", bookingController.bookSlot);
router.get("/mentee/:menteeId", bookingController.getMenteeBookings);
router.get("/mentor/:mentorId", bookingController.getMentorMentees);
router.get("/mentee/:email", async (req, res) => {
    try {
      const bookings = await Booking.find({ menteeEmail: req.params.email });
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.delete("/cancel/:bookingId/:menteeId", bookingController.cancelBooking);

module.exports = router;





