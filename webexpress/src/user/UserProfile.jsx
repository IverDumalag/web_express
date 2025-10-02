  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { FaEdit, FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
  import { getUserData, setUserData } from '../data/UserData';
  import '../CSS/UserProfile.css';
  import ConfirmationPopup from '../components/ConfirmationPopup';

  export default function UserProfile({ showModal, onCloseModal }) {
    const navigate = useNavigate();
    const isModalMode = showModal !== undefined;
    const [user, setUser] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    // Name validation states
    const [nameValidation, setNameValidation] = useState({
      firstName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
      middleName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
      lastName: { hasNumbers: false, hasSpecialChars: false, validLength: true }
    });

    useEffect(() => {
      const data = getUserData();
      setUser(data);
    }, []);

    // Reset form when modal closes
    useEffect(() => {
      if (!showModal) {
        setShowEdit(false);
        setEditError('');
        setEditSuccess('');
        setShowSuccessPopup(false);
      }
    }, [showModal]);

    const handleEditOpen = () => {
      const formData = {
        f_name: user?.f_name || "",
        m_name: user?.m_name || "",
        l_name: user?.l_name || "",
        email: user?.email || "",
        sex: user?.sex || "",
        birthdate: user?.birthdate || "",
        user_id: user?.user_id || "",
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
      // Allow letters, spaces, hyphens, apostrophes, and periods only
      const hasSpecialChars = /[^a-zA-Z\s'-.]/.test(value);
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

    const handleEditSubmit = e => {
      e.preventDefault();
      // Show confirmation popup instead of saving directly
      setShowConfirmation(true);
    };

    const handleConfirmSave = async () => {
      setShowConfirmation(false);
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

    const handleCancelSave = () => {
      setShowConfirmation(false);
    };

    const handleSuccessPopupClose = () => {
      setShowSuccessPopup(false);
      setShowEdit(false);
      setEditSuccess('');
      setEditError('');
      if (isModalMode && onCloseModal) onCloseModal();
    };

    const handleCloseModal = () => {
      if (!showEdit) {
        if (isModalMode && onCloseModal) {
          onCloseModal();
        } else {
          navigate(-1);
        }
      }
    };

    // If in modal mode and modal is not shown, return null
    if (isModalMode && !showModal) return null;

    // Modal mode wrapper
    const ModalWrapper = ({ children }) => (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.08)',
        zIndex: 3002,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {children}
      </div>
    );

    // Page mode wrapper
    const PageWrapper = ({ children }) => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        width: '100%',
        padding: '20px',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    );

    const Wrapper = isModalMode ? ModalWrapper : PageWrapper;

    return (
      <>
        {!isModalMode && (
          <FaChevronLeft
            className="profile-back-icon"
            size={24}
            style={{ position: 'absolute', marginLeft: 85, marginTop: 40, cursor: 'pointer', zIndex: 10 }}
            onClick={() => navigate(-1)}
          />
        )}

        <Wrapper>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            border: '2px solid #334E7B',
            width: isModalMode ? '95%' : '50%',
            maxWidth: '600px',
            minWidth: isModalMode ? 'auto' : '400px',
            maxHeight: isModalMode ? '90vh' : 'none',
            overflowY: isModalMode ? 'auto' : 'visible',
            padding: '2em',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(51, 78, 123, 0.2)'
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#334E7B',
                zIndex: 2,
                fontWeight: 'bold',
                lineHeight: 1
              }}
              aria-label="Close"
            >
              ×
            </button>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <div className="profile-header-row">
                <div className="profile-header-title-col">
                  <span className="profile-title modern">Profile</span><br/><br/>
                  <span className="profile-desc">First Name, Middle Name, Last Name are the only editable fields.</span> <br/><br/>
                </div>
              </div>
            {user ? (
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
                      {`${user.f_name || ''} ${user.m_name || ''} ${user.l_name || ''}`.trim() || 'Full Name'}
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
                      {user.created_at ?
                        (() => {
                          const d = new Date(user.created_at);
                          if (isNaN(d)) return user.created_at;
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
                        {user.email || "-"}
                      </div>
                    </div>
                    
                    <div style={{ height: '1px', backgroundColor: '#334E7B', margin: '8px 0' }}></div>
                    
                    {/* Birthdate */}
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ fontSize: '14px', color: '#546e7a', fontFamily: 'monospace' }}>
                        Birthdate
                      </div>
                      <div style={{ fontSize: '15px', color: '#334E7B', fontWeight: '500', fontFamily: 'monospace', marginTop: '4px' }}>
                        {user.birthdate ?
                          (() => {
                            const d = new Date(user.birthdate);
                            if (isNaN(d)) return user.birthdate;
                            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                          })()
                          : "-"}
                      </div>
                    </div>
                    
                    <div style={{ height: '1px', backgroundColor: '#334E7B', margin: '8px 0' }}></div>
                    
                    {/* Sex */}
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ fontSize: '14px', color: '#546e7a', fontFamily: 'monospace' }}>
                        Sex
                      </div>
                      <div style={{ fontSize: '15px', color: '#334E7B', fontWeight: '500', fontFamily: 'monospace', marginTop: '4px' }}>
                        {user.sex || "-"}
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
                    <FaEdit style={{ fontSize: '16px' }} />
                    Edit Profile
                    <span style={{ fontSize: '20px' }}>›</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#aaa" }}>Loading...</div>
            )}
            </div>
          </div>
        </Wrapper>

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
                      First name can only contain letters, spaces, hyphens (-), apostrophes ('), and periods (.)
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
                      Middle name can only contain letters, spaces, hyphens (-), apostrophes ('), and periods (.)
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
                      Last name can only contain letters, spaces, hyphens (-), apostrophes ('), and periods (.)
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

        {/* Confirmation Popup */}
        <ConfirmationPopup
          open={showConfirmation}
          title="Save Changes"
          message="Are you sure you want to save these changes to your profile?"
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
          loading={editLoading}
          confirmText="Save"
          loadingText="Saving..."
        />

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
