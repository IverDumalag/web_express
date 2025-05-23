import React, { useState } from 'react';
import UserBottomNavBar from '../components/UserBottomNavBar';
import { useNavigate } from "react-router-dom";
import UserFeedback from './UserFeedback';
import ConfirmationPopup from '../components/ConfirmationPopup';

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
      <style>{`
        .settings-main-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8fc;
        }
        .settings-content-box {
          background: #fff;
          border-radius: 2vw;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          width: 90vw;
          max-width: 420px;
          min-width: 220px;
          padding: 6vw 4vw 4vw 4vw;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .settings-title {
          font-weight: bold;
          font-size: 1.2em;
          margin-bottom: 6vw;
          text-align: center;
        }
        .settings-btn-row {
          width: 100%;
          margin-bottom: 5vw;
          display: flex;
          justify-content: center;
        }
        .settings-btn {
          width: 90%;
          padding: 4vw 0;
          font-size: 1.1em;
          border: none;
          border-radius: 2vw;
          background: #ecebff;
          color: #6c63ff;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .settings-btn:active {
          background: #d6d6ff;
          color: #007bff;
        }
        .settings-btn.logout {
          background: #ffeaea;
          color: #e74c3c;
        }
        .settings-btn.logout:active {
          background: #ffd6d6;
          color: #c0392b;
        }
        @media (max-width: 600px) {
          .settings-content-box {
            width: 98vw;
            max-width: 99vw;
            padding: 8vw 2vw 6vw 2vw;
          }
          .settings-btn {
            font-size: 1em;
            padding: 5vw 0;
          }
        }
      `}</style>
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