import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MenteesList = () => {
  const { mentorId } = useParams();
  const [groupedMentees, setGroupedMentees] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/mentor/${mentorId}`)
      .then((res) => {
        const data = res.data;

        const menteeMap = new Map();

        data.forEach((booking) => {
          const menteeId = booking.menteeId?._id || booking.menteeId;
          const menteeName = booking.menteeId?.name || booking.menteeName;
          const menteeEmail = booking.menteeId?.email || booking.menteeEmail;

          const courseSlot = `${booking.course} (${booking.date} at ${booking.time})`;

          if (menteeMap.has(menteeId)) {
            menteeMap.get(menteeId).bookings.push(courseSlot);
          } else {
            menteeMap.set(menteeId, {
              name: menteeName,
              email: menteeEmail,
              bookings: [courseSlot],
            });
          }
        });

        const grouped = Array.from(menteeMap.values());
        setGroupedMentees(grouped);
        localStorage.setItem("menteesList", JSON.stringify(grouped));
      })
      .catch((err) => console.error("Error fetching mentees list:", err));
  }, [mentorId]);

  return (
    <div className="mentees-container">
      <style>{`
        .mentees-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafb;
        }

        h2 {
          color: #1f2937;
          margin-bottom: 25px;
        }

        .mentee-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .mentee-card:hover {
          transform: scale(1.01);
        }

        .mentee-card p {
          margin: 6px 0;
          color: #374151;
        }

        .mentee-card strong {
          color: #111827;
        }

        .no-bookings {
          color: #6b7280;
          font-style: italic;
        }
      `}</style>

      <h2>Booked Mentees</h2>
      {groupedMentees.length === 0 ? (
        <p className="no-bookings">No mentees booked yet.</p>
      ) : (
        groupedMentees.map((mentee, idx) => (
          <div key={idx} className="mentee-card">
            <p><strong>Name:</strong> {mentee.name}</p>
            <p><strong>Email:</strong> {mentee.email}</p>
            <p><strong>Bookings:</strong> {mentee.bookings.join(", ")}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MenteesList;
