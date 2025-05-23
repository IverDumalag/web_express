import React from "react";

const MessagePopup = ({ open, title, description, onClose }) => {
  if (!open) return null;
  return (
    <>
      <style>{`
        .popup-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1000;
          width: 100vw;
          height: 100vh;
        }
        .popup-modal {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          border-radius: 4%;
          box-shadow: 0 4% 24% rgba(0,0,0,0.18);
          padding: 6% 5% 4% 5%;
          min-width: 60vw;
          max-width: 90vw;
          z-index: 1001;
        }
        .popup-title {
          font-size: 1.3em;
          font-weight: bold;
          margin-bottom: 4%;
        }
        .popup-desc {
          margin-bottom: 8%;
          font-size: 1em;
        }
        .popup-ok-btn {
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 2vw;
          padding: 3% 10%;
          font-size: 1em;
          cursor: pointer;
          width: 40%;
          max-width: 120px;
        }
        @media (max-width: 600px) {
          .popup-modal {
            min-width: 80vw;
            padding: 10% 4% 6% 4%;
          }
          .popup-ok-btn {
            width: 60%;
            font-size: 1em;
            padding: 4% 0;
          }
        }
      `}</style>
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