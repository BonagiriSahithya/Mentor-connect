import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </nav>

      <style>{`
        .navbar {
          background-color: #333;
          padding: 16px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .navbar-container {
          display: flex;
          justify-content: center;
          gap: 30px;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 18px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }

        .nav-link:hover {
          background-color: #555;
        }

        @media (max-width: 600px) {
          .navbar-container {
            flex-direction: column;
            align-items: center;
          }

          .nav-link {
            margin: 8px 0;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;



