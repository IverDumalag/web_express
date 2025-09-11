import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { getUserData } from '../data/UserData';
import downloadImg from '../assets/download.png';
import '../CSS/UserBottomNavBar.css';

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
          <FaUserCircle size={28} onClick={handleAccountClick} />

          {dropdownOpen && (
            <div className="account-dropdown" style={{ minWidth: 330, maxWidth: 540 , borderRadius: 8}}>
              <div className="dropdown-header">
                <div>
                  <div className="dropdown-name">{userName} </div>
                  <div className="dropdown-email">{userEmail}</div>
                </div>
              </div>

              {/* <div className="dropdown-item" onClick={() => handleDropdownClick("/usermenu")}>
                <FiClipboard size={20} /><span>Menu</span>
              </div> */}
              <div 
                className="dropdown-item" 
                onClick={() => handleDropdownClick("/userprofile")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0.85em 1.2em',
                  fontFamily: 'Inconsolata, monospace',
                  fontSize: '0.98em',
                  fontWeight: 600,
                  color: '#334E7B',
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                  borderRadius: 8,
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#f3f7fb'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <FaUserCircle size={20} style={{ minWidth: 20 }} />
                <span>Profile</span>
              </div>
              <div
                style={{
                  width: '92%',
                  height: 0,
                  borderTop: '1px solid #334E7B',
                  margin: '0.18em auto 0.18em auto',
                  display: 'flex',
                }}
              />
              <div 
                className="dropdown-item" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0.85em 1.2em',
                  fontFamily: 'Inconsolata, monospace',
                  fontSize: '0.98em',
                  fontWeight: 600,
                  color: '#334E7B',
                  borderRadius: 8,
                }}
              >
                <FiHelpCircle size={20} style={{ minWidth: 20 }} />
                <a
                  href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#334E7B', textDecoration: 'none', marginLeft: 0, fontWeight: 600 }}
                >
                  Download our App
                </a>
              </div>
              <div
                style={{
                  width: '92%',
                  height: 0,
                  borderTop: '1px solid #334E7B',
                  margin: '0.18em auto 0.18em auto',
                  display: 'flex',
                }}
              />
              <div
                className="dropdown-item logout"
                onClick={handleLogoutClick}
                style={{
                  color: '#e74c3c',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontFamily: 'Inconsolata, monospace',
                  fontSize: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0.85em 1.2em',
                  margin: 0,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#ffd6d6'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#ffeaea'; }}
              >
                <FiLogOut size={20} style={{ color: '#e74c3c', minWidth: 20 }} />
                <span style={{ color: '#e74c3c' }}>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay" style={{
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
                  background: '#ef7070ff',
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
                onClick={() => setShowLogoutPopup(false)}
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

      {/* Mobile Exclusive Feature Popup */}
      {showMobilePopup && (
        <div style={{
          position: 'fixed',
          zIndex: 3002,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <style>{`
            .mobile-popup-animate {
              animation: fadeScaleIn 0.32s cubic-bezier(.4,2,.6,1);
            }
            @keyframes fadeScaleIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <div className="mobile-popup-animate" style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
            border: '1px solid #334E7B',
            width: '98%',
            maxWidth: 720,
            padding: '2.5em 2.5em 2em 2.5em',
            display: 'flex',
            flexDirection: 'row',
            boxSizing: 'border-box',
            color: '#fff',
            fontFamily: 'Roboto Mono, monospace',
            alignItems: 'center',
            gap: '2.2em',
            position: 'relative',
          }}>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                textAlign: 'center',
                marginBottom: '1.2em',
               
                fontSize: '1.1em',
                fontWeight: 800,
                color: '#334E7B',
              }}>
                This is a Mobile Exclusive function.
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2.2em' }}>
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 }}>
                  <style>{`
                    @keyframes floatDownloadImg {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(-18px); }
                      100% { transform: translateY(0); }
                    }
                  `}</style>
                  <img
                    src={downloadImg}
                    alt="Download"
                    style={{
                      width: 240,
                      height: 210,
                      margin: 0,
                      padding: 0,
                      objectFit: 'contain',
                      animation: 'floatDownloadImg 2.2s ease-in-out infinite',
                      display: 'block',
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ 
      
                    borderRadius: '1em', 
                    padding: '1.5em', 
                    textAlign: 'center',
                    marginBottom: '1.5em'
                  }}>
                    <h3 style={{ fontSize: '1.8em', fontWeight: 700, marginBottom: '0.5em', color: '#334E7B' }}>
                      Download <span style={{ color: '#4C75F2' }}>exPress</span> Mobile App
                    </h3>
                    <p style={{ fontSize: '1em', marginBottom: '1em', color: '#334E7B' }}>
                      Get the full experience by installing the app.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.2em', marginTop: '1.2em' }}>
                    <a
                      href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        minWidth: 120,
                        maxWidth: 180,
                        background: '#334E7B',
                        color: '#fff',
                        border: '2px solid #334E7B',
                        borderRadius: 12,
                        padding: '0.50em 1.5em',
                        fontWeight: 700,
                        fontSize: '1.1em',
                        fontFamily: 'Inconsolata, monospace',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        marginTop: 0,
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ⬇ APK Download
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowMobilePopup(false)}
                      style={{
                        minWidth: 120,
                        maxWidth: 180,
                        background: '#52677D',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: 12,
                        padding: '0.7em 1.5em',
                        fontWeight: 700,
                        fontSize: '1.1em',
                        fontFamily: 'Inconsolata, monospace',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        marginTop: 0,
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
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
