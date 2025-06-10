import React from "react";
import '../CSS/ConfirmationPopup.css';

export default function ConfirmationPopup({ open, title = "Confirm", message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(44,62,80,0.10)',
      zIndex: 4002,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onCancel}>
      <form
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '2.2em',
          boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
          width: '95%',
          maxWidth: 420,
          padding: '2.5em 2.5em 2em 2.5em',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          color: '#1C2E4A',
          fontFamily: 'Roboto Mono, monospace',
          alignItems: 'center',
          gap: '1.2em',
          border: '2px solid #334E7B',
          position: 'relative',
          animation: 'profile-modal-pop 0.32s cubic-bezier(.4,2,.6,1)'
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 18,
            right: 22,
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            color: '#334E7B',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{ fontWeight: 700, fontSize: '1.5em', color: '#334E7B', marginBottom: 4, textAlign: 'center' }}>{title}</div>
        <div style={{ fontSize: '1.1em', color: '#42526E', textAlign: 'center', marginBottom: 8 }}>{message}</div>
        <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em', width: '100%' }}>
          <button
            type="button"
            onClick={onConfirm}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            type="button"
            onClick={onCancel}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            No, Cancel
          </button>
        </div>
        <style>{`
          @keyframes profile-modal-pop {
            0% { opacity: 0; transform: translateY(-40px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </form>
    </div>
  );
}