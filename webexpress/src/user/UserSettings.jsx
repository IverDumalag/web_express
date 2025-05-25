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
          <div className="settings-btn-row logout-row" style={{ marginTop: '2vw', marginBottom: '0.5vw' }}>
            <button
              className="settings-btn logout"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <span style={{display: 'flex', alignItems: 'center'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 71 71" fill="none">
                  <path d="M13.8058 11.8331H45.3613V31.1609H49.3058V11.8331C49.3058 10.787 48.8902 9.7837 48.1505 9.04397C47.4107 8.30425 46.4075 7.88867 45.3613 7.88867H13.8058C12.7596 7.88867 11.7564 8.30425 11.0166 9.04397C10.2769 9.7837 9.86133 10.787 9.86133 11.8331V59.1664C9.86133 60.2126 10.2769 61.2159 11.0166 61.9556C11.7564 62.6953 12.7596 63.1109 13.8058 63.1109H45.3613C46.4075 63.1109 47.4107 62.6953 48.1505 61.9556C48.8902 61.2159 49.3058 60.2126 49.3058 59.1664H13.8058V11.8331Z" fill="#334E7B"/>
                  <path d="M55.5377 34.0802C55.1604 33.7571 54.6751 33.5883 54.1787 33.6074C53.6824 33.6266 53.2115 33.8324 52.8603 34.1836C52.509 34.5349 52.3033 35.0057 52.2841 35.5021C52.2649 35.9984 52.4337 36.4837 52.7568 36.861L59.423 43.3891H30.8257C30.3027 43.3891 29.801 43.5969 29.4312 43.9667C29.0613 44.3366 28.8535 44.8382 28.8535 45.3613C28.8535 45.8844 29.0613 46.386 29.4312 46.7559C29.801 47.1257 30.3027 47.3335 30.8257 47.3335H59.423L52.7568 54.1574C52.5504 54.3342 52.3827 54.5518 52.2643 54.7965C52.146 55.0412 52.0794 55.3077 52.0689 55.5793C52.0584 55.8509 52.1042 56.1217 52.2034 56.3748C52.3025 56.6279 52.4529 56.8578 52.6451 57.05C52.8373 57.2422 53.0672 57.3926 53.3203 57.4917C53.5734 57.5909 53.8442 57.6366 54.1158 57.6262C54.3874 57.6157 54.6539 57.5491 54.8986 57.4308C55.1433 57.3124 55.3609 57.1447 55.5377 56.9382L67.0555 45.4994L55.5377 34.0802Z" fill="#334E7B"/>
                </svg>
              </span>
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