import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProgressTracking = () => {
  const { mentorId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const menteeId = currentUser?.id;
  const role = currentUser?.role;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [allowedSubtopics, setAllowedSubtopics] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (role === "mentee") {
        try {
          const menteeRes = await axios.get(`http://localhost:5000/api/mentees/${menteeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const booked = menteeRes.data.bookedSessions.filter(
            (b) => b.mentorId === mentorId
          );

          const allowed = new Set(
            booked.flatMap((b) =>
              b.subtopics.map((sub) =>
                `${b.courseName.trim().toLowerCase()}_${sub.trim().toLowerCase()}`
              )
            )
          );

          setAllowedSubtopics(allowed);

          const questionsRes = await axios.get(
            `http://localhost:5000/api/mentors/${mentorId}/assessment-questions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setQuestions(questionsRes.data);
        } catch (error) {
          console.error("Error fetching data for mentee:", error);
        }
      } else if (role === "mentor") {
        try {
          const questionsRes = await axios.get(
            `http://localhost:5000/api/mentors/${mentorId}/assessment-questions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const menteesRes = await axios.get(
            `http://localhost:5000/api/mentors/${mentorId}/submitted-assessments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setQuestions(questionsRes.data);
          setSubmittedAnswers(menteesRes.data);
        } catch (error) {
          console.error("Error fetching data for mentor:", error);
        }
      }
    };

    fetchData();
  }, [mentorId, menteeId, role]);

  const handleChange = (courseName, subtopic, question, value) => {
    const key = `${courseName}_${subtopic}_${question}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formattedAnswers = [];
      for (const key in answers) {
        const [course, subtopic, ...questionParts] = key.split("_");
        const question = questionParts.join("_");
        formattedAnswers.push({ course, subtopic, question, answer: answers[key] });
      }

      const grouped = {};
      formattedAnswers.forEach(({ course, subtopic, question, answer }) => {
        const groupKey = `${course}_${subtopic}`;
        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            course,
            subtopic,
            mentorId,
            menteeId,
            answers: [],
          };
        }
        grouped[groupKey].answers.push({ question, answer });
      });

      for (const groupKey in grouped) {
        await axios.post(
          "http://localhost:5000/api/mentees/assessments/mentee/submit",
          grouped[groupKey],
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setSubmitted(true);
      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Submission failed.");
    }
  };

  return (
    <div className="progress-container">
      <style>{`
        .progress-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafb;
        }

        h2 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .card {
          background-color: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .card h4 {
          font-size: 18px;
          color: #111827;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px;
          font-size: 14px;
        }

        label {
          font-weight: 500;
          color: #374151;
        }

        button {
          background-color: #3b82f6;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
        }

        button:hover {
          background-color: #2563eb;
        }

        .info-text {
          color: #6b7280;
          margin-bottom: 15px;
        }

        strong {
          color: #1f2937;
        }
      `}</style>

      <h2>Assessment Progress</h2>

      {/* Mentee View */}
      {role === "mentee" && !submitted && (
        <div>
          <p className="info-text">
            Allowed Subtopics: {[...allowedSubtopics].join(", ")}
          </p>
          <p className="info-text">
            Questions Available: {questions.length}
          </p>

          {questions.flatMap((q, index) =>
            q.subtopics.map((subtopic, subIndex) => {
              const key = `${q.courseName.trim().toLowerCase()}_${subtopic.trim().toLowerCase()}`;
              if (!allowedSubtopics.has(key)) return null;

              return (
                <div key={`${index}-${subIndex}`} className="card">
                  <h4>{q.courseName} — {subtopic}</h4>
                  {q.questions.map((question, i) => {
                    const inputKey = `${q.courseName}_${subtopic}_${question}`;
                    return (
                      <div key={i} className="mb-3">
                        <label>{question}</label><br />
                        <textarea
                          rows="3"
                          value={answers[inputKey] || ""}
                          onChange={(e) =>
                            handleChange(q.courseName, subtopic, question, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}

          {questions.length > 0 && allowedSubtopics.size > 0 && (
            <button onClick={handleSubmit}>Submit Answers</button>
          )}
        </div>
      )}

      {role === "mentee" && submitted && (
        <p className="info-text">Thank you! Your assessment has been submitted.</p>
      )}

      {/* Mentor View */}
      {role === "mentor" && (
        <div>
          {submittedAnswers.length === 0 ? (
            <p className="info-text">No assessment submissions yet.</p>
          ) : (
            Object.entries(
              submittedAnswers.reduce((acc, submission) => {
                const key = `${submission.menteeName}_${submission.menteeEmail}_${submission.course}_${submission.subtopic}`;
                if (!acc[key]) {
                  acc[key] = {
                    menteeName: submission.menteeName || "Unknown",
                    menteeEmail: submission.menteeEmail || "Not provided",
                    course: submission.course,
                    subtopic: submission.subtopic,
                    answers: [],
                  };
                }
                acc[key].answers.push(...submission.answers);
                return acc;
              }, {})
            ).map(([key, grouped], idx) => {
              const seen = new Set();
              const uniqueAnswers = grouped.answers.filter((a) => {
                const answerKey = `${a.question}_${a.answer}`;
                if (seen.has(answerKey)) return false;
                seen.add(answerKey);
                return true;
              });

              return (
                <div key={idx} className="card">
                  <h4>
                    Mentee: {grouped.menteeName}<br />
                    Email: {grouped.menteeEmail}<br />
                    Course: {grouped.course} / Subtopic: {grouped.subtopic}
                  </h4>
                  {uniqueAnswers.map((a, i) => (
                    <div key={i} className="mb-3">
                      <strong>Q:</strong> {a.question}<br />
                      <strong>A:</strong> {a.answer}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
