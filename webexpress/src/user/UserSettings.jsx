import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserFeedback from './UserFeedback';
import '../CSS/UserSettings.css';
import expressLogo from '../assets/express_logo.png';
import { getUserData, setUserData } from '../data/UserData';
import UserBottomNavBar from '../components/UserBottomNavBar';

function SideNav({ onFeedback, onLogout, onProfileClick, feedbackArrow }) {
  const feedbackRef = useRef(null);
  useEffect(() => {
    if (feedbackArrow && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [feedbackArrow]);
  return (
    <div
      style={{
        minWidth: 220,
        maxWidth: 260,
        flex: '0 0 220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5em',
        fontFamily: 'Roboto Mono, monospace',
        fontSize: '1.25em',
        color: '#2d3a5a',
        marginTop: '10vw',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'relative',
      }}
    >
      <div className="sidenav-action-item" style={{ display: 'flex', alignItems: 'center', fontWeight: 500, borderRadius: 10,  transition: 'none' }} onClick={onProfileClick}>
        Profile
      </div>
      <div
        ref={feedbackRef}
        className="sidenav-action-item feedback-arrow-target"
        style={{ cursor: 'pointer', fontWeight: 500, transition: 'none', position: 'relative' }}
        onClick={onFeedback}
      >
        Give us feedback!
        {feedbackArrow && (
          <span className="arrow-anim-point" style={{
            position: 'absolute',
            left: '-48px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ display: 'block' }}>
              <g>
                <path d="M4 19h28" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
                <path d="M22 11l10 8-10 8" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </span>
        )}
      </div>
      <div className="sidenav-action-item" style={{ cursor: 'pointer', fontWeight: 500,  transition: 'none' }}>
        <a
          href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
          style={{ color: 'inherit', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download our App
        </a>
      </div>
      <div className="sidenav-action-item" style={{ cursor: 'pointer', fontWeight: 600,  transition: 'none' }} onClick={onLogout}>
        Logout
      </div>
      <style>{`
        .sidenav-action-item {
          transition: transform 0.22s cubic-bezier(.4,2,.6,1);
          position: relative;
        }
        .sidenav-action-item:hover {
      
          transform: scale(1.07) translateX(4px);
        
          cursor: pointer;
        }
        .sidenav-action-item:active {
          transform: scale(0.98) translateX(1px);
          
        }
        .sidenav-action-item a {
          color: inherit;
          text-decoration: none;
        }
        .sidenav-action-item:hover::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 18%;
          height: 64%;
          width: 3px;
          background: linear-gradient(180deg, #2563eb 60%, #334E7B 100%);
          border-radius: 2px;
          opacity: 1;
          transition: opacity 0.18s, left 0.18s;
        }
        .sidenav-action-item::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 18%;
          height: 64%;
          width: 3px;
          background: linear-gradient(180deg, #2563eb 60%, #334E7B 100%);
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.18s, left 0.18s;
        }
        .arrow-anim-point svg {
          animation: arrow-bounce 1.1s cubic-bezier(.4,2,.6,1) infinite;
        }
        @keyframes arrow-bounce {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px) scale(1.08); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function UserProfileDisplay({ user, onEdit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '2vw', gap: '2vw', position: 'relative', minHeight: '3.5em' }}>
      <div style={{
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 800,
        fontSize: '3em',
        color: '#1C2E4A',
        letterSpacing: '-2px',
        textAlign: 'left',
        position: 'static',
        marginBottom: '0.5em',
        marginLeft: '-5.5em', // moved left
      }}>Settings</div>
      <div style={{ flex: 1 }}></div>
      <div style={{ textAlign: 'right', marginTop: '0.5vw' }}>
  <div style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 700, fontSize: '1.4em', color: '#42526E' }}>&nbsp;&nbsp;{user?.f_name} {user?.m_name} {user?.l_name}</div>
        <div style={{ height: 3 }} />
        {user?.created_at && (
          <div style={{ fontFamily: 'Fira Sans, monospace', color: '#7b8794', fontSize: '0.98em', marginBottom: 8 }}>
            Account created: {(() => {
              const d = new Date(user.created_at);
              const month = d.toLocaleString('default', { month: 'long' });
              const day = d.getDate();
              const year = d.getFullYear();
              return `${month} ${day}, ${year}`;
            })()}
          </div>
        )}
        <button
          style={{
            background: '#1C2E4A',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: 12,
            padding: '0.7em 0',
            fontWeight: 600,
            fontSize: '1.0em',
            fontFamily: 'Roboto Mono, monospace',
            cursor: 'pointer',
            width: 150,
            marginTop: 10,
            transition: 'background 0.2s, color 0.2s',
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)'
          }}
          onClick={onEdit}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function UserProfileFields({ user }) {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', maxWidth: 480, fontFamily: 'Fira Sans, monospace', fontSize: '1.15em', color: '#1C2E4A' }}>
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>First Name</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.f_name || ''} readOnly />
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>Middle Name</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.m_name || ''} readOnly />
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>Last Name</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.l_name || ''} readOnly />
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>Email</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.email || ''} readOnly />
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>Birthdate</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.birthdate || ''} readOnly />
      <label style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 500 }}>Sex</label>
      <input style={{ fontFamily: 'Fira Sans, monospace', fontSize: '1.1em', border: '1px solid #22223b', borderRadius: 8, padding: '0.4em 0.8em', color: '#2563eb', marginBottom: 4 }} value={user?.sex || ''} readOnly />
      
    </form>
  );
}

function EditProfilePopup({ editForm, editLoading, editError, onChange, onSubmit, onCancel }) {
  return (
    <div className="profile-edit-popup-bg" style={{ position: 'fixed', zIndex: 3002, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="profile-edit-popup" onSubmit={onSubmit} style={{
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
      }}>
        <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace' }}>Edit Profile</div>
  
        {editError && <div className="profile-edit-error" style={{ color: '#ffb4b4', textAlign: 'center', marginBottom: '0.5em', fontSize: '1em' }}>{editError}</div>}
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>First Name</label>
        <input
          className="profile-edit-input"
          name="f_name"
          value={editForm.f_name}
          onChange={onChange}
          required
          disabled={editLoading}
          style={{
            background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>Middle Name</label>
        <input
          className="profile-edit-input"
          name="m_name"
          value={editForm.m_name}
          onChange={onChange}
          disabled={editLoading}
          style={{
            background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>Last Name</label>
        <input
          className="profile-edit-input"
          name="l_name"
          value={editForm.l_name}
          onChange={onChange}
          required
          disabled={editLoading}
          style={{
            background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>Sex</label>
        <div style={{
          background: '#f5f5f5', color: '#666', fontWeight: 600, fontSize: '1.1em', border: '1px solid #ddd', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', boxSizing: 'border-box',
        }}>
          {editForm.sex || "-"}
        </div>
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>Birthdate</label>
        <div style={{
          background: '#f5f5f5', color: '#666', fontWeight: 600, fontSize: '1.1em', border: '1px solid #ddd', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', boxSizing: 'border-box',
        }}>
          {editForm.birthdate || "-"}
        </div>
        <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
          <button
            className="profile-edit-btn"
            type="submit"
            disabled={editLoading}
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
            {editLoading ? "Saving..." : "Save"}
          </button>
          <button
            className="profile-edit-btn cancel"
            type="button"
            onClick={onCancel}
            disabled={editLoading}
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
        </div>
      </form>
    </div>
  );
}

function SuccessPopup({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(44, 62, 80, 0.18)',
      zIndex: 4000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5em',
        boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
        padding: '2.5em 3em',
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2em',
        border: '2px solid #2563eb',
        fontFamily: 'Roboto Mono, monospace',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
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
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="30" fill="#e0f2fe"/>
          <path d="M18 32L27 41L43 25" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontWeight: 700, fontSize: '1.7em', color: '#2563eb', marginBottom: 4 }}>Profile updated!</div>
      </div>
    </div>
  );
}

function ProfileInfoModal({ open, onClose }) {
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
      alignItems: 'center', // center vertically
      justifyContent: 'center', // center horizontally
    }} onClick={onClose}>
      <div
        style={{
          // Remove marginTop, center modal
          background: '#fff',
          borderRadius: '1.2em',
          boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
          padding: '2em 2.5em',
          minWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px solid #334E7B',
          fontFamily: 'Roboto Mono, monospace',
          position: 'relative',
          animation: 'profile-modal-pop 0.32s cubic-bezier(.4,2,.6,1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: '1.3em', color: '#334E7B', marginBottom: 12, textAlign: 'center' }}>
          you are already in the profile section.
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#334E7B',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '0.5em 1.5em',
            fontWeight: 600,
            fontFamily: 'Inder, monospace',
            fontSize: '1.3em',
            marginTop: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            transition: 'background 0.18s',
          }}
        >ok</button>
        <style>{`
          @keyframes profile-modal-pop {
            0% { opacity: 0; transform: translateY(-40px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

function LogoutConfirmModal({ open, onConfirm, onCancel, loading }) {
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
            color: '#2563eb',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{ fontWeight: 700, fontSize: '1.5em', color: '#334E7B', marginBottom: 4, textAlign: 'center' }}>Confirm Logout ?</div>
        <div style={{ fontSize: '1.1em', color: '#42526E', textAlign: 'center', marginBottom: 8 }}>Are you sure you want to log out?</div>
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
            {loading ? 'Logging out...' : 'Yes, Logout'}
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

export default function UserSettings() {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [user, setUser] = useState(() => getUserData());
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showFeedbackArrow, setShowFeedbackArrow] = useState(() => {
    // Check if navigated from Let us know
    return window.location.hash === '#feedbackarrow';
  });
  useEffect(() => {
    if (showFeedbackArrow) {
      const handle = () => setShowFeedbackArrow(false);
      window.addEventListener('click', handle);
      return () => window.removeEventListener('click', handle);
    }
  }, [showFeedbackArrow]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      setLogoutLoading(false);
      setShowLogoutConfirm(false);
      navigate("/login");
    }, 600);
  };

  const handleEditOpen = () => {
    setEditForm({
      f_name: user?.f_name || "",
      m_name: user?.m_name || "",
      l_name: user?.l_name || "",
      email: user?.email || "",
      sex: user?.sex || "",
      birthdate: user?.birthdate || "",
      user_id: user?.user_id || "",
    });
    setEditError('');
    setShowEdit(true);
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(import.meta.env.VITE_USEREDIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const json = await res.json();
      if (json.status === 200 || json.status === "200") {
        setUserData(json.user || editForm);
        setUser(json.user || editForm);
        setShowSuccessPopup(true);
        setShowEdit(false);
      } else {
        setEditError(json.message || "Failed to update profile.");
      }
    } catch (err) {
      setEditError("Network error.");
    }
    setEditLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <UserBottomNavBar />
      <div
        style={{
          maxWidth: 1100,
          margin: '40px auto',
          background: '#fff',
          borderRadius: '2em',
          border: '2px solid #1C2E4A',
          padding: '3vw 3vw 2vw 3vw',
          minHeight: 500,
          display: 'flex',
          flexDirection: 'row',
          gap: '2vw',
          fontFamily: 'Fira Sans, Roboto Mono, monospace',
          boxSizing: 'border-box',
            flexWrap: 'wrap',
        }}
      >
        <SideNav onFeedback={() => setShowFeedback(true)} onLogout={handleLogout} onProfileClick={() => setShowProfileInfo(true)} feedbackArrow={showFeedbackArrow} />
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: '2vw' }}>
          <UserProfileDisplay user={user} onEdit={handleEditOpen} />
          <UserProfileFields user={user} />
        </div>
      </div>
      <ProfileInfoModal open={showProfileInfo} onClose={() => setShowProfileInfo(false)} />
      <LogoutConfirmModal open={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} loading={logoutLoading} />
      {showEdit && (
        <EditProfilePopup
          editForm={editForm}
          editLoading={editLoading}
          editError={editError}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEdit(false)}
        />
      )}
      {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}
      {showFeedback && (
        <UserFeedback showModal={true} onCloseModal={() => setShowFeedback(false)} />
      )}
      <style>
        {`
          @media (max-width: 900px) {
            .user-settings-main {
              flex-direction: column !important;
              padding: 4vw 2vw 2vw 2vw !important;
              gap: 3vw !important;
            }
            .user-settings-sidenav {
              min-width: 0 !important;
              max-width: 100vw !important;
              width: 100% !important;
              flex: none !important;
              align-items: stretch !important;
              margin-top: 4vw !important;
              font-size: 1.1em !important;
            }
            .user-settings-profile {
              min-width: 0 !important;
              width: 100% !important;
              gap: 1.5vw !important;
            }
            .user-settings-profile-fields {
              max-width: 100vw !important;
              font-size: 1em !important;
            }
            .user-settings-profile-display {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 1vw !important;
            }
            .user-settings-profile-display > div {
              text-align: left !important;
              margin-top: 0 !important;
            }
            .profile-edit-popup {
              width: 98vw !important;
              max-width: 98vw !important;
              padding: 1.5em 0.5em 1em 0.5em !important;
            }
          }
          @media (max-width: 600px) {
            .user-settings-main {
              padding: 2vw 1vw 1vw 1vw !important;
              border-radius: 1em !important;
            }
            .user-settings-sidenav {
              font-size: 1em !important;
              margin-top: 2vw !important;
            }
            .user-settings-profile {
              gap: 1vw !important;
            }
            .user-settings-profile-fields {
              font-size: 0.95em !important;
            }
            .user-settings-profile-display > div {
              font-size: 1.1em !important;
            }
            .profile-edit-popup {
              padding: 1em 0.2em 0.5em 0.2em !important;
              border-radius: 1em !important;
            }
          }
        `}
      </style>
    </div>
  );
}