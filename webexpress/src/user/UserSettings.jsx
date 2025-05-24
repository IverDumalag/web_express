import React, { useState } from 'react';
import UserBottomNavBar from '../components/UserBottomNavBar';
import { useNavigate } from "react-router-dom";
import UserFeedback from './UserFeedback';
import ConfirmationPopup from '../components/ConfirmationPopup';
import '../CSS/UserSettings.css';

export default function UserSettings() {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      setLogoutLoading(false);
      setShowLogoutConfirm(false);
      navigate("/login");
    }, 600); // Optional: short delay for UX
  };

  return (
    <>
      <div className="settings-main-container">
        <div className="settings-content-box">
          <div className="settings-title">Settings</div>
          <div className="settings-btn-row">
            <button className="settings-btn" onClick={() => setShowFeedback(true)}>
              Give Us Feedback
            </button>
          </div>
          <div className="settings-btn-row">
            <button className="settings-btn" onClick={() => window.open("https://drive.google.com/file/d/1D4QseDYlB9_3zezrNINM8eWWB3At1kVN/view?usp=sharing", "_blank")}>
              Download for Mobile
            </button>
          </div>
          <div className="settings-btn-row">
            <button className="settings-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      {showFeedback && (
        <UserFeedback
          showModal={true}
          onCloseModal={() => setShowFeedback(false)}
        />
      )}
      <ConfirmationPopup
        open={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        loading={logoutLoading}
      />
      <UserBottomNavBar />
    </>
  );
}