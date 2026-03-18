import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import expressLogo from "../assets/express.png";
import "../CSS/GuestNavBar.css";

const GuestNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const accountRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = window.location.pathname;
  const loc = useLocation();

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const handleNavScroll = (section) => {
    try {
      if (location === "/") {
        window.dispatchEvent(
          new CustomEvent("guestnav-scroll", { detail: { section } })
        );
      } else {
        navigate("/", { state: { scrollTo: section } });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      showError('Unable to navigate to the requested section. Please try refreshing the page.');
    }
    // Close mobile menu after navigation
    setMobileMenuOpen(false);
  };

  const handleSmoothScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (accountRef.current && accountRef.current.contains(event.target)) {
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

  return (
    <>
      {/* RESPONSIVE FIX: Moved all inline styles to GuestNavBar.css so media queries can override them */}
      <nav className="navbar guest-navbar">
        {/* Brand */}
        <div
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              if (location === "/") {
                window.dispatchEvent(
                  new CustomEvent("guestnav-scroll", { detail: { section: "hero" } })
                );
              } else {
                navigate("/", { state: { scrollTo: "hero" } });
              }
            } catch (error) {
              console.error('Brand navigation error:', error);
              showError('Unable to navigate to the home page. Please try refreshing the page.');
            }
          }}
        >
          ex<span className="brand-accent">Press</span>
        </div>

        {/* RESPONSIVE FIX: Hamburger button — no inline display:none, controlled by CSS only */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Nav Links — hidden on mobile via CSS, shown in mobile dropdown */}
        <div className="nav-links">
          <span className="nav-link" onClick={() => handleNavScroll("about")}>About</span>
          <span className="nav-link" onClick={() => handleNavScroll("challenges")}>Challenges</span>
          <span className="nav-link" onClick={() => handleNavScroll("features")}>Features</span>
          <span className="nav-link" onClick={() => handleNavScroll("faqs")}>FAQs</span>
        </div>

        {/* Download + Account */}
        <div className="nav-right-actions">
          <span
            className="nav-download-link"
            onClick={() => {
              try {
                window.dispatchEvent(new CustomEvent("show-download-popup"));
              } catch (error) {
                console.error('Download popup error:', error);
                showError('Unable to show download popup. Please try refreshing the page.');
              }
            }}
          >
            Download App
          </span>

          <div className="account-container" ref={accountRef}>
            <span
              className="account-icon"
              role="button"
              aria-label="Account menu"
              onClick={(e) => {
                e.stopPropagation();
                setShowAuthModal(true);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowAuthModal(true);
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1C2E4A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <circle cx="12" cy="8.2" r="4.2" />
                <path d="M4 20c0-3.6 3.2-6.5 8-6.5s8 2.9 8 6.5" />
              </svg>
            </span>
          </div>
        </div>
      </nav>

      {/* RESPONSIVE FIX: Mobile dropdown menu — rendered conditionally, full-width */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <span className="mobile-menu-item" onClick={() => handleNavScroll("about")}>About</span>
          <span className="mobile-menu-item" onClick={() => handleNavScroll("challenges")}>Challenges</span>
          <span className="mobile-menu-item" onClick={() => handleNavScroll("features")}>Features</span>
          <span className="mobile-menu-item" onClick={() => handleNavScroll("faqs")}>FAQs</span>
          <span
            className="mobile-menu-item"
            onClick={() => {
              try { window.dispatchEvent(new CustomEvent("show-download-popup")); } catch(e) {}
              setMobileMenuOpen(false);
            }}
          >
            Download App
          </span>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="auth-modal-overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="auth-modal-close"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="auth-modal-title">Login or Register</div>

            <div className="auth-modal-buttons">
              <button
                className="auth-btn auth-btn-login"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="auth-btn auth-btn-register"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/register");
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="error-popup-overlay">
          <div className="error-popup-content">
            <div className="error-popup-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2z" fill="white"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" fill="white"/>
              </svg>
            </div>
            <h2 className="error-popup-title">Something went wrong</h2>
            <p className="error-popup-message">{errorMessage}</p>
            <button
              className="error-popup-btn"
              onClick={() => setShowErrorPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestNavBar;