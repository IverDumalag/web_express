import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import MessagePopup from "../components/MessagePopup";
import { getUserData, setUserData } from "../data/UserData";
import "../CSS/UserProfile.css";

export default function AdminProfile({ open, onClose }) {
  const [admin, setAdmin] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Name validation states
  const [nameValidation, setNameValidation] = useState({
    firstName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
    middleName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
    lastName: { hasNumbers: false, hasSpecialChars: false, validLength: true }
  });

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
    const formData = {
      f_name: admin?.f_name || "",
      m_name: admin?.m_name || "",
      l_name: admin?.l_name || "",
      email: admin?.email || "",
      sex: admin?.sex || "",
      birthdate: admin?.birthdate || "",
      user_id: admin?.user_id || "",
    };
    
    setEditForm(formData);
    
    // Initialize validation for existing name values
    if (formData.f_name) validateNameField('f_name', formData.f_name);
    if (formData.m_name) validateNameField('m_name', formData.m_name);
    if (formData.l_name) validateNameField('l_name', formData.l_name);
    
    setEditError('');
    setEditSuccess('');
    setShowEdit(true);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });

    // Validate name fields
    if (name === 'f_name' || name === 'm_name' || name === 'l_name') {
      validateNameField(name, value);
    }
  };

  const validateNameField = (fieldName, value) => {
    const hasNumbers = /\d/.test(value);
    const hasSpecialChars = /[^a-zA-Z\s]/.test(value);
    const validLength = value.length <= 50;

    const fieldMap = {
      'f_name': 'firstName',
      'm_name': 'middleName',
      'l_name': 'lastName'
    };

    setNameValidation(prev => ({
      ...prev,
      [fieldMap[fieldName]]: {
        hasNumbers,
        hasSpecialChars,
        validLength
      }
    }));
  };

  const isNameFieldValid = (fieldName) => {
    const fieldMap = {
      'f_name': 'firstName',
      'm_name': 'middleName',
      'l_name': 'lastName'
    };
    
    const validation = nameValidation[fieldMap[fieldName]];
    return !validation.hasNumbers && !validation.hasSpecialChars && validation.validLength;
  };

  const areAllNameFieldsValid = () => {
    return isNameFieldValid('f_name') && 
           isNameFieldValid('m_name') && 
           isNameFieldValid('l_name');
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
    setEditSuccess('');
    setEditError('');
  };

  return (
    <>
      {/* Main Profile Modal */}
      <div className="profile-edit-popup-bg">
        <div className="profile-card">
          <div className="profile-title-row">
            <h2 className="profile-title modern" style={{ color: '#334E7B' }}>Admin Profile</h2>
            <button 
              className="profile-close-btn" 
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '2rem', 
                cursor: 'pointer', 
                color: '#334E7B' 
              }}
            >
              ×
            </button>
          </div>
          
          <div className="profile-content">
            {admin ? (
              <>
                {/* Full Name Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#334E7B',
                    marginBottom: '8px',
                    textAlign: 'left'
                  }}>
                    Full Name
                  </div>
                  <div style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(6px)'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#334155',
                      fontFamily: 'Roboto Mono, monospace'
                    }}>
                      {`${admin.f_name || ''} ${admin.m_name || ''} ${admin.l_name || ''}`.trim() || 'Full Name'}
                    </span>
                    <FaCheckCircle style={{ color: '#334E7B', fontSize: '18px' }} />
                  </div>
                </div>

                {/* Profile Information Grid */}
                <div className="profile-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {/* Account Created */}
                  <div className="profile-form-row">
                    <label className="profile-form-label">Account Created</label>
                    <div className="profile-form-input" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                      {admin.created_at ?
                        (() => {
                          const d = new Date(admin.created_at);
                          if (isNaN(d)) return admin.created_at;
                          return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        })()
                        : "Unknown registration date"}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="profile-form-row">
                    <label className="profile-form-label">Email</label>
                    <div className="profile-form-input" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                      {admin.email || "-"}
                    </div>
                  </div>

                  {/* Birthdate */}
                  <div className="profile-form-row">
                    <label className="profile-form-label">Birthdate</label>
                    <div className="profile-form-input" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                      {admin.birthdate ?
                        (() => {
                          const d = new Date(admin.birthdate);
                          if (isNaN(d)) return admin.birthdate;
                          return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        })()
                        : admin.birthdate || "-"}
                    </div>
                  </div>

                  {/* Sex */}
                  <div className="profile-form-row">
                    <label className="profile-form-label">Sex</label>
                    <div className="profile-form-input" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                      {admin.sex || "-"}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="profile-form-actions-wide" style={{ gridColumn: 'span 1', marginTop: '1rem' }}>
                    <button
                      style={{
                        width: '100%',
                        minHeight: '56px',
                        background: 'linear-gradient(135deg, #334E7B 0%, #4A6BA5 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 5px 10px rgba(51, 78, 123, 0.3)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleEditOpen}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <FaEdit style={{ fontSize: '16px' }} />
                      Edit Profile
                      <span style={{ fontSize: '20px' }}>›</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#aaa" }}>Loading...</div>
            )}
          </div>
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
            {editForm.f_name && (
              <>
                {nameValidation.firstName.hasNumbers && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    First name cannot contain numbers
                  </div>
                )}
                {nameValidation.firstName.hasSpecialChars && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    First name cannot contain special characters
                  </div>
                )}
                {!nameValidation.firstName.validLength && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    First name cannot exceed 50 characters
                  </div>
                )}
              </>
            )}

            <label className="profile-edit-label">Middle Name</label>
            <input
              className="profile-edit-input"
              name="m_name"
              value={editForm.m_name}
              onChange={handleEditChange}
              disabled={editLoading}
            />
            {editForm.m_name && (
              <>
                {nameValidation.middleName.hasNumbers && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Middle name cannot contain numbers
                  </div>
                )}
                {nameValidation.middleName.hasSpecialChars && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Middle name cannot contain special characters
                  </div>
                )}
                {!nameValidation.middleName.validLength && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Middle name cannot exceed 50 characters
                  </div>
                )}
              </>
            )}

            <label className="profile-edit-label">Last Name</label>
            <input
              className="profile-edit-input"
              name="l_name"
              value={editForm.l_name}
              onChange={handleEditChange}
              required
              disabled={editLoading}
            />
            {editForm.l_name && (
              <>
                {nameValidation.lastName.hasNumbers && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Last name cannot contain numbers
                  </div>
                )}
                {nameValidation.lastName.hasSpecialChars && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Last name cannot contain special characters
                  </div>
                )}
                {!nameValidation.lastName.validLength && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    Last name cannot exceed 50 characters
                  </div>
                )}
              </>
            )}

            <label className="profile-edit-label">Email</label>
            <div className="profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.email || "-"}
            </div>

            <label className="profile-edit-label">Sex</label>
            <div className="profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.sex || "-"}
            </div>

            <label className="profile-edit-label">Birthdate</label>
            <div className="profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.birthdate || "-"}
            </div>

            <div className="profile-edit-actions">
              <button className="profile-edit-btn" type="submit" disabled={editLoading || !areAllNameFieldsValid()}>
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
            {/* Close button top-right */}
            <button
              onClick={handleSuccessPopupClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#334E7B',
              }}
            >
              ×
            </button>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '20px' }}>
              <circle cx="30" cy="30" r="30" fill="#334E7B"/>
              <path d="M18 32L27 41L43 25" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontWeight: 700, fontSize: '1.7em', color: '#334E7B', marginBottom: 4 }}>Profile updated!</div>
          </div>
        </div>
      )}
    </>
  );
}