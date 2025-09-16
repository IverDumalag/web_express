// File: src/user/UserMenuPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo, FiArchive, FiMessageCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
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

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const menuItems = [
    { label: "Profile", icon: <FaUserCircle size={36} />, path: "/userprofile" },
    { label: "About", icon: <FiInfo size={36} />, path: "about-popup" },
    { label: "Archive", icon: <FiArchive size={36} />, path: "/userarchived" },
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
        <div className="popup-overlay" style={{zIndex: 10000, alignItems: 'center', justifyContent: 'center', overflowY: 'auto', background: 'rgba(44,62,80,0.10)'}}>
          <div style={{
            maxWidth: 900,
            width: '96vw',
            minWidth: 0,
            maxHeight: '92vh',
            margin: '0 auto',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
            background: 'transparent',
            position: 'relative',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 18,

              boxShadow: '0 2px 16px rgba(44,62,80,0.10)',
              width: '100%',
              maxHeight: '92vh',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <button style={{position: 'absolute', top: 18, right: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#334E7B', zIndex: 2}} onClick={() => setShowAboutPopup(false)} aria-label="Close">&#10005;</button>
              <UserAboutPage />
            </div>
          </div>
        </div>
      )}

      {/* Help Popup */}
      {showHelpPopup && (
        <div className="popup-overlay" style={{zIndex: 10000, alignItems: 'center', justifyContent: 'center', overflowY: 'auto', background: 'rgba(44,62,80,0.10)'}}>
          <div style={{
            maxWidth: 900,
            width: '96vw',
            minWidth: 0,
            maxHeight: '92vh',
            margin: '0 auto',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
            background: 'transparent',
            position: 'relative',
          }}>
            <div style={{
              background: '#fff',

             
            }}>
              <button style={{position: 'absolute', top: 18, right: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#334E7B', zIndex: 2}} onClick={() => setShowHelpPopup(false)} aria-label="Close">&#10005;</button>
              <UserHelpPage />
            </div>
          </div>
        </div>
      )}

      {/* Custom Logout Popup */}
      {showLogoutPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.08)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            borderRadius: 20,
            border: '2px solid #334E7B',
            background: '#fff',
            width: '95%',
            maxWidth: 440,
            padding: '2.5em 2.5em 2em 2.5em',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            color: '#334E7B',
            fontFamily: 'Roboto Mono, monospace',
            alignItems: 'stretch',
            gap: '0.7em',
            position: 'relative',
          }}>
          
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: '#334E7B' }}>
              Logout Confirmation
            </div>
            <div style={{ color: '#334E7B', textAlign: 'center', marginBottom: '1.2em', fontSize: '1.1em', fontWeight: 800 }}>
              Are you sure you want to logout?
            </div>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button
                type="button"
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  background: '#ef7070',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Logout
              </button>
              <button
                type="button"
                onClick={cancelLogout}
                style={{
                  flex: 1,
                  background: '#52677D',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuPage;
