import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { mentorId } = useParams();

  const [mentor, setMentor] = useState({
    name: "",
    email: "",
    experience: "",
    linkedIn: "",
    education: "",
    areasOfExpertise: [],
    coursesOffered: []
  });

  const [areasInput, setAreasInput] = useState("");
  const [coursesInput, setCoursesInput] = useState("");

  useEffect(() => {
    if (!mentorId) return;

    const fetchMentor = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;
        setMentor({
          name: data.name || "",
          email: data.email || "",
          experience: data.experience || "",
          linkedIn: data.linkedIn || "",
          education: data.education || "",
          areasOfExpertise: data.areasOfExpertise || [],
          coursesOffered: data.coursesOffered || []
        });
        setAreasInput(data.areasOfExpertise?.join(", ") || "");
        setCoursesInput(data.coursesOffered?.join(", ") || "");
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const handleChange = (e) => {
    setMentor({ ...mentor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updated = {
        ...mentor,
        areasOfExpertise: areasInput.split(",").map(x => x.trim()),
        coursesOffered: coursesInput.split(",").map(x => x.trim())
      };

      await axios.put(
        `http://localhost:5000/api/mentors/${mentorId}/update`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      navigate(`/mentor-dashboard/${mentorId}`);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/mentors/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="update-container">
      <style>{`
        .update-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 30px;
          background-color: #f1f5f9;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .update-container h2 {
          font-size: 1.8rem;
          margin-bottom: 25px;
          text-align: center;
          color: #1e293b;
        }

        .update-container form input,
        .update-container form textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          font-size: 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background-color: #fff;
          transition: border-color 0.3s;
        }

        .update-container form input:focus,
        .update-container form textarea:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .update-container form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .update-container form button {
          padding: 10px 20px;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        }

        .update-container form button[type="submit"] {
          background-color: #3b82f6;
          color: white;
        }

        .update-container form button[type="submit"]:hover {
          background-color: #2563eb;
        }

        .update-container form .delete-button {
          background-color: #ef4444;
          color: white;
          margin-left: 10px;
        }

        .update-container form .delete-button:hover {
          background-color: #dc2626;
        }
      `}</style>

      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <input name="name" placeholder="Name" value={mentor.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={mentor.email} onChange={handleChange} required />
        <textarea name="experience" placeholder="Experience" value={mentor.experience} onChange={handleChange} />
        <input name="linkedIn" placeholder="LinkedIn URL" value={mentor.linkedIn} onChange={handleChange} />
        <input name="education" placeholder="Education" value={mentor.education} onChange={handleChange} />
        <input placeholder="Areas of Expertise (comma separated)" value={areasInput} onChange={(e) => setAreasInput(e.target.value)} />
        <input placeholder="Courses Offered (comma separated)" value={coursesInput} onChange={(e) => setCoursesInput(e.target.value)} />

        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
