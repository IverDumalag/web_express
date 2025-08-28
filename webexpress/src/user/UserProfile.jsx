import React, { useEffect, useState } from 'react';
import UserBottomNavBar from '../components/UserBottomNavBar';
import { getUserData, setUserData } from '../data/UserData';
import { FaEdit } from 'react-icons/fa';
import MessagePopup from '../components/MessagePopup';
import '../CSS/UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

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
    setEditSuccess('');
    setShowEdit(true);
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
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
        setEditSuccess("Profile updated!");
        setShowSuccessPopup(true); // Show popup
      } else {
        setEditError(json.message || "Failed to update profile.");
      }
    } catch (err) {
      setEditError("Network error.");
    }
    setEditLoading(false);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setShowEdit(false);
    setEditSuccess('');
    setEditError('');
  };

  return (
    <>
      <div className="profile-main-container">
        <div className="profile-card profile-card-modern">
          <div className="profile-header-row">
            <div className="profile-header-title-col">
              <span className="profile-title modern">Account Settings</span><br></br><br/>
              <span className="profile-desc">Edit your name, email, and other details below.</span>
            </div>
            <div className="profile-avatar-col"></div>
            <button className="profile-edit-btn" title="Edit Profile" onClick={handleEditOpen}>
              <FaEdit />
            </button>

          </div>
          {user ? (
            <>
              <div className="profile-row">
                <div className="profile-label">First Name:</div>
                <div className="profile-value">{user.f_name || "-"}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Middle Name:</div>
                <div className="profile-value">{user.m_name || "-"}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Last Name:</div>
                <div className="profile-value">{user.l_name || "-"}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Email:</div>
                <div className="profile-value">{user.email || "-"}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Sex:</div>
                <div className="profile-value">{user.sex || "-"}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Birthdate:</div>
                <div className="profile-value">{user.birthdate || "-"}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  className="profile-edit-btn"
                  type="button"
                  onClick={handleEditOpen}
                  style={{ minWidth: 120 }}
                >
                  <FaEdit style={{ marginRight: 8 }} /> Edit
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#aaa" }}>Loading...</div>
          )}
        </div>
      </div>
      {showEdit && (
        <div className="profile-edit-popup-bg">
          <form className="profile-edit-popup" onSubmit={handleEditSubmit}>
            <div className="profile-edit-title">Edit Profile</div>
            {editError && <div className="profile-edit-error">{editError}</div>}
            <label className="profile-edit-label">First Name</label>
            <input
              className="profile-edit-input"
              name="f_name"
              value={editForm.f_name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <label className="profile-edit-label">Middle Name</label>
            <input
              className="profile-edit-input"
              name="m_name"
              value={editForm.m_name}
              onChange={handleEditChange}
              disabled={editLoading}
            />
            <label className="profile-edit-label">Last Name</label>
            <input
              className="profile-edit-input"
              name="l_name"
              value={editForm.l_name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <label className="profile-edit-label">Email</label>
            <input
              className="profile-edit-input"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <label className="profile-edit-label">Sex</label>
            <div className="profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.sex || "-"}
            </div>
            <label className="profile-edit-label">Birthdate</label>
            <div className="profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.birthdate || "-"}
            </div>
            <div className="profile-edit-actions">
              <button
                className="profile-edit-btn"
                type="submit"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="profile-edit-btn cancel"
                type="button"
                onClick={() => setShowEdit(false)}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {showSuccessPopup && (
        <div className="profile-popup-center-bg" style={{ zIndex: 4002 }}>
          <div className="profile-popup-center" style={{
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
              onClick={handleSuccessPopupClose}
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
      )}
      <UserBottomNavBar />
    </>
  );
}