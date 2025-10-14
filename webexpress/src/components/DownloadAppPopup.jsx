import React from "react";
import { FiDownload } from "react-icons/fi";
import qrCodeImg from "../assets/express_apk_qr.png";

const DownloadAppPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 4003,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onClose}>
      <style>{`
        .download-popup-animate {
          animation: fadeScaleIn 0.32s cubic-bezier(.4,2,.6,1);
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes floatQR {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <div className="download-popup-animate" style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
        border: '2px solid #334E7B',
        width: '95%',
        maxWidth: 650,
        padding: '2.5em 2.5em 2em 2.5em',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        fontFamily: 'Roboto Mono, monospace',
        alignItems: 'center',
        gap: '2.5em',
        position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 22,
            background: 'none',
            border: 'none',
            fontSize: '1.8em',
            color: '#334E7B',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1,
            padding: 0,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Left side - QR Code */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minWidth: 0,
          flex: '0 0 auto'
        }}>
          <img
            src={qrCodeImg}
            alt="QR Code to download exPress app"
            style={{
              width: 180,
              height: 180,
              objectFit: 'contain',
              border: '2px solid #334E7B',
              borderRadius: 12,
              padding: 8,
            }}
          />
        </div>

        {/* Right side - Content */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          justifyContent: 'center',
          minWidth: 0
        }}>
          {/* Title */}
          <div style={{
            width: '100%',
            textAlign: 'left',
            marginBottom: '1.5em',
          }}>
            <h2 style={{ 
              fontSize: '1.4em', 
              fontWeight: 800, 
              marginBottom: '0.3em', 
              color: '#334E7B',
              margin: 0
            }}>
              Only Available in Android
            </h2>
          </div>

          {/* Content */}
          <div style={{ 
            marginBottom: '1.8em',
            textAlign: 'left'
          }}>
            <h3 style={{ 
              fontSize: '1.6em', 
              fontWeight: 700, 
              marginBottom: '0.5em', 
              color: '#334E7B',
              margin: '0 0 0.5em 0'
            }}>
              Download <span style={{ color: '#4C75F2' }}>exPress</span> Mobile App
            </h3>
            <p style={{ 
              fontSize: '1.1em', 
              marginBottom: '0', 
              color: '#42526E',
              lineHeight: 1.5,
              margin: 0
            }}>
              Get the full experience by installing the app.
            </p>
          </div>

          {/* Download button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            width: '100%'
          }}>
            <a
              href="https://drive.google.com/uc?export=download&id=1RvjOzqLLVCQq0EqvUltaqqO-VDKdq_rU"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#334E7B',
                color: '#fff',
                border: '2px solid #334E7B',
                borderRadius: 12,
                padding: '0.8em 1.8em',
                fontWeight: 700,
                fontSize: '1.1em',
                fontFamily: 'Inconsolata, monospace',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5em',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#2c4266';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#334E7B';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FiDownload size={18} />
              <span>APK Download</span>
            </a>
          </div>
        </div>

        {/* Mobile responsive styles */}
        <style>{`
          @media (max-width: 700px) {
            .download-popup-animate {
              flex-direction: column !important;
              gap: 1.8em !important;
              max-width: 95% !important;
              padding: 2em 1.5em 1.8em 1.5em !important;
            }
            .download-popup-animate > div:first-of-type {
              flex: 0 0 auto !important;
            }
            .download-popup-animate > div:last-of-type {
              text-align: center !important;
            }
            .download-popup-animate h2,
            .download-popup-animate h3 {
              text-align: center !important;
            }
            .download-popup-animate > div:last-of-type > div:last-of-type {
              justify-content: center !important;
            }
            .download-popup-animate img {
              width: 150px !important;
              height: 150px !important;
            }
          }
          @media (max-width: 480px) {
            .download-popup-animate {
              padding: 1.5em 1em 1.3em 1em !important;
            }
            .download-popup-animate h2 {
              font-size: 1.2em !important;
            }
            .download-popup-animate h3 {
              font-size: 1.4em !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DownloadAppPopup;