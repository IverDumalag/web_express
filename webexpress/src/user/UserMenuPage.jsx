// File: src/user/UserMenuPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiInfo, FiArchive, FiMessageCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";
import UserBottomNavBar from "../components/UserBottomNavBar";
import UserAboutPage from "./UserAboutPage";
import UserHelpPage from "./UserHelpPage";
import UserFeedback from "./UserFeedback";
import '../CSS/UserMenuPage.css';

const UserMenuPage = () => {
  const navigate = useNavigate();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showFeedbackDrawer, setShowFeedbackDrawer] = useState(false);

  const handleClick = (path) => {
    if (path === "logout") {
      setShowLogoutPopup(true);
    } else if (path === "about-popup") {
      setShowAboutPopup(true);
    } else if (path === "help-popup") {
      setShowHelpPopup(true);
    } else if (path === "/userfeedback") {
      setShowFeedbackDrawer(true);
    } else {
      navigate(path);
    }
  };
      {/* Feedback Drawer Popup */}
      {showFeedbackDrawer && (
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 12000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          background: 'rgba(0,0,0,0.18)',
          minHeight: '100vh',
          transition: 'background 0.2s',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 520,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            background: '#fff',
            boxShadow: '0 -8px 32px rgba(44,62,80,0.18)',
            padding: 0,
            position: 'relative',
            minHeight: '50vh',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '100%',
              maxWidth: 420,
              margin: '0 auto',
              padding: '2em 1em',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UserFeedback showModal={true} onCloseModal={() => setShowFeedbackDrawer(false)} />
            </div>
          </div>
        </div>
      )}

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
    { label: "About", icon: <FiInfo size={36} />, path: "about-popup" },
    { label: "Archived", icon: <FiArchive size={36} />, path: "/userarchived" },
    { label: "Feedback", icon: <FiMessageCircle size={36} />, path: "/userfeedback" },
    { label: "Help", icon: <FiHelpCircle size={36} />, path: "help-popup" },
    { label: "Logout", icon: <FiLogOut size={36} />, path: "logout" },
  ];

  return (
    <div className="user-menu-page">
      <UserBottomNavBar />

      <div className="menu-container">
        
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

      {/* Feedback Drawer Popup */}
      {showFeedbackDrawer && (
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 12000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.18)',
          minHeight: '100vh',
        }}>
          <UserFeedback showModal={true} onCloseModal={() => setShowFeedbackDrawer(false)} />
      
        </div>
      )}
      {/* About Popup */}
      {showAboutPopup && (
        <div className="popup-overlay" style={{zIndex: 10000, alignItems: 'center', justifyContent: 'center', overflowY: 'auto'}}>
          <div className="popup-content" style={{
            maxWidth: 1200,
            width: '99vw',
            minWidth: 0,
            maxHeight: '85vh',
            margin: '0 auto',
            padding: 0,
            overflowY: 'auto',
            position: 'relative',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }}>
            <button style={{position: 'absolute', top: 18, right: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#334E7B', zIndex: 2}} onClick={() => setShowAboutPopup(false)} aria-label="Close">&#10005;</button>
            <div style={{padding: 24, overflowY: 'auto', maxHeight: '70vh'}}>
              <UserAboutPage />
            </div>
          </div>
        </div>
      )}

      {/* Help Popup */}
      {showHelpPopup && (
        <div className="popup-overlay" style={{zIndex: 10000, alignItems: 'center', justifyContent: 'center', overflowY: 'auto'}}>
          <div className="popup-content" style={{
            maxWidth: 1200,
            width: '99vw',
            minWidth: 0,
            maxHeight: '85vh',
            margin: '0 auto',
            padding: 0,
            overflowY: 'auto',
            position: 'relative',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }}>
            <button style={{position: 'absolute', top: 18, right: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#334E7B', zIndex: 2}} onClick={() => setShowHelpPopup(false)} aria-label="Close">&#10005;</button>
            <div style={{padding: 24, overflowY: 'auto', maxHeight: '70vh'}}>
              <UserHelpPage />
            </div>
          </div>
        </div>
      )}

      {/* Custom Logout Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay" style={{
          zIndex: 12000,
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          display: 'flex',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.18)'
        }}>
          <div className="popup-content" style={{
            maxWidth: 420,
            width: '95vw',
            borderRadius: 12,
            background: '#fff',
            padding: '2.5rem 2rem',
            boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
            textAlign: 'center',
            position: 'relative',
            margin: 'auto'
          }}>
            <button
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                fontSize: 28,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#334E7B',
                zIndex: 2
              }}
              onClick={cancelLogout}
              aria-label="Close"
            >
              &#10005;
            </button>
            <h2 style={{
              marginBottom: '0.8rem',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#1C2E4A'
            }}>Logout Confirmation</h2>
            <p style={{
              marginBottom: '2rem',
              color: '#334E7B',
              fontSize: '1rem',
              lineHeight: 1.5
            }}>
              Are you sure you want to logout?
            </p>
            <div className="popup-buttons" style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <button className="btn-cancel" style={{
                flex: 1,
                padding: '0.6rem 1.5rem',
                background: '#f5f5f5',
                color: '#1C2E4A',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }} onClick={cancelLogout}>Cancel</button>
              <button className="btn-confirm" style={{
                flex: 1,
                padding: '0.6rem 1.5rem',
                background: '#d9534f',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }} onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuPage;
