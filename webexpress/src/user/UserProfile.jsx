import boyImg from '../assets/boy.png';
  import React, { useEffect, useState } from 'react';
  import { useNavigate } from "react-router-dom";
  import { FaEdit, FaChevronLeft } from 'react-icons/fa';
  import { getUserData, setUserData } from '../data/UserData';
  import '../CSS/UserProfile.css';

  export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const navigate = useNavigate();

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
          setShowSuccessPopup(true);
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
        <FaChevronLeft
          className="profile-back-icon"
          size={24}
          style={{ marginLeft: 85, marginTop: 40 }}
          onClick={() => navigate(-1)}
        />

  {/* Floating Boy Animation removed */}

        <div className="profile-main-container">
    <div className="profile-card profile-card-modern" style={{ border: '2px solid #334E7B', display: 'flex', flexDirection: 'column' }}>
            <div className="profile-header-row">
              <div className="profile-header-title-col">
                <span className="profile-title modern">Profile Details</span><br/><br/>
                <span className="profile-desc">First Name, Middle Name, Last Name are the only editable fields.</span> <br/><br/><br/><br/>
              </div>
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
                  <div className="profile-value">
                    {user.birthdate ?
                      (() => {
                        const d = new Date(user.birthdate);
                        if (isNaN(d)) return user.birthdate;
                        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      })()
                      : "-"}
                  </div>
                </div>
                <div className="profile-row">
                  <div className="profile-label">Account Created:</div>
                  <div className="profile-value">
                    {user.created_at ?
                      (() => {
                        const d = new Date(user.created_at);
                        if (isNaN(d)) return user.created_at;
                        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      })()
                      : "-"}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button
                    className="profile-edit-btn"
                    type="button"
                    onClick={handleEditOpen}
                    style={{ minWidth: 60, maxWidth: 90, padding: '0.5em 1em', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaEdit style={{ marginRight: 6 }} /> Edit
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#aaa" }}>Loading...</div>
            )}
          </div>
        </div>

        {/* Edit Popup */}
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
                required
                disabled // ✅ email is non-editable
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
                <button className="profile-edit-btn" type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button className="profile-edit-btn cancel" type="button" onClick={() => setShowEdit(false)} disabled={editLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="profile-popup-center-bg" style={{ zIndex: 4002 }}>
            <div className="profile-popup-center" style={{ position: 'relative' }}>
              {/* Close button top-left */}
              <button
                onClick={handleSuccessPopupClose}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#2563eb',
                }}
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
      </>
    );
  }
