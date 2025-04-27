require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./Routes/authRoutes");
const mentorRoutes = require("./Routes/mentorRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const feedbackRoutes = require("./Routes/feedbackRoutes");
const menteeRoutes = require("./Routes/menteeRoutes");
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mentees", menteeRoutes);
app.use("/api/assessments", require("./Routes/assessmentRoutes"));

app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});





