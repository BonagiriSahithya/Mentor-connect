import { useState, useEffect } from "react";

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [course, setCourse] = useState("");
  const [subtopics, setSubtopics] = useState([]);
  const [newSubtopic, setNewSubtopic] = useState("");
  const [error, setError] = useState(null);
  const [coursesOffered, setCoursesOffered] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const mentorId = user?.role === "mentor" ? user.id : null;

  useEffect(() => {
    if (!mentorId) {
      setError("Mentor ID missing.");
      return;
    }
    fetchSlots();
    fetchMentorCourses();
  }, [mentorId]);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSlots(data);
      localStorage.setItem("slots", JSON.stringify(data));
    } catch {
      setError("Failed to fetch slots.");
    }
  };

  const fetchMentorCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCoursesOffered(data.coursesOffered || []);
    } catch {
      setError("Failed to fetch mentor details.");
    }
  };

  const addSlot = async (e) => {
    e.preventDefault();
    setError(null);

    if (!date || !time || !meetingLink || !course || subtopics.length === 0) {
      setError("All fields and at least one subtopic are required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}/slots`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time, meetingLink, course, subtopics }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add slot.");
      }

      setSlots(data);
      localStorage.setItem("slots", JSON.stringify(data));
      setDate("");
      setTime("");
      setMeetingLink("");
      setCourse("");
      setSubtopics([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeSlot = async (date, time, course) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}/slots`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time, course }),
      });

      const updatedSlots = await response.json();
      if (!response.ok) {
        throw new Error(updatedSlots.error || "Failed to remove slot");
      }

      setSlots(updatedSlots);
      localStorage.setItem("slots", JSON.stringify(updatedSlots));
    } catch (err) {
      setError(err.message);
    }
  };

  const addSubtopic = () => {
    if (newSubtopic.trim() !== "") {
      setSubtopics([...subtopics, newSubtopic.trim()]);
      setNewSubtopic("");
    }
  };

  const removeSubtopic = (index) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };

  return (
    <div className="manage-container">
      <style>{`
        .manage-container {
          max-width: 700px;
          margin: 40px auto;
          padding: 30px;
          background-color: #f8fafc;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h2, h3, h4 {
          color: #1e293b;
          margin-bottom: 15px;
        }

        input, select {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 1rem;
        }

        input:focus, select:focus {
          border-color: #3b82f6;
          outline: none;
        }

        button {
          padding: 8px 16px;
          margin-top: 5px;
          margin-right: 5px;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          cursor: pointer;
        }

        button[type="submit"] {
          background-color: #10b981;
          color: white;
        }

        button[type="submit"]:hover {
          background-color: #059669;
        }

        button[type="button"] {
          background-color: #3b82f6;
          color: white;
        }

        button[type="button"]:hover {
          background-color: #2563eb;
        }

        .remove-button {
          background-color: #ef4444;
          color: white;
        }

        .remove-button:hover {
          background-color: #dc2626;
        }

        ul {
          padding-left: 20px;
        }

        li {
          margin-bottom: 8px;
        }

        a {
          color: #2563eb;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .error {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>

      <h2>Manage Slots</h2>
      {error && <p className="error">{error}</p>}

      <h3>Available Slots:</h3>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            <strong>{slot.course}</strong> — {slot.date} at {slot.time} —{" "}
            <a href={slot.meetingLink} target="_blank" rel="noopener noreferrer">Meet Link</a><br />
            Subtopics: {slot.subtopics?.join(", ") || "N/A"}{" "}
            <button className="remove-button" onClick={() => removeSlot(slot.date, slot.time, slot.course)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Add Slot</h3>
      <form onSubmit={addSlot}>
        <select value={course} onChange={(e) => setCourse(e.target.value)} required>
          <option value="">Select Course</option>
          {coursesOffered.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input
          type="text"
          placeholder="Google Meet Link"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          required
        />

        <div>
          <h4>Subtopics:</h4>
          <input
            type="text"
            placeholder="Add Subtopic"
            value={newSubtopic}
            onChange={(e) => setNewSubtopic(e.target.value)}
          />
          <button type="button" onClick={addSubtopic}>Add Subtopic</button>
          <ul>
            {subtopics.map((topic, index) => (
              <li key={index}>
                {topic} <button type="button" className="remove-button" onClick={() => removeSubtopic(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Add Slot</button>
      </form>
    </div>
  );
};

export default ManageSlots;
