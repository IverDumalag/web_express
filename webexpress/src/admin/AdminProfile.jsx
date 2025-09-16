import React, { useEffect, useState } from "react";
import { FaCheckCircle } from 'react-icons/fa';
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
    setShowEdit(false);
    setEditSuccess('');
    setEditError('');
  };

  return (
    <div className="admin-profile-popup-bg">
      <div className="admin-profile-popup">
        <div className="admin-profile-title-row">
          <span className="admin-profile-title">Edit Profile</span>
          <button className="admin-profile-close-btn" title="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        {!showEdit ? (
          admin ? (
            <>
              {/* Full Name Section */}
              <div style={{ marginBottom: '16px' }}>
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
                  backgroundColor: 'white',
                  border: '2px solid #334E7B',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#334E7B',
                    fontFamily: 'monospace'
                  }}>
                    {`${admin.f_name || ''} ${admin.m_name || ''} ${admin.l_name || ''}`.trim() || 'Full Name'}
                  </span>
                  <FaCheckCircle style={{ color: '#334E7B', fontSize: '22px' }} />
                </div>
              </div>

              {/* Account Created Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#334E7B',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Account Created
                </div>
                <div style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'white',
                  border: '1.2px solid rgba(51, 78, 123, 0.4)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    fontSize: '15px',
                    color: '#607d8b',
                    fontFamily: 'monospace'
                  }}>
                    {admin.created_at ?
                      (() => {
                        const d = new Date(admin.created_at);
                        if (isNaN(d)) return admin.created_at;
                        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      })()
                      : "Unknown registration date"}
                  </span>
                </div>
              </div>

              {/* Profile Details Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#334E7B',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  Profile Details
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 0 16px 0'
                }}>
                  {/* Email */}
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ fontSize: '14px', color: '#546e7a', fontFamily: 'monospace' }}>
                      Email
                    </div>
                    <div style={{ fontSize: '15px', color: '#334E7B', fontWeight: '500', fontFamily: 'monospace', marginTop: '4px' }}>
                      {admin.email || "-"}
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: '#334E7B', margin: '8px 0' }}></div>
                  
                  {/* Birthdate */}
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ fontSize: '14px', color: '#546e7a', fontFamily: 'monospace' }}>
                      Birthdate
                    </div>
                    <div style={{ fontSize: '15px', color: '#334E7B', fontWeight: '500', fontFamily: 'monospace', marginTop: '4px' }}>
                      {admin.birthdate ?
                        (() => {
                          const d = new Date(admin.birthdate);
                          if (isNaN(d)) return admin.birthdate;
                          return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        })()
                        : admin.birthdate || "-"}
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: '#334E7B', margin: '8px 0' }}></div>
                  
                  {/* Sex */}
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ fontSize: '14px', color: '#546e7a', fontFamily: 'monospace' }}>
                      Sex
                    </div>
                    <div style={{ fontSize: '15px', color: '#334E7B', fontWeight: '500', fontFamily: 'monospace', marginTop: '4px' }}>
                      {admin.sex || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div style={{ marginTop: '24px' }}>
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
                  <span style={{ fontSize: '16px' }}>✏️</span>
                  Edit Profile
                  <span style={{ fontSize: '20px' }}>›</span>
                </button>
              </div>
            </>
          ) : (
            <div className="admin-profile-loading">Loading...</div>
          )
        ) : (
          <form onSubmit={handleEditSubmit}>
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
            <label className="admin-profile-edit-label">Middle Name</label>
            <input
              className="admin-profile-edit-input"
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
            <label className="admin-profile-edit-label">Last Name</label>
            <input
              className="admin-profile-edit-input"
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
            <label className="admin-profile-edit-label">Sex</label>
            <div className="admin-profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.sex || "-"}
            </div>
            <label className="admin-profile-edit-label">Birthdate</label>
            <div className="admin-profile-edit-input" style={{ backgroundColor: '#f5f5f5', color: '#666', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              {editForm.birthdate || "-"}
            </div>
            <div className="admin-profile-edit-actions">
              <button
                className="admin-profile-edit-btn"
                type="submit"
                disabled={editLoading || !areAllNameFieldsValid()}
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