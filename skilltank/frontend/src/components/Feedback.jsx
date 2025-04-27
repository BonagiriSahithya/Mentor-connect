import React, { useState, useEffect } from "react";
import axios from "axios";

const Feedback = () => {
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [bookedSessions, setBookedSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    try {
      const user = JSON.parse(userString);
      if (!user) throw new Error("No user");

      const id = user._id || user.id;
      setUserId(id);
      setRole(user.role);

      if (user.role === "mentee") {
        axios
          .get(`http://localhost:5000/api/mentees/${id}/bookedSessions`)
          .then((res) => setBookedSessions(res.data))
          .catch((err) => console.error("Error fetching booked sessions:", err));
      } else if (user.role === "mentor") {
        axios
          .get(`http://localhost:5000/api/feedback?mentorId=${id}`)
          .then((res) => setBookedSessions(res.data))
          .catch((err) => console.error("Error fetching feedback:", err));
      }
    } catch (err) {
      console.error("Error reading user data:", err);
      alert("Please log in again.");
    }
  }, []);

  const handleFeedbackChange = (mentorId, value) => {
    setFeedbacks({ ...feedbacks, [mentorId]: value });
  };

  const handleRatingChange = (mentorId, value) => {
    setRatings({ ...ratings, [mentorId]: value });
  };

  const handleSubmit = (mentorId, courseName, subtopic) => {
    if (!feedbacks[mentorId] || !ratings[mentorId]) {
      alert("Please fill in feedback and rating before submitting.");
      return;
    }

    const data = {
      mentorId,
      menteeId: userId,
      courseName,
      subtopic,
      message: feedbacks[mentorId],
      rating: ratings[mentorId],
    };

    axios
      .post("http://localhost:5000/api/feedback/submit", data)
      .then(() => {
        alert("Feedback submitted successfully!");
        setFeedbacks({ ...feedbacks, [mentorId]: "" });
        setRatings({ ...ratings, [mentorId]: "" });
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err);
        alert("Failed to submit feedback.");
      });
  };

  return (
    <div className="feedback-container">
      <style>{`
        .feedback-container {
          padding: 24px;
          font-family: 'Segoe UI', sans-serif;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        .session-box {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }
        .subtopic-block {
          margin-top: 16px;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          resize: vertical;
        }
        input[type="number"] {
          padding: 8px;
          width: 80px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-top: 8px;
        }
        .submit-button {
          background-color: #3498db;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          margin-top: 10px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #2980b9;
        }
        .mentor-feedback {
          background-color: #fff;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .mentor-feedback p {
          margin: 6px 0;
        }
        .mentor-feedback strong {
          color: #34495e;
        }
      `}</style>

      <h2 className="section-title">
        {role === "mentee" ? "Give Feedback to Mentors" : "Feedback Received from Mentees"}
      </h2>

      {role === "mentee" &&
        bookedSessions.map((session) => (
          <div key={session._id} className="session-box">
            <h3 className="text-lg font-medium text-gray-800">{session.courseName}</h3>
            {session.subtopics.map((subtopic) => (
              <div key={subtopic} className="subtopic-block">
                <h4 className="font-semibold">{subtopic}</h4>
                <textarea
                  rows="3"
                  placeholder="Write your feedback..."
                  value={feedbacks[session.mentorId] || ""}
                  onChange={(e) =>
                    handleFeedbackChange(session.mentorId, e.target.value)
                  }
                />
                <br />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating"
                  value={ratings[session.mentorId] || ""}
                  onChange={(e) =>
                    handleRatingChange(session.mentorId, e.target.value)
                  }
                />
                <br />
                <button
                  className="submit-button"
                  onClick={() =>
                    handleSubmit(session.mentorId, session.courseName, subtopic)
                  }
                >
                  Submit Feedback
                </button>
              </div>
            ))}
          </div>
        ))}

      {role === "mentor" &&
        bookedSessions.map((fb, index) => (
          <div key={index} className="mentor-feedback">
            <p><strong>Mentee:</strong> {fb.menteeName} ({fb.menteeEmail})</p>
            <p><strong>Course:</strong> {fb.courseName}</p>
            <p><strong>Subtopic:</strong> {fb.subtopic}</p>
            <p><strong>Rating:</strong> {fb.rating}</p>
            <p><strong>Feedback:</strong> {fb.message}</p>
          </div>
        ))}
    </div>
  );
};

export default Feedback;
