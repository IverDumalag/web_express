import React from "react";
import '../CSS/MessagePopup.css';

const MessagePopup = ({ open, title, description, onClose }) => {
  if (!open) return null;
  return (
    <>
      <div className="popup-backdrop" onClick={onClose}></div>
      <div className="popup-modal">
        <div className="popup-title">{title}</div>
        <div className="popup-desc">{description}</div>
        <button className="popup-ok-btn" onClick={onClose}>OK</button>
      </div>
    </>
  );
};

export default MessagePopup;