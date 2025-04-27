import React, { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";

const MentorDashboard = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}`);
        const data = await response.json();
        setMentor(data);
      } catch (error) {
        console.error("Error fetching mentor:", error);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const isLoggedInMentor =
    currentUser?.role === "mentor" &&
    currentUser?.email?.toLowerCase() === mentor?.email?.toLowerCase();

  const isMentee = currentUser?.role === "mentee";

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f5f8fa;
          min-height: 100vh;
        }
        .dashboard-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .nav-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .nav-buttons button {
          padding: 10px 16px;
          background-color: #3498db;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .nav-buttons button:hover {
          background-color: #2980b9;
        }
        .info-card {
          background-color: #ffffff;
          border: 1px solid #dcdcdc;
          border-radius: 12px;
          padding: 20px;
          margin-top: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .info-card h2 {
          margin-bottom: 10px;
          color: #34495e;
        }
        .info-card p {
          margin: 6px 0;
        }
        .info-card a {
          color: #2980b9;
          text-decoration: none;
        }
        .info-card a:hover {
          text-decoration: underline;
        }
      `}</style>

      <h2 className="dashboard-title">
        {isMentee ? "Mentee Dashboard" : "Mentor Dashboard"}
      </h2>

      <div className="nav-buttons">
        {isLoggedInMentor && (
          <>
            <Link to={`/mentor-dashboard/${mentorId}/update-profile`}><button>Update Profile</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/files`}><button>Upload File</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/slots`}><button>Manage Slots</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/assessments`}><button>Assessments</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/mentees-dashboard`}><button>Mentees List</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/chat`}><button>Chat</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/progress-tracking`}><button>Progress Tracking</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/feedback`}><button>View Feedback</button></Link>
          </>
        )}

        {isMentee && (
          <>
            <Link to={`/mentor-dashboard/${mentorId}/files`}><button>View Files</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/book-session`}><button>Booking</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/mentees-dashboard`}><button>Mentees List</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/chat`}><button>Chat</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/feedback`}><button>Feedback</button></Link>
            <Link to={`/mentor-dashboard/${mentorId}/progress-tracking`}><button>Assessment Submissions</button></Link>
          </>
        )}
      </div>

      {isMentee ? (
        <div className="info-card">
          <h2>Welcome, Mentee!</h2>
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
        </div>
      ) : mentor ? (
        <div className="info-card">
          <h2>Mentor Information:</h2>
          <p><strong>Name:</strong> {mentor.name}</p>
          <p><strong>Email:</strong> {mentor.email}</p>
          {isLoggedInMentor && (
            <>
              <p><strong>Areas of Expertise:</strong> {mentor.areasOfExpertise?.join(", ") || "N/A"}</p>
              <p><strong>Courses Offered:</strong> {mentor.coursesOffered?.join(", ") || "N/A"}</p>
              {mentor.linkedIn && (
                <p><strong>LinkedIn:</strong> <a href={mentor.linkedIn} target="_blank" rel="noreferrer">{mentor.linkedIn}</a></p>
              )}
            </>
          )}
        </div>
      ) : (
        <p>Loading mentor data...</p>
      )}

      <Outlet />
    </div>
  );
};

export default MentorDashboard;
