import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "mentee" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);
            console.log("✅ Login Successful:", response.data);

            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("userId", response.data.user.id);

            if (response.data.user.role === "mentee") {
                localStorage.setItem("menteeId", response.data.user.id);
            }

            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Login Error:", error.response?.data?.message);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    useEffect(() => {
        const checkUserExists = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
                    if (!response.data.user) {
                        localStorage.clear();
                    }
                } catch (error) {
                    localStorage.clear();
                }
            }
        };

        checkUserExists();
    }, []);

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="login-input"
                />
                <select name="role" onChange={handleChange} className="login-select">
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                </select>
                <button type="submit" className="login-button">Login</button>
            </form>

            {/* Embedded CSS */}
            <style>{`
                .login-container {
                    max-width: 400px;
                    margin: 80px auto;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    background-color: #fefefe;
                    font-family: 'Segoe UI', sans-serif;
                    color: #333;
                }

                .login-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #4A90E2;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                }

                .login-input, .login-select {
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 16px;
                    transition: border 0.2s;
                }

                .login-input:focus, .login-select:focus {
                    border-color: #4A90E2;
                    outline: none;
                }

                .login-button {
                    padding: 12px;
                    background-color: #4A90E2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .login-button:hover {
                    background-color: #357ABD;
                }
            `}</style>
        </div>
    );
};

export default Login;
