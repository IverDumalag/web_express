import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GuestNavBar.css";

const GuestNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const accountRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = window.location.pathname;
  const loc = useLocation();

  const handleNavScroll = (section) => {
    if (location === "/") {
      window.dispatchEvent(
        new CustomEvent("guestnav-scroll", { detail: { section } })
      );
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
    <nav className="navbar guest-navbar">
      <div className="guest-download-account">
        <a className="guest-download-link" href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN" target="_blank" rel="noopener noreferrer">
          Download App
        </a>

        <div className="account-container" ref={accountRef}>
          <span className="account-icon" role="img" aria-label="account"
            onClick={e => { e.stopPropagation(); setShowAuthModal(true); }}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowAuthModal(true); } }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C2E4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="account-icon-svg">
              <circle cx="12" cy="8.2" r="4.2" />
              <path d="M4 20c0-3.6 3.2-6.5 8-6.5s8 2.9 8 6.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="guest-auth-modal-bg" onClick={() => setShowAuthModal(false)}>
          <div className="guest-auth-modal" onClick={e => e.stopPropagation()}>
            <button className="guest-auth-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            <div className="guest-auth-modal-title">Login or Sign Up</div>
            <div className="guest-auth-modal-btns">
              <button className="guest-auth-modal-login" onClick={() => { setShowAuthModal(false); navigate("/login"); }}>Login</button>
              <button className="guest-auth-modal-signup" onClick={() => { setShowAuthModal(false); navigate("/register"); }}>Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GuestNavBar;
