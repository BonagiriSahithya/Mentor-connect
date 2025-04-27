import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("http://localhost:5000/api/mentors")
      .then((res) => res.json())
      .then((data) => {
        setMentors(data);
        setFilteredMentors(data);
      })
      .catch((error) => console.error("Error fetching mentors:", error));
  }, []);

  const allExpertise = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.areasOfExpertise || []))
  );

  const handleFilterChange = (e) => {
    const expertise = e.target.value;
    setSelectedExpertise(expertise);
    if (expertise === "") {
      setFilteredMentors(mentors);
    } else {
      const filtered = mentors.filter((mentor) =>
        mentor.areasOfExpertise.includes(expertise)
      );
      setFilteredMentors(filtered);
    }
  };

  const handleDelete = async (mentorId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete your profile.");
      return;
    }
    if (!loggedInUserId || loggedInUserId !== mentorId) {
      alert("You can only delete your own profile!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/mentors/${mentorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        alert("Profile deleted successfully.");
        const updatedMentors = mentors.filter((mentor) => mentor._id !== mentorId);
        setMentors(updatedMentors);
        setFilteredMentors(updatedMentors);
        localStorage.clear();
        window.location.href = "/signup";
      } else {
        alert(result.message || "Failed to delete mentor profile.");
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
      alert("An error occurred while deleting the profile.");
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h2 {
          text-align: center;
          color: #333;
        }

        label {
          font-weight: bold;
        }

        select {
          padding: 8px;
          margin-left: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        .mentor-card {
          background-color: #fdfdfd;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 20px;
          transition: transform 0.2s ease;
        }

        .mentor-card:hover {
          transform: scale(1.02);
        }

        .mentor-card h3 {
          margin-top: 0;
          color: #007bff;
        }

        .mentor-card p {
          margin: 8px 0;
        }

        .mentor-card a {
          color: #007bff;
          text-decoration: none;
        }

        .mentor-card a:hover {
          text-decoration: underline;
        }

        .mentor-card button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .view-btn {
          background-color: #28a745;
          color: white;
        }

        .view-btn:hover {
          background-color: #218838;
        }

        .delete-btn {
          background-color: #dc3545;
          color: white;
          margin-left: 10px;
        }

        .delete-btn:hover {
          background-color: #c82333;
        }

        .filter-wrapper {
          margin-bottom: 30px;
          text-align: center;
        }
      `}</style>

      <h2>Mentor Dashboard</h2>

      <div className="filter-wrapper">
        <label>Filter by Expertise:</label>
        <select value={selectedExpertise} onChange={handleFilterChange}>
          <option value="">-- All --</option>
          {allExpertise.map((expertise, index) => (
            <option key={index} value={expertise}>
              {expertise}
            </option>
          ))}
        </select>
      </div>

      {filteredMentors.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No mentors available</p>
      ) : (
        filteredMentors.map((mentor) => (
          <div key={mentor._id} className="mentor-card">
            <h3>{mentor.name}</h3>
            <p><strong>Email:</strong> {mentor.email}</p>
            {mentor.education && (
              <p><strong>Education:</strong> {mentor.education}</p>
            )}
            {mentor.areasOfExpertise?.length > 0 && (
              <p><strong>Expertise:</strong> {mentor.areasOfExpertise.join(", ")}</p>
            )}
            {mentor.coursesOffered?.length > 0 && (
              <p><strong>Courses Offered:</strong> {mentor.coursesOffered.join(", ")}</p>
            )}
            {mentor.linkedIn && (
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href={mentor.linkedIn} target="_blank" rel="noreferrer">
                  {mentor.linkedIn}
                </a>
              </p>
            )}
            <button
              className="view-btn"
              onClick={() => navigate(`/mentor-dashboard/${mentor._id}`)}
            >
              View Details
            </button>
            {loggedInUserId === mentor._id && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(mentor._id)}
              >
                Delete Profile
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
