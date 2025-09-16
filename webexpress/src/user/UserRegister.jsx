    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import MessagePopup from '../components/MessagePopup';
    import '../CSS/UserRegister.css';

    export default function UserRegister() {
  const [form, setForm] = useState({
    email: '',
    f_name: '',
    m_name: '',
    l_name: '',
    sex: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    updated_at: new Date().toISOString(),
  });

  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Name validation states
  const [nameValidation, setNameValidation] = useState({
    firstName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
    middleName: { hasNumbers: false, hasSpecialChars: false, validLength: true },
    lastName: { hasNumbers: false, hasSpecialChars: false, validLength: true }
  });
  
  const mainColor = '#334E7B';

  // Password strength validation function
  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  // Name validation function
  const validateName = (name, fieldType) => {
    const hasNumbers = /\d/.test(name);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(name);
    const validLength = name.length <= 50;
    
    const validation = { hasNumbers, hasSpecialChars, validLength };
    
    setNameValidation(prev => ({
      ...prev,
      [fieldType]: validation
    }));
    
    return !hasNumbers && !hasSpecialChars && validLength;
  };

  // Helper function to render name validation indicators
  const renderNameValidation = (fieldValidation, fieldValue) => {
    if (!fieldValue) return null;
    
    return (
      <div style={{ marginTop: '0.3rem', fontSize: '0.75rem' }}>
        <div style={{ color: !fieldValidation.hasNumbers ? '#28a745' : '#dc3545' }}>
          {!fieldValidation.hasNumbers ? '✓' : '✗'} No numbers allowed
        </div>
        <div style={{ color: !fieldValidation.hasSpecialChars ? '#28a745' : '#dc3545' }}>
          {!fieldValidation.hasSpecialChars ? '✓' : '✗'} No special characters allowed
        </div>
        <div style={{ color: fieldValidation.validLength ? '#28a745' : '#dc3545' }}>
          {fieldValidation.validLength ? '✓' : '✗'} Maximum 50 characters ({fieldValue.length}/50)
        </div>
      </div>
    );
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate password on change
    if (name === 'password') {
      validatePassword(value);
    }
    
    // Validate name fields on change
    if (name === 'f_name') {
      validateName(value, 'firstName');
    } else if (name === 'm_name') {
      validateName(value, 'middleName');
    } else if (name === 'l_name') {
      validateName(value, 'lastName');
    }
    
    // Validate birthdate
    if (name === 'birthdate') {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age > 100) {
        setPopup({
          open: true,
          title: "Invalid Birthdate",
          description: "Please enter a valid birthdate."
        });
        return;
      }
    }
  };      // Generate random 6-digit OTP
      const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

