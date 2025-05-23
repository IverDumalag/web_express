import React from "react";
import '../CSS/ConfirmationPopup.css';

export default function ConfirmationPopup({ open, title = "Confirm", message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup-modal">
        <h3 className="confirmation-popup-title">{title}</h3>
        <div className="confirmation-popup-message">{message}</div>
        <div className="confirmation-popup-actions">
          <button className="confirmation-popup-btn" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : "Yes"}
          </button>
          <button className="confirmation-popup-btn cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}