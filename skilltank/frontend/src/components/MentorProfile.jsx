import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(`mentor_${mentorId}`);
    if (stored) setMentor(JSON.parse(stored));

    axios
      .get(`http://localhost:5000/api/mentors/${mentorId}`)
      .then((res) => {
        setMentor(res.data);
        localStorage.setItem(`mentor_${mentorId}`, JSON.stringify(res.data));
      })
      .catch((err) => console.error("Error:", err));
  }, [mentorId]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/mentors/${mentorId}`)
      .then(() => {
        localStorage.removeItem(`mentor_${mentorId}`);
        navigate("/dashboard");
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!mentor)
    return (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
    );

  return (
    <div className="mentor-profile">
      <style>{`
        .mentor-profile {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
        }

        .sidebar {
          width: 260px;
          background-color: #1e293b;
          color: #f1f5f9;
          padding: 24px;
        }

        .sidebar h2 {
          font-size: 1.25rem;
          font-weight: bold;
          border-bottom: 1px solid #334155;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .sidebar button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          margin-bottom: 10px;
          border: none;
          border-radius: 6px;
          background-color: #334155;
          color: #e2e8f0;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .sidebar button:hover {
          background-color: #475569;
        }

        .sidebar .delete {
          background-color: #ef4444;
        }

        .sidebar .delete:hover {
          background-color: #dc2626;
        }

        .sidebar .logout {
          background-color: #4b5563;
        }

        .sidebar .logout:hover {
          background-color: #374151;
        }

        .main-content {
          flex: 1;
          padding: 40px;
        }

        .main-content h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .main-content p {
          font-size: 1.1rem;
          margin-bottom: 10px;
          color: #334155;
        }

        .main-content a {
          color: #3b82f6;
          text-decoration: none;
        }

        .main-content a:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Mentor Dashboard</h2>
        <button onClick={() => navigate(`/update-profile/${mentorId}`)}>Update Profile</button>
        <button onClick={() => navigate(`/slots/${mentorId}`)}>Manage Slots</button>
        <button onClick={() => navigate(`/upload-file/${mentorId}`)}>Upload File</button>
        <button onClick={() => navigate(`/chat/${mentorId}`)}>Chat</button>
        <button onClick={() => navigate(`/mentees-list/${mentorId}`)}>Mentees List</button>
        <button onClick={() => navigate(`/book-session/${mentorId}`)}>Booking</button>
        <button onClick={() => navigate(`/mentor-dashboard/${mentorId}/assessments`)}>Assessments</button>
        <button onClick={() => navigate(`/mentor-dashboard/${mentorId}/progress-tracking`)}>Progress Tracking</button>
        <button onClick={() => navigate(`/mentor-dashboard/${mentorId}/feedback`)}>Feedback</button>
        <button onClick={handleDelete} className="delete">Delete Profile</button>
        <button onClick={handleLogout} className="logout">Logout</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h1>{mentor.name}</h1>
        <div>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Education:</strong> {mentor.education}</p>
          <p><strong>Experience:</strong> {mentor.experience}</p>
          <p><strong>Expertise:</strong> {mentor.areasOfExpertise?.join(", ")}</p>
          <p><strong>Courses Offered:</strong> {mentor.coursesOffered?.join(", ")}</p>
          {mentor.linkedIn && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href={mentor.linkedIn} target="_blank" rel="noopener noreferrer">
                {mentor.linkedIn}
              </a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MentorProfile;
