import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import '../CSS/UserLogin.css';

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
    <div className="login-bg">
      <div className="login-bg-block" />
      <div className="login-left">
        <div className="login-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>exPress</div>
        <div className="login-welcome-bottom">
          <h1 className="login-welcome">CREATE<br /><span className="login-back">ACCOUNT</span></h1>
        </div>
      </div>
      <div className="login-right">
        <div className="login-container" style={{ marginRight: '2.5vw' }}>
          <header className="login-header">
            <h2>{otpStep ? 'Verify Email' : 'Register'}</h2>
            <p>{otpStep ? 'Enter the verification code sent to your email' : 'Create your account below'}</p>
          </header>
          
          <MessagePopup
            open={popup.open}
            title={popup.title}
            description={popup.description}
            onClose={() => setPopup({ ...popup, open: false })}
          />

          {!otpStep ? (
            // Registration Form
            <form onSubmit={handleSubmit} autoComplete="off" className="login-form">
              <div className="login-form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="login-form-group">
                <label>First Name</label>
                <input type="text" name="f_name" value={form.f_name} onChange={handleChange} required />
              </div>
              <div className="login-form-row">
                <div className="login-form-group half">
                  <label>Middle Name</label>
                  <input type="text" name="m_name" value={form.m_name} onChange={handleChange} />
                </div>
                <div className="login-form-group half">
                  <label>Last Name</label>
                  <input type="text" name="l_name" value={form.l_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="login-form-row">
                <div className="login-form-group half">
                  <label>Sex</label>
                  <select name="sex" value={form.sex} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="login-form-group half">
                  <label>Birthdate</label>
                  <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />
                </div>
              </div>
              <div className="login-form-group">
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <button type="submit" disabled={otpLoading} className="login-btn login-btn-main">
                {otpLoading ? "Sending OTP..." : "Send Verification Code"}
              </button>
              <div className="login-or">or</div>
              <button type="button" className="login-btn login-btn-register" onClick={() => navigate('/login')}>
                Log In
              </button>
            </form>
          ) : (
            // OTP Verification Form
            <div className="login-form">
              <div className="login-form-group">
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
                className="login-btn login-btn-main"
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
                className="login-btn login-btn-register"
              >
                Back to Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}