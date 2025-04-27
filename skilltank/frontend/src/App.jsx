import { useEffect } from "react";
import axios from "axios";
import Allroutes from "./routes/Allroutes";

function App() {
  useEffect(() => {
    const checkUserExists = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        await axios.get(`http://localhost:5000/api/auth/check-user/${userId}`);
      } catch (error) {
        console.log("⚠️ User does not exist in the database. Logging out...");
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    // Run the check immediately on mount
    checkUserExists();

    // Set an interval to check every 5 minutes
    const interval = setInterval(checkUserExists, 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return <Allroutes />;
}

export default App;











