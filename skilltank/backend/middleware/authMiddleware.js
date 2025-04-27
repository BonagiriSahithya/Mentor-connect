const jwt = require("jsonwebtoken");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // 👈 Add this

    req.user = decoded;

    const mentor = await Mentor.findById(req.user.id);
    const mentee = await Mentee.findById(req.user.id);

    if (!mentor && !mentee) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error); // 👈 Add this
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
