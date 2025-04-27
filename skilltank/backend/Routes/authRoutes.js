const express = require("express");
const router = express.Router();
require("dotenv").config();

const { signup, login ,checkUserStatus} = require("../controllers/authController");
router.get("/check-user/:id", checkUserStatus);

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;

