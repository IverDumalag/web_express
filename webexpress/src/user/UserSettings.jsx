import React, { useState } from 'react';
import UserBottomNavBar from '../components/UserBottomNavBar';
import { useNavigate } from "react-router-dom";
import UserFeedback from './UserFeedback';
import ConfirmationPopup from '../components/ConfirmationPopup';
import '../CSS/UserSettings.css';
import expressLogo from '../assets/express_logo.png';

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
          <div className="settings-title">settings</div>
          <div className="settings-btn-row" style={{ marginTop: '1vw', marginBottom: '0.5vw', justifyContent: 'flex-start', paddingLeft: '4vw', flexDirection: 'column', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{marginBottom: '0.2em'}}>
              <div className="settings-btn-primary">Give Us Feedback</div>
              <div className="settings-btn-secondary">Let us know your thoughts or report an issue.</div>
              <button className="settings-btn feedback-btn" onClick={() => setShowFeedback(true)}>
                Give Us Feedback
              </button>
            </div>
            <div>
              <div className="settings-btn-primary">Download for Mobile</div>
              <div className="settings-btn-secondary">Get the exPress app for your mobile device.</div>
              <button className="settings-btn download-btn" onClick={() => window.open("https://drive.google.com/file/d/1D4QseDYlB9_3zezrNINM8eWWB3At1kVN/view?usp=sharing", "_blank")}>
                Download for Mobile
              </button>
            </div>
          </div>
          <div className="settings-logo-right">
            <img src={expressLogo} alt="exPress Logo" className="settings-app-logo" />
          </div>
          <div className="settings-btn-row" style={{ marginTop: '2vw', marginBottom: '0.5vw', justifyContent: 'flex-start', paddingLeft: '4vw' }}>
            <button className="settings-btn logout" style={{ width: '220px', borderRadius: '5px', boxShadow: '0 4px 18px -2px rgba(231,76,60,0.18)', background: '#ffeaea', color: '#e74c3c', fontWeight: 700, textAlign: 'left', padding: '0.9em 1.2em' }} onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="settings-divider" />
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