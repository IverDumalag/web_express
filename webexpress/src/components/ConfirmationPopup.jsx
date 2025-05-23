import React from "react";

export default function ConfirmationPopup({ open, title = "Confirm", message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup-modal">
        <h3>{title}</h3>
        <div style={{ margin: "2vw 0" }}>{message}</div>
        <div className="confirmation-popup-actions">
          <button className="confirmation-popup-btn" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : "Yes"}
          </button>
          <button className="confirmation-popup-btn cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        .confirmation-popup-overlay {
          position: fixed;
          z-index: 3000;
          left: 0; top: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .confirmation-popup-modal {
          background: #fff;
          border-radius: 2vw;
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
          width: 90vw;
          max-width: 350px;
          min-width: 60vw;
          padding: 6vw 4vw 4vw 4vw;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .confirmation-popup-actions {
          display: flex;
          justify-content: space-between;
          gap: 4vw;
        }
        .confirmation-popup-btn {
          flex: 1;
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 2vw;
          padding: 3vw 0;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .confirmation-popup-btn.cancel {
          background: #bbb;
        }
        .confirmation-popup-btn:disabled {
          background: #eee;
          color: #aaa;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}