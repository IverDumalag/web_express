import React, { useEffect, useState } from "react";
import MessagePopup from "../components/MessagePopup";
import { getUserData, setUserData } from "../data/UserData";

export default function AdminProfile({ open, onClose }) {
  const [admin, setAdmin] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (open) {
      const data = getUserData();
      setAdmin(data);
      setShowEdit(false);
      setEditError('');
      setEditSuccess('');
    }
  }, [open]);

  if (!open) return null;

  const handleEditOpen = () => {
    setEditForm({
      f_name: admin?.f_name || "",
      m_name: admin?.m_name || "",
      l_name: admin?.l_name || "",
      email: admin?.email || "",
      sex: admin?.sex || "",
      birthdate: admin?.birthdate || "",
      user_id: admin?.user_id || "",
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
        setAdmin(json.user || editForm);
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
    <div className="admin-profile-popup-bg">
      <style>{`
        .admin-profile-popup-bg {
          position: fixed;
          z-index: 3002;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .admin-profile-popup {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 0.25rem 2rem rgba(0,0,0,0.18);
          width: 95%;
          max-width: 400px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          position: relative;
        }
        .admin-profile-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .admin-profile-title {
          font-weight: bold;
          font-size: 1.5rem;
          text-align: center;
          flex-grow: 1;
        }
        .admin-profile-edit-btn, .admin-profile-close-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 1.2rem;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0.5rem;
        }
        .admin-profile-edit-btn:hover, .admin-profile-close-btn:hover {
          color: #e11d48;
        }
        .admin-profile-row {
          display: flex;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .admin-profile-label {
          flex: 0 0 40%;
          font-weight: 500;
          color: #2563eb;
          font-size: 1rem;
          word-break: break-word;
        }
        .admin-profile-value {
          flex: 1;
          color: #333;
          font-size: 1rem;
          word-break: break-all;
        }
        .admin-profile-edit-title {
          font-weight: bold;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .admin-profile-edit-label {
          font-weight: 500;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }
        .admin-profile-edit-input {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .admin-profile-edit-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
        }
        .admin-profile-edit-btn {
          flex: 1;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .admin-profile-edit-btn.cancel {
          background: #bbb;
        }
        .admin-profile-edit-btn:disabled {
          background: #eee;
          color: #aaa;
          cursor: not-allowed;
        }
        .admin-profile-edit-error {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        .admin-profile-edit-success {
          color: #27ae60;
          text-align: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        @media (max-width: 600px) {
          .admin-profile-popup {
            width: 98%;
            border-radius: 1rem;
            padding: 1rem;
          }
          .admin-profile-title {
            font-size: 1.3rem;
          }
          .admin-profile-row {
            flex-direction: column;
            margin-bottom: 0.75rem;
          }
          .admin-profile-label {
            flex: none;
            width: 100%;
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
          }
          .admin-profile-value {
            font-size: 0.95rem;
          }
          .admin-profile-edit-title {
            font-size: 1.2rem;
          }
          .admin-profile-edit-input {
            padding: 0.6rem;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }
          .admin-profile-edit-actions {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 0.75rem;
          }
          .admin-profile-edit-btn {
            padding: 0.6rem 1rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
      <div className="admin-profile-popup">
        <div className="admin-profile-title-row">
          <span className="admin-profile-title">Admin Profile</span>
          {!showEdit && (
            <button className="admin-profile-edit-btn" title="Edit Profile" onClick={handleEditOpen}>
              Edit
            </button>
          )}
          <button className="admin-profile-close-btn" title="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        {!showEdit ? (
          admin ? (
            <>
              <div className="admin-profile-row">
                <div className="admin-profile-label">First Name:</div>
                <div className="admin-profile-value">{admin.f_name || "-"}</div>
              </div>
              <div className="admin-profile-row">
                <div className="admin-profile-label">Middle Name:</div>
                <div className="admin-profile-value">{admin.m_name || "-"}</div>
              </div>
              <div className="admin-profile-row">
                <div className="admin-profile-label">Last Name:</div>
                <div className="admin-profile-value">{admin.l_name || "-"}</div>
              </div>
              <div className="admin-profile-row">
                <div className="admin-profile-label">Email:</div>
                <div className="admin-profile-value">{admin.email || "-"}</div>
              </div>
              <div className="admin-profile-row">
                <div className="admin-profile-label">Sex:</div>
                <div className="admin-profile-value">{admin.sex || "-"}</div>
              </div>
              <div className="admin-profile-row">
                <div className="admin-profile-label">Birthdate:</div>
                <div className="admin-profile-value">{admin.birthdate || "-"}</div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#aaa" }}>Loading...</div>
          )
        ) : (
          <form onSubmit={handleEditSubmit}>
            <div className="admin-profile-edit-title">Edit Profile</div>
            {editError && <div className="admin-profile-edit-error">{editError}</div>}
            <label className="admin-profile-edit-label">First Name</label>
            <input
              className="admin-profile-edit-input"
              name="f_name"
              value={editForm.f_name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <label className="admin-profile-edit-label">Middle Name</label>
            <input
              className="admin-profile-edit-input"
              name="m_name"
              value={editForm.m_name}
              onChange={handleEditChange}
              disabled={editLoading}
            />
            <label className="admin-profile-edit-label">Last Name</label>
            <input
              className="admin-profile-edit-input"
              name="l_name"
              value={editForm.l_name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <label className="admin-profile-edit-label">Sex</label>
            <select
              className="admin-profile-edit-input"
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
            <label className="admin-profile-edit-label">Birthdate</label>
            <input
              className="admin-profile-edit-input"
              name="birthdate"
              type="date"
              value={editForm.birthdate}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            <div className="admin-profile-edit-actions">
              <button
                className="admin-profile-edit-btn"
                type="submit"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="admin-profile-edit-btn cancel"
                type="button"
                onClick={() => setShowEdit(false)}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {showSuccessPopup && (
          <MessagePopup
            open={true}
            title="Success!"
            description="Profile updated!"
            onClose={handleSuccessPopupClose}
            style={{ zIndex: 4002 }}
          />
        )}
      </div>
    </div>
  );
}