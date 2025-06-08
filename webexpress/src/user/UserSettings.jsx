import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserFeedback from './UserFeedback';
import ConfirmationPopup from '../components/ConfirmationPopup';
import '../CSS/UserSettings.css';
import expressLogo from '../assets/express_logo.png';
import { getUserData, setUserData } from '../data/UserData';
import UserBottomNavBar from '../components/UserBottomNavBar';

function SideNav({ onFeedback, onLogout }) {
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#4B5A6A' }}>
        Profile
      </div>
      <div style={{ cursor: 'pointer', color: '#4B5A6A', fontWeight: 500 }} onClick={onFeedback}>
        Give us feedback!
      </div>
      <div style={{ cursor: 'pointer', color: '#4B5A6A', fontWeight: 500 }}>
        <a
          href="https://drive.google.com/uc?export=download&id=1D4QseDYlB9_3zezrNINM8eWWB3At1kVN"
          style={{ color: 'inherit', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download our App
        </a>
      </div>
      <div style={{ cursor: 'pointer', color: '#1C2E4A', fontWeight: 600 }} onClick={onLogout}>
        Logout
      </div>
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
      }}>Settings</div>
      <div style={{ flex: 1 }}></div>
      <div style={{ textAlign: 'right', marginTop: '0.5vw' }}>
        <div style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 700, fontSize: '1.4em', color: '#42526E' }}>{user?.f_name} {user?.m_name} {user?.l_name}</div>
        <div style={{ fontFamily: 'Fira Sans, monospace', color: '#2563eb', fontSize: '1.1em', marginBottom: 8 }}>{user?.email}</div>
        <button
          style={{
            background: '#1C2E4A',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '0.4em 1.2em',
            fontFamily: 'Roboto Mono, monospace',
            fontWeight: 600,
            fontSize: '1em',
            cursor: 'pointer',
            marginTop: 2,
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
        <select
          className="profile-edit-input"
          name="sex"
          value={editForm.sex}
          onChange={onChange}
          required
          disabled={editLoading}
          style={{
            background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
          }}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <label style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: 2 }}>Birthdate</label>
        <input
          className="profile-edit-input"
          name="birthdate"
          type="date"
          value={editForm.birthdate}
          onChange={onChange}
          required
          disabled={editLoading}
          style={{
            background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
          }}
        />
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
        <SideNav onFeedback={() => setShowFeedback(true)} onLogout={handleLogout} />
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: '2vw' }}>
          <UserProfileDisplay user={user} onEdit={handleEditOpen} />
          <UserProfileFields user={user} />
        </div>
      </div>
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
      <ConfirmationPopup
        open={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        loading={logoutLoading}
      />
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