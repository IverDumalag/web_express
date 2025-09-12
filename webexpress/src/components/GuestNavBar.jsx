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
  };

  const handleSmoothScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Scroll error:', error);
      // Fallback for older browsers
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
      <nav
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.8em 6em",
          background: "#fff",
          fontFamily: "Roboto Mono, monospace",
          width: "100%",
          borderBottom: "1px solid #eee",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        {/* Brand */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              // Use the same mechanism as other nav items to scroll to top/hero section
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
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1.1em",
            color: "#1C2E4A",
            marginLeft: "100px",
            userSelect: "none",
          }}
        >
          ex<span style={{ color: "#2354C7" }}>Press</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5em",
            color: "#1C2E4A",
            cursor: "pointer",
            padding: "5px",
          }}
        >
          ☰
        </button>

        {/* Nav Links */}
        <div
          className="nav-links"
          style={{
            display: "flex",
            gap: "2em",
            fontSize: "0.95em",
            alignItems: "center",
          }}
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleNavScroll("about")}
          >
            About
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleNavScroll("challenges")}
          >
            Challenges
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleNavScroll("features")}
          >
            Features
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleNavScroll("faqs")}
          >
            FAQs
          </span>
        </div>

        {/* Download + Account */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <a
            href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#334E7B", fontWeight: 600 }}
          >
            Download App
          </a>

          <div className="account-container" ref={accountRef}>
            <span
              className="account-icon"
              role="img"
              aria-label="account"
              onClick={(e) => {
                e.stopPropagation();
                setShowAuthModal(true);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowAuthModal(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <svg
                width="80"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #eee",
            borderTop: "none",
            zIndex: 1000,
            padding: "1em",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1em",
              fontSize: "1em",
            }}
          >
            <span
              style={{ cursor: "pointer", padding: "0.5em" }}
              onClick={() => {
                handleNavScroll("about");
                setMobileMenuOpen(false);
              }}
            >
              About
            </span>
            <span
              style={{ cursor: "pointer", padding: "0.5em" }}
              onClick={() => {
                handleNavScroll("challenges");
                setMobileMenuOpen(false);
              }}
            >
              Challenges
            </span>
            <span
              style={{ cursor: "pointer", padding: "0.5em" }}
              onClick={() => {
                handleNavScroll("features");
                setMobileMenuOpen(false);
              }}
            >
              Features
            </span>
            <span
              style={{ cursor: "pointer", padding: "0.5em" }}
              onClick={() => {
                handleNavScroll("faqs");
                setMobileMenuOpen(false);
              }}
            >
              FAQs
            </span>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          onClick={() => setShowAuthModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3002,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "95%",
              maxWidth: 460,
              padding: "8.2em 2.7em 2.7em",
              borderRadius: 20,
              border: "2px solid #334E7B",
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(18px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5em",
              color: "#334E7B",
              animation: "modal-pop 0.22s cubic-bezier(.68,-0.55,.27,1.55)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                background: "none",
                border: "none",
                fontSize: "1.5em",
                color: "#334E7B",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ×
            </button>

            <div
              style={{
                fontWeight: 700,
                fontSize: "2em",
                textAlign: "center",
                marginBottom: "2.9em",
                fontFamily: "Inconsolata, monospace",
                color: "#334E7B",
              }}
            >
              Login or Register
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                marginTop: "0.5em",
                alignItems: "center",
                width: "100%",
              }}
            >
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/login");
                }}
                style={{
                  background: "#1C2E4A",
                  color: "#fff",
                  border: "2px solid #fff",
                  borderRadius: 12,
                  padding: "0.7em 0",
                  fontWeight: 700,
                  fontSize: "1.1em",
                  fontFamily: "Inconsolata, monospace",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: 300,
                  minWidth: 180,
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/register");
                }}
                style={{
                  background: "#52677D",
                  color: "#fff",
                  border: "2px solid #fff",
                  borderRadius: 12,
                  padding: "0.7em 0",
                  fontWeight: 700,
                  fontSize: "1.1em",
                  fontFamily: "Inconsolata, monospace",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: 300,
                  minWidth: 180,
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
        <div style={{
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
          <div style={{
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

export default GuestNavBar;