// Send OTP using your existing Node.js backend
const sendOTP = async () => {
  if (!form.email) {
    setPopup({ open: true, title: "Error", description: "Please enter your email first." });
    return;
  }

  // Check if email already exists
  try {
    setOtpLoading(true);
    const emailCheckResponse = await axios.post(import.meta.env.VITE_USERS, {
      email: form.email
    }, {
      timeout: 30000
    });

    if (emailCheckResponse.data.exists) {
      setPopup({ 
        open: true, 
        title: "Email Already Used", 
        description: "An account with this email already exists. Please use a different email or try logging in instead." 
      });
      setOtpLoading(false);
      return;
    }
  } catch (error) {
    console.error('Error checking email:', error);
    setPopup({ 
      open: true, 
      title: "Connection Error", 
      description: "Unable to verify email availability. Please check your internet connection and try again." 
    });
    setOtpLoading(false);
    return;
  }

  // Validate password strength
  if (!validatePassword(form.password)) {
    setPopup({ 
      open: true, 
      title: "Password Requirements Not Met", 
      description: "Please ensure your password meets all the requirements shown below." 
    });
    setOtpLoading(false);
    return;
  }

  // Validate name fields
  const isFirstNameValid = validateName(form.f_name, 'firstName');
  const isLastNameValid = validateName(form.l_name, 'lastName');
  const isMiddleNameValid = form.m_name ? validateName(form.m_name, 'middleName') : true;
  
  if (!isFirstNameValid || !isLastNameValid || !isMiddleNameValid) {
    setPopup({ 
      open: true, 
      title: "Invalid Name Format", 
      description: "Please ensure all name fields meet the requirements shown below each field." 
    });
    setOtpLoading(false);
    return;
  }

  // Check password confirmation
  if (form.password !== form.confirmPassword) {
    setPopup({ 
      open: true, 
      title: "Password Mismatch", 
      description: "Password and confirm password do not match." 
    });
    setOtpLoading(false);
    return;
  }

  const otp = generateOTP();
  setSentOtp(otp);
  
  try {
    const response = await axios.post(import.meta.env.VITE_USEROTP, {
      to: form.email,
      otp: otp
    }, {
      timeout: 30000 // 30 second timeout
    });

    if (response.data.success) {
      setPopup({ 
        open: true, 
        title: "Verification Code Sent", 
        description: `We've sent a 6-digit verification code to ${form.email}. Please check your email and enter the code below.` 
      });
      setOtpStep(true);
      startResendTimer();
    } else {
      throw new Error(response.data.message || 'Failed to send verification code');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    let errorMessage = "We couldn't send the verification code. Please try again.";
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = "The email service is taking longer than expected. Please check your internet connection and try again.";
    } else if (error.response?.status === 500) {
      errorMessage = "Our email service is temporarily unavailable. Please try again in a few moments.";
    } else if (!navigator.onLine) {
      errorMessage = "You appear to be offline. Please check your internet connection and try again.";
    } else if (error.response?.data?.message?.includes('email')) {
      errorMessage = "Please check that your email address is correct and try again.";
    }
    
    setPopup({ 
      open: true, 
      title: "Email Verification Problem", 
      description: errorMessage
    });
  } finally {
    setOtpLoading(false);
  }
    };

      // Start resend timer
      const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };

      // Verify OTP and proceed with registration
      const verifyOTPAndRegister = async () => {
        if (!otpCode || otpCode.length !== 6) {
          setPopup({ 
            open: true, 
            title: "Invalid Code", 
            description: "Please enter the complete 6-digit verification code." 
          });
          return;
        }

        if (otpCode !== sentOtp) {
          setPopup({ 
            open: true, 
            title: "Incorrect Verification Code", 
            description: "The code you entered doesn't match. Please check your email and try again." 
          });
          return;
        }

        // OTP verified, proceed with registration
        setLoading(true);
        try {
          const res = await axios.post(
            import.meta.env.VITE_USERINSERT,
            form,
            { 
              headers: { 'Content-Type': 'application/json' },
              timeout: 30000 // 30 second timeout
            }
          );
          
          if (res.data.status === 201) {
            setPopup({ 
              open: true, 
              title: "Account Created Successfully!", 
              description: "Welcome to exPress! Your account has been created. You can now sign in with your credentials." 
            });
            // Reset form and OTP states
            setForm({
              email: '',
              f_name: '',
              m_name: '',
              l_name: '',
              sex: '',
              birthdate: '',
              password: '',
              role: 'user',
              updated_at: new Date().toISOString(),
            });
            setOtpStep(false);
            setOtpCode('');
            setSentOtp('');
            setTimeout(() => navigate('/login'), 2000);
          } else {
            let errorMessage = "We couldn't create your account at this time. Please try again.";
            if (res.data.message) {
              if (res.data.message.includes('email')) {
                errorMessage = "An account with this email already exists. Please try logging in instead.";
              } else if (res.data.message.includes('duplicate')) {
                errorMessage = "An account with this information already exists. Please check your details or try logging in.";
              }
            }
            setPopup({ 
              open: true, 
              title: "Registration Problem", 
              description: errorMessage
            });
          }
        } catch (err) {
          let errorMessage = "We're having trouble connecting to our servers. Please check your internet connection and try again.";
          
          if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = "Registration is taking longer than expected. Please check your internet connection and try again.";
          } else if (err.response?.status === 500) {
            errorMessage = "Our servers are temporarily unavailable. Please try again in a few moments.";
          } else if (!navigator.onLine) {
            errorMessage = "You appear to be offline. Please check your internet connection and try again.";
          }
          
          setPopup({ 
            open: true, 
            title: "Connection Problem", 
            description: errorMessage
          });
        } finally {
          setLoading(false);
        }
      };

      const handleSubmit = async e => {
        e.preventDefault();
        
        if (!otpStep) {
          // First step: Send OTP
          await sendOTP();
        } else {
          // Second step: Verify OTP and register
          await verifyOTPAndRegister();
        }
      };

      // Go back to form step
      const goBackToForm = () => {
        setOtpStep(false);
        setOtpCode('');
        setSentOtp('');
      };

      return (
        <div className="center-bg">
          
          <div className="center-card">
            <header>
              <h2>{otpStep ? 'Verify Email' : 'Register'}</h2>
              <p>{otpStep ? 'Enter the verification code sent to your email' : 'Sign up to get started'}</p>
            </header>

            <MessagePopup
              open={popup.open}
              title={popup.title}
              description={popup.description}
              onClose={() => setPopup({ ...popup, open: false })}
            />
            {!otpStep ? (
              <form onSubmit={handleSubmit} autoComplete="off" 
              
              className="center-form">

                <div className="center-form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                
                <div className="center-form-group">
                  <label>Password</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '96%', margin: '0 auto', display: 'block', paddingRight: '2.7rem' }}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          right: '2.4rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#334E7B',
                          fontSize: '1.1rem',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%'
                        }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.61 1.81-3.06 3.06-4.31M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.09" /><path d="M1 1l22 22" /></svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.3rem', color: '#334E7B' }}>Password Requirements:</div>
                        <div style={{ color: passwordValidation.length ? '#28a745' : '#dc3545' }}>
                          {passwordValidation.length ? '✓' : '✗'} At least 8 characters long
                        </div>
                        <div style={{ color: passwordValidation.uppercase ? '#28a745' : '#dc3545' }}>
                          {passwordValidation.uppercase ? '✓' : '✗'} Contains uppercase letter (A-Z)
                        </div>
                        <div style={{ color: passwordValidation.lowercase ? '#28a745' : '#dc3545' }}>
                          {passwordValidation.lowercase ? '✓' : '✗'} Contains lowercase letter (a-z)
                        </div>
                        <div style={{ color: passwordValidation.number ? '#28a745' : '#dc3545' }}>
                          {passwordValidation.number ? '✓' : '✗'} Contains number (0-9)
                        </div>
                        <div style={{ color: passwordValidation.special ? '#28a745' : '#dc3545' }}>
                          {passwordValidation.special ? '✓' : '✗'} Contains special character (!@#$%^&*...)
                        </div>
                      </div>
                    )}
                </div>
                
                <div className="center-form-group">
                  <label>Confirm Password</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ width: '96%', margin: '0 auto', display: 'block', paddingRight: '2.7rem' }}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          right: '2.4rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#334E7B',
                          fontSize: '1.1rem',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%'
                        }}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.61 1.81-3.06 3.06-4.31M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.09" /><path d="M1 1l22 22" /></svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {form.confirmPassword && (
                      <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                        {form.password === form.confirmPassword ? (
                          <span style={{ color: '#28a745' }}>✓ Passwords match</span>
                        ) : (
                          <span style={{ color: '#dc3545' }}>✗ Passwords do not match</span>
                        )}
                      </div>
                    )}
                </div>
                
                <div className="center-form-group">
                  <label>First name</label>
                  <input 
                    type="text" 
                    name="f_name" 
                    value={form.f_name} 
                    onChange={handleChange} 
                    maxLength={50}
                    style={{
                      borderColor: form.f_name && (!nameValidation.firstName.validLength || 
                        nameValidation.firstName.hasNumbers || 
                        nameValidation.firstName.hasSpecialChars) ? '#dc3545' : undefined
                    }}
                    required 
                  />
                  {renderNameValidation(nameValidation.firstName, form.f_name)}
                </div>

                <div className="center-form-row">
                  <div className="center-form-group">
                    <label>Middle Name</label>
                    <input 
                      type="text" 
                      name="m_name" 
                      value={form.m_name} 
                      onChange={handleChange} 
                      maxLength={50}
                      style={{
                        borderColor: form.m_name && (!nameValidation.middleName.validLength || 
                          nameValidation.middleName.hasNumbers || 
                          nameValidation.middleName.hasSpecialChars) ? '#dc3545' : undefined
                      }}
                    />
                    {renderNameValidation(nameValidation.middleName, form.m_name)}
                  </div>

                <div className="center-form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="l_name" 
                      value={form.l_name} 
                      onChange={handleChange} 
                      maxLength={50}
                      style={{
                        borderColor: form.l_name && (!nameValidation.lastName.validLength || 
                          nameValidation.lastName.hasNumbers || 
                          nameValidation.lastName.hasSpecialChars) ? '#dc3545' : undefined
                      }}
                      required 
                    />
                    {renderNameValidation(nameValidation.lastName, form.l_name)}
                  </div>
                </div>

                <div className="center-form-row">
                  <div className="center-form-group">
                    <label>Sex</label>
                    <select name="sex" value={form.sex} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                <div className="center-form-group">
                    <label>Birthdate</label>
                    <input 
                      type="date" 
                      name="birthdate" 
                      value={form.birthdate} 
                      onChange={handleChange} 
                      max={new Date().toISOString().split('T')[0]}
                      min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                </div>

                      <button type="submit" disabled={otpLoading} className="center-btn">
                          {otpLoading ? "Sending OTP..." : "Send Verification Code"}
                        </button>
                      
                      <div className="center-or">or</div>
                          <button type="button" className="center-btn center-btn-alt" onClick={() => navigate('/login')}>
                          Log In
                        </button>
              </form>

            ) : (
              <div className="center-form">
                <div className="center-form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    style={{ 
                      textAlign: 'center', 
                      fontSize: '1.5rem', 
                      letterSpacing: '0.5rem',
                      fontFamily: 'monospace'
                    }}
                    required
                  />
                  <small style={{ color: '#666', fontSize: '0.8rem' }}>
                    For testing: Check browser console for the OTP code
                  </small>
                </div>
                <button
                  type="button"
                  onClick={verifyOTPAndRegister}
                  disabled={loading || otpCode.length !== 6}
                  className="center-btn"
                >
                  {loading ? "Creating Account..." : "Verify & Register"}
                </button>
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  {resendTimer > 0 ? (
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Resend code in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={otpLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: mainColor,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {otpLoading ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={goBackToForm}
                  className="center-btn center-btn-alt"
                >
                  Back to Form
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }