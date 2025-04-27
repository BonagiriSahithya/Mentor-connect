import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to the Mentoring Platform</h1>
      <div className="homepage-buttons">
        <Link to="/signup">
          <button className="homepage-button signup-button">Signup</button>
        </Link>
        <Link to="/login">
          <button className="homepage-button login-button">Login</button>
        </Link>
      </div>

      {/* Inline CSS styles */}
      <style>{`
        .homepage-container {
          text-align: center;
          padding-top: 100px;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f4f4;
          height: 100vh;
        }

        .homepage-title {
          color: #333;
          font-size: 32px;
          margin-bottom: 40px;
        }

        .homepage-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .homepage-button {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          color: white;
        }

        .signup-button {
          background-color: #4CAF50;
        }

        .signup-button:hover {
          background-color: #388E3C;
        }

        .login-button {
          background-color: #2196F3;
        }

        .login-button:hover {
          background-color: #1976D2;
        }

        @media (max-width: 500px) {
          .homepage-buttons {
            flex-direction: column;
          }

          .homepage-button {
            width: 80%;
            margin: 10px auto;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
