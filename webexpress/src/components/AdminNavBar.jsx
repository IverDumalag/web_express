import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearUserData } from '../data/UserData';
import AdminProfile from '../admin/AdminProfile';
import '../CSS/AdminNavBar.css';

const sideLinks = [
  { label: "Analytics", path: "/adminanalytics" },
  { label: "Logs", path: "/adminlogs" },
];

export default function AdminNavBar({ children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

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
      <div className="admin-outer-layout">
        <nav className="admin-navbar-top">
          <div className="admin-navbar-left">
            <span
              className="admin-brand-link"
              onClick={() => navigate("/adminanalytics")}
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
                  setShowProfile(true);
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

      <AdminProfile open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}