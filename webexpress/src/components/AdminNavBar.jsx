import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearUserData } from '../data/UserData';

const sideLinks = [
  { label: "Dashboard", path: "/adminhome" },
  { label: "Analytics", path: "/adminanalytics" },
  { label: "Logs", path: "/adminlogs" },
];

export default function AdminNavBar({ children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        .admin-navbar-top {
          width: 100vw;
          background: linear-gradient(90deg, #2354C7 80%, #3b82f6 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2% 5%;
          box-sizing: border-box;
          min-height: 7vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
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
        .admin-outer-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f4f6fa;
        }
        .admin-content-layout {
          display: flex;
          flex-direction: row;
          width: 100vw;
          min-height: 100vh;
          background: #f4f6fa;
          padding-top: 7vh; /* Height of navbar */
        }
        .admin-sidebar-vertical {
          width: 210px;
          background: #2354C7;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2vw 0 2vw 0;
          box-shadow: 2px 0 12px rgba(35,84,199,0.08);
          z-index: 99;
          min-height: calc(100vh - 7vh);
          position: sticky;
          top: 7vh;
          left: 0;
          height: calc(100vh - 7vh);
        }
        .admin-sidebar-title {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0 0 2vw 2vw;
          letter-spacing: 1px;
        }
        .admin-sidebar-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5vw;
        }
        .admin-sidebar-link {
          width: 100%;
          padding: 1em 2em;
          font-size: 1.1em;
          color: #fff;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          border-left: 4px solid transparent;
          transition: background 0.15s, border-color 0.15s;
        }
        .admin-sidebar-link.active,
        .admin-sidebar-link:hover {
          background: #3b82f6;
          border-left: 4px solid #fff;
        }
        .admin-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 7vh);
          padding: 2vw 2vw 2vw 2vw;
          margin-left: 210px; /* width of sidebar */
        }
        @media (max-width: 900px) {
          .admin-sidebar-vertical {
            width: 56px;
            padding: 1vw 0;
          }
          .admin-main-content {
            margin-left: 56px;
          }
          .admin-sidebar-title {
            display: none;
          }
          .admin-sidebar-link {
            padding: 1em 0.5em;
            font-size: 1em;
            text-align: center;
          }
          .admin-sidebar-link span {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .admin-navbar-top {
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
      <div className="admin-outer-layout">
        <nav className="admin-navbar-top">
          <div className="admin-navbar-left">
            <span
              className="admin-brand-link"
              onClick={() => navigate("/adminhome")}
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
        <div className="admin-content-layout">
          <nav className="admin-sidebar-vertical">
            <div className="admin-sidebar-title"></div>
            <div className="admin-sidebar-links">
              {sideLinks.map(link => (
                <button
                  key={link.path}
                  className={`admin-sidebar-link${location.pathname === link.path ? " active" : ""}`}
                  onClick={() => navigate(link.path)}
                >
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </nav>
          <div className="admin-main-content">
            {/* Place your page content below */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}