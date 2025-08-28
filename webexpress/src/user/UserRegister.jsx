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
      const mainColor = '#334E7B';

      const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

      // Generate random 6-digit OTP
      const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

    // Send OTP using your existing Node.js backend
    const sendOTP = async () => {
      if (!form.email) {
        setPopup({ open: true, title: "Error", description: "Please enter your email first." });
        return;
      }

      setOtpLoading(true);
      const otp = generateOTP();
      setSentOtp(otp);

      try {
        const response = await axios.post(import.meta.env.VITE_USEROTP, {
          to: form.email,
          otp: otp
        });

        if (response.data.success) {
          setPopup({ 
            open: true, 
            title: "OTP Sent", 
            description: `Verification code sent to ${form.email}. Please check your email.` 
          });
          setOtpStep(true);
          startResendTimer();
        } else {
          throw new Error(response.data.message || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        setPopup({ 
          open: true, 
          title: "Error", 
          description: error.response?.data?.message || "Failed to send OTP. Please try again." 
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
        if (otpCode !== sentOtp) {
          setPopup({ open: true, title: "Error", description: "Invalid OTP. Please try again." });
          return;
        }

        // OTP verified, proceed with registration
        setLoading(true);
        try {
          const res = await axios.post(
            import.meta.env.VITE_USERINSERT,
            form,
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (res.data.status === 201) {
            setPopup({ open: true, title: "Success", description: "Registration successful! User ID: " + res.data.user_id });
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
            setPopup({ open: true, title: "Registration Failed", description: res.data.message || 'Registration failed.' });
          }
        } catch (err) {
          setPopup({ open: true, title: "Error", description: err.response?.data?.message || 'Server error' });
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
                </div>
                
                <div className="center-form-group">
                  <label>First name</label>
                  <input type="text" name="f_name" value={form.f_name} onChange={handleChange} required />
                </div>

                <div className="center-form-row">
                  <div className="center-form-group">
                    <label>Middle Name</label>
                    <input type="text" name="m_name" value={form.m_name} onChange={handleChange} />
                  </div>

                <div className="center-form-group">
                    <label>Last Name</label>
                    <input type="text" name="l_name" value={form.l_name} onChange={handleChange} required />
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
                    <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />
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