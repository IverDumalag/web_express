import React, { useEffect, useState } from 'react';
import UserBottomNavBar from '../components/UserBottomNavBar';
import { getUserData, setUserData } from '../data/UserData';
import { FaEdit } from 'react-icons/fa';
import MessagePopup from '../components/MessagePopup';

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
      <style>{`
        .profile-main-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8fc;
          padding: 20px; /* Add some padding for smaller screens */
          box-sizing: border-box; /* Include padding in width */
        }
        .profile-card {
          background: #fff;
          border-radius: 1.5rem; /* Use rem for border-radius */
          box-shadow: 0 0.125rem 1rem rgba(0,0,0,0.08); /* Use rem for shadow */
          width: 90%; /* Percentage width for responsiveness */
          max-width: 450px; /* Max-width for desktop */
          padding: 1.5rem 1.5rem 1rem 1.5rem; /* Use rem for padding */
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
        }
        .profile-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem; /* Use rem for margin */
        }
        .profile-title {
          font-weight: bold;
          font-size: 1.5rem; /* Use rem for font size */
          text-align: center;
          flex-grow: 1; /* Allow title to take available space */
        }
        .profile-edit-btn {
          background: none;
          border: none;
          color: #6c63ff;
          font-size: 1.2rem; /* Use rem for icon size */
          margin-left: 0.5rem; /* Use rem for margin */
          cursor: pointer;
          transition: color 0.2s;
          padding: 0.5rem; /* Add padding for easier tapping */
        }
        .profile-edit-btn:hover {
          color: #007bff;
        }
        .profile-row {
          display: flex;
          margin-bottom: 1rem; /* Use rem for margin */
          flex-wrap: wrap; /* Allow wrapping on smaller screens */
        }
        .profile-label {
          flex: 0 0 40%; /* Percentage for label width */
          font-weight: 500;
          color: #6c63ff;
          font-size: 1rem; /* Use rem for font size */
          word-break: break-word; /* Prevent long words from overflowing */
        }
        .profile-value {
          flex: 1;
          color: #333;
          font-size: 1rem; /* Use rem for font size */
          word-break: break-all;
        }
        .profile-edit-popup-bg {
          position: fixed;
          z-index: 3002;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); /* Darker overlay */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem; /* Padding for the overlay content */
          box-sizing: border-box;
        }
        .profile-edit-popup {
          background: #fff;
          border-radius: 1.5rem; /* Use rem for border-radius */
          box-shadow: 0 0.25rem 2rem rgba(0,0,0,0.18); /* Use rem for shadow */
          width: 95%; /* Percentage width for responsiveness */
          max-width: 400px; /* Max-width for desktop */
          padding: 1.5rem; /* Use rem for padding */
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .profile-edit-title {
          font-weight: bold;
          font-size: 1.3rem; /* Use rem for font size */
          margin-bottom: 1.5rem; /* Use rem for margin */
          text-align: center;
        }
        .profile-edit-label {
          font-weight: 500;
          margin-bottom: 0.25rem; /* Use rem for margin */
          font-size: 0.95rem; /* Slightly smaller font for labels */
        }
        .profile-edit-input {
          padding: 0.75rem; /* Use rem for padding */
          font-size: 1rem; /* Use rem for font size */
          border: 1px solid #ccc;
          border-radius: 0.5rem; /* Use rem for border-radius */
          margin-bottom: 1rem; /* Use rem for margin */
          width: 100%;
          box-sizing: border-box;
        }
        .profile-edit-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem; /* Use rem for gap */
          margin-top: 1rem; /* Use rem for margin */
        }
        .profile-edit-btn {
          flex: 1;
          background: #6c63ff;
          color: #fff;
          border: none;
          border-radius: 0.5rem; /* Use rem for border-radius */
          padding: 0.75rem 1rem; /* Use rem for padding */
          font-size: 1rem; /* Use rem for font size */
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-edit-btn.cancel {
          background: #bbb;
        }
        .profile-edit-btn:disabled {
          background: #eee;
          color: #aaa;
          cursor: not-allowed;
        }
        .profile-edit-error {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 0.5rem; /* Use rem for margin */
          font-size: 0.9rem;
        }
        .profile-edit-success {
          color: #27ae60;
          text-align: center;
          margin-bottom: 0.5rem; /* Use rem for margin */
          font-size: 0.9rem;
        }
        .profile-popup-center-bg {
          position: fixed;
          z-index: 4000;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); /* Darker overlay */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
        }
        .profile-popup-center {
          z-index: 4001;
          min-width: 220px;
          max-width: 90vw; /* Use vw for max-width */
        }

        /* Media Queries for smaller screens */
        @media (max-width: 600px) {
          .profile-main-container {
            padding: 10px;
          }
          .profile-card {
            width: 98%;
            border-radius: 1rem;
            padding: 1rem;
          }
          .profile-title {
            font-size: 1.3rem;
          }
          .profile-row {
            flex-direction: column; /* Stack label and value on small screens */
            margin-bottom: 0.75rem;
          }
          .profile-label {
            flex: none; /* Remove flex basis */
            width: 100%; /* Full width for label */
            margin-bottom: 0.25rem; /* Small margin below label */
            font-size: 0.9rem;
          }
          .profile-value {
            font-size: 0.95rem;
          }
          .profile-edit-popup {
            width: 98%;
            border-radius: 1rem;
            padding: 1rem;
          }
          .profile-edit-title {
            font-size: 1.2rem;
          }
          .profile-edit-input {
            padding: 0.6rem;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }
          .profile-edit-actions {
            flex-direction: column; /* Stack buttons on small screens */
            gap: 0.75rem;
            margin-top: 0.75rem;
          }
          .profile-edit-btn {
            padding: 0.6rem 1rem;
            font-size: 0.95rem;
          }
        }

        /* Media Queries for very small screens (e.g., old smartphones) */
        @media (max-width: 380px) {
          .profile-card, .profile-edit-popup {
            padding: 0.75rem;
          }
          .profile-title {
            font-size: 1.1rem;
          }
          .profile-edit-title {
            font-size: 1.1rem;
          }
          .profile-label, .profile-value, .profile-edit-label, .profile-edit-input, .profile-edit-btn {
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="profile-main-container">
        <div className="profile-card">
          <div className="profile-title-row">
            <span className="profile-title">My Profile</span>
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
            <label className="profile-edit-label">Sex</label>
            <select
              className="profile-edit-input"
              name="sex"
              value={editForm.sex}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label className="profile-edit-label">Birthdate</label>
            <input
              className="profile-edit-input"
              name="birthdate"
              type="date"
              value={editForm.birthdate}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
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
        <div className="profile-popup-center-bg">
          <div className="profile-popup-center">
            <MessagePopup
              open={true}
              title="Success!"
              description="Profile updated!"
              onClose={handleSuccessPopupClose}
              style={{ zIndex: 4002 }}
            />
          </div>
        </div>
      )}
      <UserBottomNavBar />
    </>
  );
}