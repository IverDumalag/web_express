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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    try {
      clearUserData();
      localStorage.clear();
      sessionStorage.clear();
      setDropdownOpen(false);
      setShowLogoutPopup(false);
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      showError('Something went wrong while logging out. Please try again.');
    }
  };

  const confirmLogout = () => {
    handleLogout();
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      showError('Unable to navigate to the requested page. Please try again.');
    }
  };

  return (
    <>
      <div className="admin-outer-layout">
        <nav className="admin-navbar-top" style={{
          padding: '1% 3% 0.2% 3%',
          zIndex: 3000, // Ensure navbar is always above sidebar
          position: 'fixed', // Make navbar fixed to top
          top: 0,
          left: 0,
          width: '100%',
        }}>
          <div className="admin-navbar-left" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <button
              className="admin-hamburger-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginRight: 24, 
                marginTop: '-8px', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                height: 40,
                width: 40,
                justifyContent: 'center',
                outline: 'none',
              }}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="5" width="28" height="3.5" rx="1.5" fill="#fff" />
                <rect y="12" width="28" height="3.5" rx="1.5" fill="#fff" />
                <rect y="19" width="28" height="3.5" rx="1.5" fill="#fff" />
              </svg>
            </button>
            <span
              className="admin-brand-link"
              onClick={() => handleNavigation("/adminanalytics")}
              style={{ position: 'relative', top: '-2px' }}
            >
              exPress
            </span>
          </div>
          <div className="admin-navbar-right" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="admin-avatar-container" ref={avatarRef} style={{ position: 'relative', top: '-3px' }}>
              <span className="admin-avatar-icon" title="Account" style={{ cursor: 'pointer', fontSize: 32, background: '#fff', color: '#334E7B', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, boxShadow: '0 2px 8px rgba(51,78,123,0.13)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="14" cy="11.5" rx="5.5" ry="5.5" fill="#334E7B"/>
                  <ellipse cx="14" cy="21" rx="8.5" ry="4" fill="#334E7B"/>
                </svg>
              </span>
              <div
                className={`admin-dropdown${dropdownOpen ? " show" : ""}`}
                ref={dropdownRef}
                style={dropdownOpen ? {
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  minWidth: 0,
                  width: 180,
                  background: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  padding: '0.05em 0.15em', // reduced padding
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  fontFamily: 'Roboto mono, monospace',
                  fontSize: '1.01em',
                  fontWeight: 500,
                  border: '1px solid #334E7B',
                  zIndex: 3003,
                  transition: 'opacity 0.2s',
                  opacity: 1
                } : { display: 'none' }}
              >
              <button
                className="admin-dropdown-btn"
                style={{ fontWeight: 500 }}
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    setDropdownOpen(false);
                    setShowProfile(true);
                  } catch (error) {
                    console.error('Profile error:', error);
                    showError('Unable to open profile. Please try again.');
                  }
                }}
              >
                Profile
              </button>
              <hr style={{ borderTop: '1px solid rgb(51, 78, 123)', borderRight: 'none', borderBottom: 'none', borderLeft: 'none', margin: '0.1em 0' }} />
              <button
                className="admin-dropdown-btn"
                style={{ fontWeight: 500 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  setShowLogoutPopup(true);
                }}
              >
                Logout
              </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="admin-content-layout" style={{ position: 'relative', width: '100%' }}>
          {/* Sidebar absolutely/fixed positioned, does not affect main content flow */}
          <nav
            className="admin-sidebar-vertical"
            style={{
              display: sidebarOpen ? 'flex' : 'none',
              flexDirection: 'column',
              flex: '0 0 220px',
              minWidth: 0,
              maxWidth: 260,
              height: '100vh',
              background: '#334E7B',
              color: '#fff',
              boxShadow: '2px 0 8px rgba(51,78,123,0.08)',
              zIndex: 2000, // Lower than navbar
              transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
              position: 'fixed',
              marginTop: 0,
              top: 0,
              left: 0,
            }}
          >
            <div className="admin-sidebar-links" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              {sideLinks.map(link => (
                <button
                  key={link.path}
                  className={`admin-sidebar-link${location.pathname === link.path ? " active" : ""}`}
                  onClick={() => handleNavigation(link.path)}
                  style={{
                    background: location.pathname === link.path ? '#fff' : 'transparent',
                    color: location.pathname === link.path ? '#334E7B' : '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 18px',
                    margin: '0 12px',
                    fontWeight: 600,
                    fontSize: '1.08em',
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                    boxShadow: location.pathname === link.path ? '0 2px 8px rgba(51,78,123,0.10)' : 'none',
                  }}
                >
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </nav>
          {/* Main content always left-aligned, with left padding to account for sidebar width */}
          <div className="admin-main-content" style={{ paddingLeft: sidebarOpen ? 220 : 0, transition: 'padding-left 0.2s', width: '100%' }}>
            {/* Place your page content below */}
            {children}
          </div>
        </div>
      </div>

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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
                <path d="M11 15h2v2h-2zm0-8h2v6h-2z" fill="white"/>
              </svg>
            </div>
            <h2 style={{
              color: '#dc3545',
              marginBottom: '15px',
              fontSize: '1.4em',
              fontWeight: '600'
            }}>Oops! Something went wrong</h2>
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

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
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
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#334E7B',
              marginBottom: '15px',
              fontSize: '1.4em',
              fontWeight: '600'
            }}>Confirm Logout</h2>
            <p style={{
              color: '#666',
              marginBottom: '25px',
              fontSize: '1.1em',
              lineHeight: '1.4'
            }}>Are you sure you want to log out?</p>
            <div className="popup-buttons" style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button 
                className="btn-cancel" 
                onClick={() => setShowLogoutPopup(false)}
                style={{
                  background: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1em',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#e9e9e9'}
                onMouseOut={(e) => e.target.style.background = '#f5f5f5'}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={confirmLogout}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1em',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#c82333'}
                onMouseOut={(e) => e.target.style.background = '#dc3545'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminProfile open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}