const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mentors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Mentors Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Store token
    return data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    return null;
  }
};

export const signupUser = async (name, email, password, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error signing up:", error.message);
    return null;
  }
};

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
};
