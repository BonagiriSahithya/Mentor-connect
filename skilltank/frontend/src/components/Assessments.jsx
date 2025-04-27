import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Assessments = () => {
  const { mentorId } = useParams();
  const [course, setCourse] = useState("");
  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [existing, setExisting] = useState([]);
  const [slots, setSlots] = useState([]);

  const fetchMentorSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`);
      console.log("Fetched mentor details:", res.data);
      setSlots(res.data.availableSlots || []);
      setExisting(res.data.assessments || []);
    } catch (err) {
      console.error("Error fetching mentor data:", err);
    }
  };

  useEffect(() => {
    if (mentorId) fetchMentorSlots();
  }, [mentorId]);

  const uniqueCourses = Array.from(new Set(slots.map(slot => slot.course)));

  useEffect(() => {
    if (course) {
      const relatedSubtopics = slots
        .filter(slot => slot.course === course)
        .flatMap(slot => slot.subtopics || []);
      setSubtopics([...new Set(relatedSubtopics)]);
      setSelectedSubtopic("");
    }
  }, [course]);

  const addAssessment = async () => {
    if (!course || !selectedSubtopic || questions.length === 0) {
      return alert("Please select course, subtopic and enter questions.");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/assessments/mentor/add",
        {
          courseName: course.trim(),
          subtopics: [selectedSubtopic.trim()],
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCourse("");
      setSelectedSubtopic("");
      setQuestions([]);
      fetchMentorSlots(); // Refresh assessments
    } catch (err) {
      console.error("Error adding assessment:", err);
    }
  };

  const deleteAssessment = async (id) => {
    console.log("🧨 Attempting to delete assessment with ID:", id);

    try {
      await axios.delete(`http://localhost:5000/api/assessments/mentor/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchMentorSlots(); // Refresh
    } catch (err) {
      console.error("Error deleting assessment:", err);
    }
  };

  return (
    <div className="assessment-container">
      <style>{`
        .assessment-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 700px;
          margin: 2rem auto;
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        h2, h3 {
          color: #333;
        }

        select, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          margin-top: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        button:hover {
          background-color: #0056b3;
        }

        .assessment-box {
          background-color: #fff;
          border-left: 6px solid #007bff;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 8px;
        }

        .assessment-box h4 {
          margin-bottom: 0.5rem;
          color: #444;
        }

        .assessment-box ul {
          padding-left: 1.2rem;
        }

        .assessment-box li {
          margin-bottom: 0.3rem;
        }

        .assessment-box button {
          background-color: #dc3545;
          margin-top: 0.5rem;
        }

        .assessment-box button:hover {
          background-color: #c82333;
        }
      `}</style>

      <h2>Create Assessment</h2>

      <select value={course} onChange={(e) => setCourse(e.target.value)}>
        <option value="">Select Course</option>
        {uniqueCourses.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      {subtopics.length > 0 && (
        <select
          value={selectedSubtopic}
          onChange={(e) => setSelectedSubtopic(e.target.value)}
        >
          <option value="">Select Subtopic</option>
          {subtopics.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      )}

      <textarea
        value={questions.join("\n")}
        onChange={(e) =>
          setQuestions(
            e.target.value.split("\n").map(q => q.trim()).filter(q => q)
          )
        }
        placeholder="Enter questions (one per line)"
      />

      <button onClick={addAssessment}>
        Add Assessment
      </button>

      <h3>Existing Assessments</h3>

      {Object.entries(
        existing.reduce((acc, cur) => {
          const key = `${cur.courseName}::${cur.subtopics.join(",")}`;
          if (!acc[key]) {
            acc[key] = { ...cur, questions: [...cur.questions] };
          } else {
            acc[key].questions.push(...cur.questions);
          }
          return acc;
        }, {})
      ).map(([key, group]) => (
        <div className="assessment-box" key={key}>
          <h4>{group.courseName}</h4>
          <p>Subtopic: {group.subtopics.join(", ")}</p>
          <ul>
            {group.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
          <button onClick={() => deleteAssessment(group._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Assessments;
