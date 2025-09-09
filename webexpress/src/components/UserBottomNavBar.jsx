import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiClipboard, FiHelpCircle, FiLogOut } from "react-icons/fi";
import '../CSS/UserBottomNavbar.css';

const navs = [
  { label: "Home", path: "/userhome" },
  { label: "Cards", path: "/usercards" },
  { label: "Menu", path: "/usermenu" },
];

const UserBottomNavBar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [cardsActive, setCardsActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleNavClick = (nav) => navigate(nav.path);
  const handleAccountClick = () => setDropdownOpen((prev) => !prev);
  const handleDropdownClick = (path) => { navigate(path); setDropdownOpen(false); };

  // Show confirmation popup
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
    setDropdownOpen(false);
  };

  // Confirm logout
  const confirmLogout = () => {
    setShowLogoutPopup(false);
    navigate("/login"); // or wherever the logout redirects
    // optionally clear auth tokens here
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
        <div className="guest-navbar-links" style={{ display: 'flex', gap: '3vw', alignItems: 'center', height: '60px' }}>
          {navs.map((nav) => {
            const isActive = location === nav.path;
            return (
              <span
                key={nav.path}
                className={`guest-navbar-link${isActive ? ' active' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '0 1vw',
                  borderBottom: isActive ? '3px solid #fff' : 'none',
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
                  <div className="dropdown-name">Angel Aisha Ross</div>
                  <div className="dropdown-email">rossangelaisha@gmail.com</div>
                </div>
              </div>

              <div className="dropdown-item" onClick={() => handleDropdownClick("/usermenu")}>
                <FiClipboard size={20} /><span>Menu</span>
              </div>
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
                <FiLogOut size={20} /><span>Sign Out</span>
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
    </>
  );
};

export default UserBottomNavBar;
