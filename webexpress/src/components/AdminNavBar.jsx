import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearUserData } from '../data/UserData';

export default function AdminNavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event) => {
      if (avatarRef.current && avatarRef.current.contains(event.target)) {
        setDropdownOpen((open) => !open);
      } else if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    clearUserData();
    localStorage.clear();
    sessionStorage.clear();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .admin-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #2354C7 80%, #3b82f6 100%);
          padding: 2% 5%;
          width: 100%;
          box-sizing: border-box;
          min-height: 7vh;
        }
        .admin-navbar-left {
          display: flex;
          align-items: center;
        }
        .admin-brand-link {
          font-weight: bold;
          font-size: 1.5em;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          letter-spacing: 1px;
        }
        .admin-navbar-right {
          display: flex;
          align-items: center;
        }
        .admin-avatar-container {
          position: relative;
        }
        .admin-avatar-icon {
          width: 2.5em;
          height: 2.5em;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;
          color: #2354C7;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition: background 0.2s;
        }
        .admin-avatar-icon:hover {
          background: #e3e9f8;
        }
        .admin-dropdown {
          display: none;
          position: absolute;
          right: 0;
          top: 120%;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 8px;
          min-width: 120px;
          z-index: 10;
        }
        .admin-dropdown.show {
          display: block;
        }
        .admin-dropdown-btn {
          display: block;
          width: 100%;
          padding: 12% 16%;
          color: #2354C7;
          background: none;
          border: none;
          text-align: left;
          font-size: 1em;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .admin-dropdown-btn:hover {
          background: #f0f4ff;
        }
        @media (max-width: 600px) {
          .admin-navbar {
            padding: 4% 3%;
            min-height: 6vh;
          }
          .admin-brand-link {
            font-size: 1.1em;
          }
          .admin-avatar-icon {
            width: 2em;
            height: 2em;
            font-size: 1.1em;
          }
          .admin-dropdown-btn {
            font-size: 0.95em;
            padding: 10% 10%;
          }
        }
      `}</style>
      <nav className="admin-navbar">
        <div className="admin-navbar-left">
          <span
            className="admin-brand-link"
            onClick={() => navigate("/tempadmin")}
          >
            exPress
          </span>
        </div>
        <div className="admin-navbar-right">
          <div className="admin-avatar-container" ref={avatarRef}>
            <span className="admin-avatar-icon" title="Account">
              <span role="img" aria-label="avatar">👤</span>
            </span>
            <div
              className={`admin-dropdown${dropdownOpen ? " show" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="admin-dropdown-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  navigate("/adminprofile");
                }}
              >
                Profile
              </button>
              <button
                className="admin-dropdown-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
