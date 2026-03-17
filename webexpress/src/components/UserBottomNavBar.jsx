import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiHelpCircle, FiLogOut, FiDownload } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { getUserData } from '../data/UserData';
import qrCodeImg from '../assets/express_apk_qr.png';
import UserProfile from '../user/UserProfile';
import '../CSS/UserBottomNavBar.css';

const navs = [
  { label: "Home",       path: "/userhome" },
  { label: "Cards",      path: "/usercards" },
  { label: "FSL→Text",   path: "mobile-exclusive", isMobileExclusive: true },
  { label: "Audio→FSL",  path: "mobile-exclusive", isMobileExclusive: true },
  { label: "Menu",       path: "/usermenu" },
];

const UserBottomNavBar = () => {
  const navigate  = useNavigate();
  const location  = window.location.pathname;
  const [cardsActive,      setCardsActive]      = useState(false);
  const [dropdownOpen,     setDropdownOpen]     = useState(false);
  const [showLogoutPopup,  setShowLogoutPopup]  = useState(false);
  const [showMobilePopup,  setShowMobilePopup]  = useState(false);
  const [showErrorPopup,   setShowErrorPopup]   = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [errorMessage,     setErrorMessage]     = useState('');
  const dropdownRef = useRef(null);

  const userData  = getUserData();
  const userName  = userData ? `${userData.f_name || ''} ${userData.l_name || ''}`.trim() : 'User';
  const userEmail = userData?.email || 'user@example.com';

  const showError = (msg) => { setErrorMessage(msg); setShowErrorPopup(true); };

  useEffect(() => { setCardsActive(location === "/usercards"); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (nav) => {
    try {
      if (nav.isMobileExclusive) setShowMobilePopup(true);
      else navigate(nav.path);
    } catch (e) { showError('Unable to navigate to the requested page. Please try again.'); }
  };

  const handleAccountClick  = () => setDropdownOpen((prev) => !prev);
  const handleDropdownClick = (path) => { navigate(path); setDropdownOpen(false); };
  const handleLogoutClick   = () => { setShowLogoutPopup(true); setDropdownOpen(false); };

  const confirmLogout = () => {
    try {
      setShowLogoutPopup(false);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (e) { showError('Something went wrong while logging out. Please try again.'); }
  };

  return (
    <>
      {/* ── Inline responsive styles for the navbar ── */}
      <style>{`
        .user-top-nav {
          width: 100%;
          background: #1C2E4A;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(0.8rem, 4vw, 2rem);
          position: sticky;
          top: 0;
          z-index: 10;
          font-family: 'Inder', monospace;
          color: #fff;
          box-sizing: border-box;
        }
        .user-top-nav-links {
          display: flex;
          gap: clamp(0.6rem, 2.5vw, 2.5rem);
          align-items: center;
          height: 60px;
          overflow: hidden;
          justify-content: center;
          flex: 1;
        }
        .user-top-nav-link {
          cursor: pointer;
          padding: 0 clamp(0.2rem, 0.8vw, 0.6rem);
          /* FIX: fluid font size — was a fixed 1.3em that caused overflow */
          font-size: clamp(0.75rem, 2.2vw, 1.2rem);
          white-space: nowrap;
          transition: opacity 0.15s;
          color: #fff;
        }
        .user-top-nav-link.active {
          border-bottom: 3px solid #fff;
        }
        .user-top-nav-link:hover { opacity: 0.8; }

        /* FIX: account icon — absolute right, won't push nav items */
        .user-top-nav-account {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          margin-left: clamp(0.5rem, 2vw, 1rem);
        }

        /* On very small phones hide the two mobile-exclusive labels */
        @media (max-width: 380px) {
          .nav-label-mobile-exclusive { display: none; }
          .user-top-nav-link.mobile-exclusive-link::after {
            content: attr(data-short);
            font-size: 0.7rem;
          }
        }
      `}</style>

      <nav className="user-top-nav">
        {/* Nav Links */}
        <div className="user-top-nav-links">
          {navs.map((nav) => {
            const isActive = location === nav.path && !nav.isMobileExclusive;
            return (
              <span
                key={nav.label}
                className={`user-top-nav-link${isActive ? ' active' : ''}${nav.isMobileExclusive ? ' mobile-exclusive-link' : ''}`}
                data-short={nav.label.replace('→', '→').slice(0, 5)}
                onClick={() => handleNavClick(nav)}
              >
                <span className={nav.isMobileExclusive ? 'nav-label-mobile-exclusive' : ''}>
                  {nav.label}
                </span>
              </span>
            );
          })}
        </div>

        {/* Account icon — kept separate, flex-shrink: 0 */}
        <div ref={dropdownRef} className="user-top-nav-account">
          <FaUserCircle size={28} onClick={handleAccountClick} />

          {dropdownOpen && (
            <div className="account-dropdown" style={{
              minWidth: 280,
              maxWidth: 'min(95vw, 540px)', /* FIX: cap at viewport on mobile */
              borderRadius: 8,
              right: 0,
              top: '44px',
            }}>
              <div className="dropdown-header">
                <div>
                  <div className="dropdown-name">{userName}</div>
                  <div className="dropdown-email">{userEmail}</div>
                </div>
              </div>

              <div
                className="dropdown-item"
                onClick={() => { setShowProfilePopup(true); setDropdownOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.85em 1.2em', fontFamily: 'Inconsolata, monospace', fontSize: '0.98em', fontWeight: 600, color: '#334E7B', cursor: 'pointer', borderRadius: 8 }}
                onMouseOver={e => { e.currentTarget.style.background = '#f3f7fb'; }}
                onMouseOut={e  => { e.currentTarget.style.background = 'transparent'; }}
              >
                <FaUserCircle size={20} style={{ minWidth: 20 }} />
                <span>Profile</span>
              </div>

              <div style={{ width: '92%', height: 0, borderTop: '1px solid #334E7B', margin: '0.18em auto' }} />

              <div
                className="dropdown-item"
                onClick={() => { setShowMobilePopup(true); setDropdownOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.85em 1.2em', fontFamily: 'Inconsolata, monospace', fontSize: '0.98em', fontWeight: 600, color: '#334E7B', borderRadius: 8, cursor: 'pointer' }}
              >
                <FiDownload size={20} style={{ minWidth: 20 }} />
                <span>Download our App</span>
              </div>

              <div style={{ width: '92%', height: 0, borderTop: '1px solid #334E7B', margin: '0.18em auto' }} />

              <div
                className="dropdown-item logout"
                onClick={handleLogoutClick}
                style={{ color: '#e74c3c', borderRadius: 10, fontWeight: 700, fontFamily: 'Inconsolata, monospace', fontSize: '1em', display: 'flex', alignItems: 'center', gap: 12, padding: '0.85em 1.2em', cursor: 'pointer' }}
                onMouseOver={e => { e.currentTarget.style.background = '#ffd6d6'; }}
                onMouseOut={e  => { e.currentTarget.style.background = '#ffeaea'; }}
              >
                <FiLogOut size={20} style={{ color: '#e74c3c', minWidth: 20 }} />
                <span style={{ color: '#e74c3c' }}>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.08)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1em' }}>
          <div style={{ borderRadius: 20, border: '2px solid #334E7B', background: '#fff', width: '95%', maxWidth: 440, padding: 'clamp(1.5em,4vw,2.5em)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#334E7B', fontFamily: 'Roboto Mono, monospace', alignItems: 'stretch', gap: '0.7em', position: 'relative' }}>
            <div style={{ fontWeight: 700, fontSize: 'clamp(1.4em,4vw,2em)', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: '#334E7B' }}>Logout Confirmation</div>
            <div style={{ color: '#334E7B', textAlign: 'center', marginBottom: '1.2em', fontSize: '1.1em', fontWeight: 800 }}>Are you sure you want to logout?</div>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button onClick={confirmLogout} style={{ flex: 1, background: '#ef7070ff', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.7em 0', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer' }}>Logout</button>
              <button onClick={() => setShowLogoutPopup(false)} style={{ flex: 1, background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.7em 0', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Exclusive Popup */}
      {showMobilePopup && (
        <div style={{ position: 'fixed', zIndex: 3002, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1em' }}>
          <style>{`.mobile-popup-animate { animation: fadeScaleIn 0.32s cubic-bezier(.4,2,.6,1); } @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }`}</style>
          <div className="mobile-popup-animate" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)', border: '1px solid #334E7B', width: '98%', maxWidth: 720, padding: 'clamp(1em,3vw,2.5em)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#fff', fontFamily: 'Roboto Mono, monospace', position: 'relative' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center', marginBottom: '1.2em', fontSize: '1.1em', fontWeight: 800, color: '#334E7B' }}>This is a Mobile Exclusive function.</div>
              {/* FIX: flex-direction column on small screens */}
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 'clamp(1em,3vw,2.2em)' }}>
                <img src={qrCodeImg} alt="QR Code to download exPress app" style={{ width: 'clamp(120px,30vw,180px)', height: 'clamp(120px,30vw,180px)', objectFit: 'contain', border: '2px solid #334E7B', borderRadius: 12 }} />
                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 'clamp(1em,3vw,1.8em)', fontWeight: 700, marginBottom: '0.5em', color: '#334E7B', textAlign: 'center' }}>Download <span style={{ color: '#4C75F2' }}>exPress</span> on Android</h3>
                  <p style={{ fontSize: '1em', marginBottom: '1em', color: '#334E7B', textAlign: 'center' }}>Get the full experience by installing the app.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1em' }}>
                    <a href="https://drive.google.com/uc?export=download&id=1RvjOzqLLVCQq0EqvUltaqqO-VDKdq_rU" target="_blank" rel="noopener noreferrer" style={{ background: '#334E7B', color: '#fff', border: '2px solid #334E7B', borderRadius: 12, padding: '0.5em 1.5em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5em', whiteSpace: 'nowrap' }}>
                      <FiDownload size={18} aria-hidden="true" /><span>APK Download</span>
                    </a>
                    <button onClick={() => setShowMobilePopup(false)} style={{ background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.7em 1.5em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer' }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1em' }}>
          <div style={{ background: '#fff', padding: 'clamp(1em,3vw,2em)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', maxWidth: 400, width: '100%', textAlign: 'center', border: '2px solid #dc3545', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#dc3545', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M11 15h2v2h-2zm0-8h2v6h-2z" fill="white"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" fill="white"/></svg>
            </div>
            <h2 style={{ color: '#dc3545', marginBottom: 15, fontSize: '1.4em', fontWeight: 600 }}>Something went wrong</h2>
            <p style={{ color: '#666', marginBottom: 25, fontSize: '1.1em', lineHeight: 1.5 }}>{errorMessage}</p>
            <button onClick={() => setShowErrorPopup(false)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '1.1em' }}>Got it</button>
          </div>
        </div>
      )}

      <UserProfile showModal={showProfilePopup} onCloseModal={() => setShowProfilePopup(false)} />
    </>
  );
};

export default UserBottomNavBar;  