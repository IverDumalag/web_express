import React, { useState, useEffect } from 'react';
import MessagePopup from '../components/MessagePopup';
import { getUserData } from '../data/UserData';

const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACKINSERT;

const MAIN_CONCERN_OPTIONS = [
  "Word/Phrases No Match",
  "Bug Found",
  "Suggestion"
];

export default function UserFeedback({ showModal, onCloseModal }) {
  const [mainConcern, setMainConcern] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });
  const [showSuccess, setShowSuccess] = useState(false);

  const userData = getUserData();
  const user_id = userData?.user_id || "";

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      setMainConcern("");
      setDetails("");
      setEmail("");
      setShowSuccess(false);
    }
  }, [showModal]);

  const handleCloseModal = () => {
    if (onCloseModal) onCloseModal();
  };

  const handleSubmit = async () => {
    if (!user_id) {
      setPopup({ open: true, message: "User not logged in. Please log in again.", type: "error" });
      return;
    }
    if (!mainConcern.trim() || !details.trim() || !email.trim()) {
      setPopup({ open: true, message: "Please fill in all fields.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id,
        email,
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
        }, 5000);
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
      <style>{`
        .feedback-modal-overlay {
          position: fixed;
          z-index: 2000;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .feedback-modal {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
          width: 100%;
          max-width: 480px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .feedback-modal h3 {
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.5rem;
        }
        .feedback-modal-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        .feedback-modal-input,
        .feedback-modal-textarea {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .feedback-modal-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .feedback-modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
        }
        .feedback-modal-btn {
          flex: 1;
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
        }
        .feedback-modal-btn.cancel {
          background: #bbb;
        }
        .feedback-modal-btn:disabled {
          background: #eee;
          color: #aaa;
          cursor: not-allowed;
        }
        .feedback-popup-center-bg {
          position: fixed;
          z-index: 3004;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feedback-popup-center {
          z-index: 3005;
          min-width: 220px;
          max-width: 90vw;
        }
        @media (max-width: 480px) {
          .feedback-modal {
            padding: 1.5rem;
          }
          .feedback-popup-center {
            width: 90%;
            max-width: 300px;
          }
        }
      `}</style>
       {showSuccess && (
        <div className="feedback-popup-center-bg" style={{ zIndex: 3005 }}>
          <div className="feedback-popup-center">
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
        <div className="feedback-popup-center-bg" style={{ zIndex: 3007 }}>
          <div className="feedback-popup-center">
            <MessagePopup
              open={popup.open}
              title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"}
              description={popup.message}
              onClose={() => {
                setPopup(p => ({ ...p, open: false }));
                handleCloseModal();
              }}
              style={{ zIndex: 3008 }}
            />
          </div>
        </div>
      )}
      <div className="feedback-modal-overlay">
        <div className="feedback-modal">
          <h3>Submit Feedback</h3>
          <label className="feedback-modal-label" htmlFor="main-concern">Main Concern</label>
          <input
            list="main-concern-options"
            className="feedback-modal-input"
            id="main-concern"
            value={mainConcern}
            onChange={e => setMainConcern(e.target.value)}
            placeholder="Select or type main concern"
            autoComplete="off"
          />
          <datalist id="main-concern-options">
            {MAIN_CONCERN_OPTIONS.map(opt => (
              <option value={opt} key={opt} />
            ))}
          </datalist>
          <label className="feedback-modal-label" htmlFor="details">Details</label>
          <textarea
            className="feedback-modal-textarea"
            id="details"
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Describe your concern or suggestion"
          />
          <label className="feedback-modal-label" htmlFor="email">Email</label>
          <input
            className="feedback-modal-input"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
          />
          <div className="feedback-modal-actions">
            <button
              className="feedback-modal-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              className="feedback-modal-btn cancel"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}