const express = require("express");
const router = express.Router();
const { submitFeedback, getFeedbackForMentor } = require("../controllers/feedbackController");

router.post("/submit", submitFeedback);
router.get("/", getFeedbackForMentor); // Use query parameters for filtering

module.exports = router;

