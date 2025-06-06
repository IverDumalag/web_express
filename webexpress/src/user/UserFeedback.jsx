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
          <div className="profile-popup-center">
            <MessagePopup
              open={true}
              title="Success!"
              description="Feedback submitted. Thank you!"
              onClose={() => {
                setShowSuccess(false);
                handleCloseModal();
              }}
              style={{ zIndex: 3006 }}
            />
          </div>
        </div>
      )}
      {popup.open && (
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
          borderRadius: '2.2em',
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