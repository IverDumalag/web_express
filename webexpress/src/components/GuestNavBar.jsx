import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GuestNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const accountRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = window.location.pathname;
  const loc = useLocation();

  // Helper to handle nav item click for About/Features
  const handleNavScroll = (section) => {
    if (location === "/") {
      window.dispatchEvent(new CustomEvent("guestnav-scroll", { detail: { section } }));
    } else {
      navigate("/", { state: { scrollTo: section } });
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (accountRef.current && accountRef.current.contains(event.target)) {
        setDropdownOpen((open) => !open);
      } else if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="left-section" style={{ marginLeft: '-15.7rem' }}>
          <span className="brand-link" onClick={() => navigate("/")}>
            exPress
          </span>
          <div className="nav-item" onClick={() => handleNavScroll("about")}>ABOUT</div>
          <div className="nav-item" onClick={() => handleNavScroll("features")}>FEATURES</div>
        </div>

        <div className="right-section" style={{ marginRight: '-20.7rem' }}>
          <a
            className="download-link"
            href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download App
          </a>

          <div className="account-container" ref={accountRef}>
            <span className="account-icon" role="img" aria-label="account"
              onClick={e => { e.stopPropagation(); setShowAuthModal(true); }}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowAuthModal(true); } }}
            >
              &#128100;
            </span>
          </div>
        </div>
      </div>

      {/* Auth Modal (glassmorphic, usercard style) */}
      {showAuthModal && (
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
        }} onClick={() => setShowAuthModal(false)}>
          <div style={{
            borderRadius: 20,
            border: '1px solid #fff',
            background: 'rgba(255, 255, 255, 0.10)',
            boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
            backdropFilter: 'blur(18.3px)',
            WebkitBackdropFilter: 'blur(18.3px)',
            width: '95%',
            maxWidth: 460,
            padding: '8.2em 2.7em 2.7em 2.7em', // wider and more medium
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            color: '#334E7B',
            fontFamily: 'Roboto Mono, monospace',
            alignItems: 'center',
            gap: '1.5em',
            position: 'relative',
            animation: 'modal-pop 0.22s cubic-bezier(.68,-0.55,.27,1.55)'
          }} onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 22,
                background: 'none',
                border: 'none',
                fontSize: '1.5em',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '2.9em', fontFamily: 'Inconsolata, monospace', color: '#FFFFFF' }}>
              Login or Sign Up
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '0.5em', alignItems: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); navigate('/login'); }}
                style={{
                  background: '#1C2E4A',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  width: '100%',
                  maxWidth: 300,
                  minWidth: 180,
                  boxSizing: 'border-box',
                  margin: '0 auto',
                  display: 'block',
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); navigate('/register'); }}
                style={{
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
                  width: '100%',
                  maxWidth: 300,
                  minWidth: 180,
                  boxSizing: 'border-box',
                  margin: '0 auto',
                  display: 'block',
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GuestNavBar;
