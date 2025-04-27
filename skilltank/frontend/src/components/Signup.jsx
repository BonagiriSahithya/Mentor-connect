import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "mentee" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
            console.log("✅ Signup Successful:", response.data);

            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("userId", response.data.user.id);

            navigate("/login");
        } catch (error) {
            console.error("❌ Signup Error:", error.response?.data?.message);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Signup</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                    className="signup-input"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="signup-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="signup-input"
                />
                <select name="role" onChange={handleChange} className="signup-select">
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                </select>
                <button type="submit" className="signup-button">Signup</button>
            </form>

            {/* Inline CSS styles */}
            <style>{`
                .signup-container {
                    max-width: 420px;
                    margin: 80px auto;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    background-color: #f9f9f9;
                    font-family: 'Segoe UI', sans-serif;
                    color: #333;
                }

                .signup-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #4CAF50;
                }

                .signup-form {
                    display: flex;
                    flex-direction: column;
                }

                .signup-input, .signup-select {
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 16px;
                    transition: border 0.2s;
                }

                .signup-input:focus, .signup-select:focus {
                    border-color: #4CAF50;
                    outline: none;
                }

                .signup-button {
                    padding: 12px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .signup-button:hover {
                    background-color: #388E3C;
                }
            `}</style>
        </div>
    );
};

export default Signup;
