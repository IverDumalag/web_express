import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiClipboard, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { getUserData } from '../data/UserData';
import '../CSS/UserBottomNavbar.css';

const navs = [
  { label: "Home", path: "/userhome" },
  { label: "Cards", path: "/usercards" },
  { label: "FSL→Text", path: "mobile-exclusive", isMobileExclusive: true },
  { label: "Audio→FSL", path: "mobile-exclusive", isMobileExclusive: true },
  { label: "Menu", path: "/usermenu" },
];

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [cardsActive, setCardsActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  // Get user data
  const userData = getUserData();
  const userName = userData ? `${userData.f_name || ''} ${userData.l_name || ''}`.trim() : 'User';
  const userEmail = userData?.email || 'user@example.com';

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  useEffect(() => {
    setCardsActive(location === "/usercards");
  }, [location]);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (nav) => {
    try {
      if (nav.isMobileExclusive) {
        setShowMobilePopup(true);
      } else {
        navigate(nav.path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      showError('Unable to navigate to the requested page. Please try again.');
    }
  };
  const handleAccountClick = () => setDropdownOpen((prev) => !prev);
  const handleDropdownClick = (path) => { navigate(path); setDropdownOpen(false); };

  // Show confirmation popup
  const handleLogoutClick = () => {
    try {
      setShowLogoutPopup(true);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout click error:', error);
      showError('Unable to open logout confirmation. Please try again.');
    }
  };

  // Confirm logout
  const confirmLogout = () => {
    try {
      setShowLogoutPopup(false);
      // Clear user data and tokens
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      showError('Something went wrong while logging out. Please try again.');
    }
  };

  return (
    <>
      <nav
        className="guest-navbar"
        style={{
          width: '100%',
          background: '#1C2E4A',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4vw',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          fontFamily: 'Inder, monospace',
          fontSize: '1.3em',
          color: '#fff',
          gap: '60px'
        }}
      >
        {/* Nav Links */}
        <div className="guest-navbar-links" style={{ display: 'flex', gap: '2.5vw', alignItems: 'center', height: '60px' }}>
          {navs.map((nav) => {
            const isActive = location === nav.path && !nav.isMobileExclusive;
            return (
              <span
                key={nav.label}
                className={`guest-navbar-link${isActive ? ' active' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '0 1vw',
                  borderBottom: isActive ? '3px solid #fff' : 'none',
                  fontSize: nav.isMobileExclusive ? '1.1em' : '1.3em',
                }}
                onClick={() => handleNavClick(nav)}
              >
                {nav.label}
              </span>
            );
          })}
        </div>

        {/* Account Dropdown */}
        <div ref={dropdownRef} style={{ position: 'absolute', right: '4vw', cursor: 'pointer' }}>
          <FiUser size={28} onClick={handleAccountClick} />

          {dropdownOpen && (
            <div className="account-dropdown">
              <div className="dropdown-header">
                <div>
                  <div className="dropdown-name">{userName} </div>
                  <div className="dropdown-email">{userEmail}</div>
                </div>
              </div>

              {/* <div className="dropdown-item" onClick={() => handleDropdownClick("/usermenu")}>
                <FiClipboard size={20} /><span>Menu</span>
              </div> */}
              <div className="dropdown-item" onClick={() => handleDropdownClick("/userprofile")}>
                <FiUser size={20} /><span>Profile</span>
              </div>
              <div className="dropdown-item">
                <FiHelpCircle size={20} />
                <a
                  href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none', marginLeft: 8 }}
                >
                  Download our App
                </a>
              </div>
              <div className="dropdown-item logout" onClick={handleLogoutClick}>
                <FiLogOut size={20} /><span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button className="btn-cancel" onClick={() => setShowLogoutPopup(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Exclusive Feature Popup */}
      {showMobilePopup && (
        <div className="popup-overlay">
          <div className="popup-content" style={{ textAlign: 'center' }}>
            <h2>Mobile Exclusive Feature</h2>
            <p style={{ marginBottom: '20px', fontSize: '1.1em', lineHeight: '1.5' }}>
              This is a mobile exclusive function.
            </p>
            <div className="popup-buttons" style={{ flexDirection: 'column', gap: '15px' }}>
              <a
                href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1C2E4A',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#334E7B'}
                onMouseOut={(e) => e.target.style.background = '#1C2E4A'}
              >
                Download our Mobile Application
              </a>
              <button 
                className="btn-cancel" 
                onClick={() => setShowMobilePopup(false)}
                style={{ marginTop: '10px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div className="popup-content" style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            border: '2px solid #dc3545'
          }}>
            <div style={{
              backgroundColor: '#dc3545',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2z" fill="white"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" fill="white"/>
              </svg>
            </div>
            <h2 style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '1.4em',
              fontWeight: '600'
            }}>Something went wrong</h2>
            <p style={{
              color: '#666',
              marginBottom: '25px',
              fontSize: '1.1em',
              lineHeight: '1.5'
            }}>{errorMessage}</p>
            <button 
              onClick={() => setShowErrorPopup(false)}
              style={{
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1.1em',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#c82333'}
              onMouseOut={(e) => e.target.style.background = '#dc3545'}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBottomNavBar;
