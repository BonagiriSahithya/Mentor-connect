import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewFeedback = () => {
  const { mentorId } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/feedback/mentor/${mentorId}`)
      .then(res => setFeedbackList(res.data))
      .catch(err => console.error("Error fetching feedback:", err));
  }, [mentorId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-2xl font-semibold mb-4">Feedback from Mentees</h2>
      {feedbackList.length > 0 ? (
        feedbackList.map((fb, index) => (
          <div key={index} className="border p-4 mb-3 rounded shadow">
            <p><strong>Mentee:</strong> {fb.menteeName || "Anonymous"}</p>
            <p><strong>Rating:</strong> {fb.rating}/5</p>
            <p><strong>Comment:</strong> {fb.comment}</p>
          </div>
        ))
      ) : (
        <p>No feedback submitted yet.</p>
      )}
    </div>
  );
};

export default ViewFeedback;
