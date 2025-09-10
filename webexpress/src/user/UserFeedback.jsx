import React, { useState, useEffect } from 'react';
import MessagePopup from '../components/MessagePopup';
import { getUserData } from '../data/UserData';
import '../CSS/UserProfile.css';

const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACKINSERT;

const MAIN_CONCERN_OPTIONS = [
  "Word/Phrases No Match",
  "Bug Found",
  "Suggestion"
];

export default function UserFeedback({ showModal, onCloseModal }) {
  const [mainConcern, setMainConcern] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });
  const [showSuccess, setShowSuccess] = useState(false);

  const userData = getUserData();
  const user_id = userData?.user_id || "";
  const [user_email] = useState(userData?.email || "");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      setMainConcern("");
      setDetails("");
      setShowSuccess(false);
    }
  }, [showModal]);

  const handleCloseModal = () => {
    if (onCloseModal) onCloseModal();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!user_id) {
      setPopup({ open: true, message: "User not logged in. Please log in again.", type: "error" });
      return;
    }
    if (!mainConcern.trim() || !details.trim() || !user_email.trim()) {
      setPopup({ open: true, message: "Please fill in all fields.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id,
        email: user_email,
        main_concern: mainConcern,
        details
      };
      const res = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === 201 || json.status === "201") {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          handleCloseModal();
        }, 3000);
      } else {
        setPopup({ open: true, message: json.message || "Failed to submit feedback.", type: "error" });
      }
    } catch (e) {
      setPopup({ open: true, message: "Network error submitting feedback.", type: "error" });
    }
    setLoading(false);
  };

  if (!showModal) return null;

  return (
    <>
      {showSuccess && (
        <div className="profile-popup-center-bg" style={{ zIndex: 3005 }}>
          <div className="profile-popup-center" style={{
            background: '#fff',
            borderRadius: '1.2em',
            boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
            padding: '1.5em 1.7em',
            minWidth: 320,
            maxWidth: 320,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1em',
            border: '2px solid #334E7B',
            fontFamily: 'Roboto Mono, monospace',
            position: 'relative',
          }}>
            <button
              onClick={() => {
                setShowSuccess(false);
                handleCloseModal();
              }}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: '1.3em',
                color: '#2563eb',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="30" fill="#e0f2fe"/>
              <path d="M18 32L27 41L43 25" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
      
            <div style={{ color: '#334E7B', fontWeight: 700, fontSize: '1.3em', textAlign: 'center', marginBottom: 4 }}>Feedback submitted. Thank you!</div>
          </div>
        </div>
      )}
      {popup.open && popup.type === 'error' && (
        <div className="profile-popup-center-bg" style={{ zIndex: 3007 }}>
          <div style={{
            background: '#fff',
            borderRadius: '2.2em',
            boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
            maxWidth: 520,
            minWidth: 220,
            width: '95%',
            padding: '2.2em 2.2em 1.7em 2.2em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid #334E7B',
            fontFamily: 'Roboto Mono, monospace',
            position: 'relative',
            animation: 'profile-modal-pop 0.32s cubic-bezier(.4,2,.6,1)'
          }}>
            <button
              onClick={() => setPopup(p => ({ ...p, open: false }))}
              style={{
                position: 'absolute',
                top: 18,
                right: 22,
                background: 'none',
                border: 'none',
                fontSize: '1.5em',
                color: '#2563eb',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ verticalAlign: 'middle' }}>
                <rect x="4" y="6" width="24" height="20" rx="6" fill="#e0f2fe" stroke="#2563eb" strokeWidth="2"/>
                <rect x="10.5" y="13" width="3" height="3" rx="1.5" fill="#2563eb"/>
                <rect x="18.5" y="13" width="3" height="3" rx="1.5" fill="#2563eb"/>
                <path d="M12 23c1.5-2 6.5-2 8 0" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="13.5" y="4" width="2" height="4" rx="1" fill="#2563eb"/>
                <rect x="17" y="4" width="2" height="4" rx="1" fill="#2563eb"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: '1.5em', color: '#2563eb', textAlign: 'center' }}>Error</span>
            </div>
            <div style={{ fontSize: '1.1em', color: '#42526E', textAlign: 'center', marginBottom: 8 }}>{popup.message}</div>
            <button
              onClick={() => setPopup(p => ({ ...p, open: false }))}
              style={{
                background: '#1C2E4A',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: 12,
                padding: '0.7em 2.5em',
                fontWeight: 700,
                fontSize: '1.1em',
                fontFamily: 'Inconsolata, monospace',
                cursor: 'pointer',
                marginTop: 12,
                transition: 'background 0.2s, color 0.2s',
              }}
            >OK</button>
            <style>{`
              @keyframes profile-modal-pop {
                0% { opacity: 0; transform: translateY(-40px) scale(0.95); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
      {popup.open && popup.type !== 'error' && (
        <div className="profile-popup-center-bg" style={{ zIndex: 3007 }}>
          <div className="profile-popup-center">
            <MessagePopup
              open={popup.open}
              title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"}
              description={popup.message}
              onClose={() => setPopup(p => ({ ...p, open: false }))}
              style={{ zIndex: 3008 }}
            />
          </div>
        </div>
      )}
      <div className="profile-edit-popup-bg" style={{ position: 'fixed', zIndex: 3002, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form className="profile-edit-popup" onSubmit={handleSubmit} style={{
          background: '#2B4066',
          borderRadius: '1.0em',
          boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
          width: '95%',
          maxWidth: 440,
          padding: '2.5em 2.5em 2em 2.5em',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          color: '#fff',
          fontFamily: 'Roboto Mono, monospace',
          alignItems: 'stretch',
          gap: '0.7em',
          position: 'relative',
        }}>
          <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace' }}>Submit Feedback</div>
          {/* Success/Error message can be added here if needed */}
          <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }} htmlFor="main-concern">Main Concern</label>
          <input
            className="profile-edit-input"
            id="main-concern"
            list="main-concern-options"
            value={mainConcern}
            onChange={e => setMainConcern(e.target.value)}
            placeholder="Select or type main concern"
            autoComplete="off"
            disabled={loading}
            style={{
              background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <datalist id="main-concern-options">
            {MAIN_CONCERN_OPTIONS.map(opt => (
              <option value={opt} key={opt} />
            ))}
          </datalist>
          <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }} htmlFor="details">Details</label>
          <textarea
            className="profile-edit-input"
            id="details"
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Describe your concern or suggestion"
            disabled={loading}
            style={{ minHeight: 100, background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }} htmlFor="email">Email</label>
          <input
            className="profile-edit-input"
            id="email"
            type="email"
            value={user_email}
            placeholder="Your email"
            disabled
            style={{ background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
            <button
              className="profile-edit-btn"
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
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
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              className="profile-edit-btn cancel"
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
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
            <button
              type="button"
              className="profile-edit-btn cancel"
              title="Close"
              onClick={handleCloseModal}
              style={{ background: 'none', color: '#fff', border: 'none', fontSize: '2em', fontWeight: 700, marginLeft: 8, marginTop: -8, lineHeight: 1, padding: 0, minWidth: 0, position: 'absolute', top: 20, right: 20 }}
            >
              &times;
            </button>
          </div>
        </form>
      </div>
    </>
  );
}