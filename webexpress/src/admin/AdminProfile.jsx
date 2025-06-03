import React, { useEffect, useState } from "react";
import MessagePopup from "../components/MessagePopup";
import { getUserData, setUserData } from "../data/UserData";
import "../CSS/AdminProfile.css";

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
            <div className="admin-profile-loading">Loading...</div>
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