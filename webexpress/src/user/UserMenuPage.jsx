// File: src/user/UserMenuPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiInfo, FiArchive, FiMessageCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";
import UserBottomNavBar from "../components/UserBottomNavBar";
import '../CSS/UserMenuPage.css';

const UserMenuPage = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleClick = (path) => {
    if (path === "logout") {
      setShowLogoutPopup(true); // show custom popup
    } else {
      navigate(path);
    }
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    alert("Logged out successfully!");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const menuItems = [
    { label: "Profile", icon: <FiUser size={36} />, path: "/userprofile" },
    { label: "About", icon: <FiInfo size={36} />, path: "/userabout" },
    { label: "Archived", icon: <FiArchive size={36} />, path: "/userarchived" },
    { label: "Feedback", icon: <FiMessageCircle size={36} />, path: "/userfeedback" }, // <-- updated path
    { label: "Help", icon: <FiHelpCircle size={36} />, path: "/userhelp" },
    { label: "Logout", icon: <FiLogOut size={36} />, path: "logout" },
  ];

  return (
    <div className="user-menu-page">
      <UserBottomNavBar />

      <div className="menu-container">
        <h1>Menu</h1>
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-card ${item.label.toLowerCase()}`}
              onClick={() => handleClick(item.path)}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Logout Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Logout Confirmation</h2>
            <p>Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuPage;
