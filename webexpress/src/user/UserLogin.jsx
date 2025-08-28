import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import { setUserData } from '../data/UserData';
import '../CSS/UserLogin.css';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setPopup({
      open: true,
      title: "Please wait",
      description: "The server is starting up, please wait a moment..."
    });
    try {
      const res = await axios.post(
        'https://express-php.onrender.com/api/userLogin.php',
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.status === 200) {
        setUserData(res.data.user);
        setPopup({ open: true, title: "Success", description: "Login successful!" });
        setTimeout(() => {
          setLoading(false);
          navigate(res.data.user.role === 'admin' ? '/adminanalytics' : '/userhome');
        }, 1000);
      } else {
        setLoading(false);
        setPopup({
          open: true,
          title: "Login Failed",
          description: res.data.message || 'Login failed.'
        });
      }
    } catch (err) {
      setLoading(false);
      setPopup({
        open: true,
        title: "Error",
        description: err.response?.data?.message || 'Server error'
      });
    }
  };

  return (
    <div className="center-bg">
      <div className="center-card">
        <header>
          <h2>Welcome to exPress</h2>
          <p>Sign in to continue to your journey</p>
        </header>


        <MessagePopup
          open={popup.open}
          title={popup.title}
          description={popup.description}
          onClose={() => setPopup({ ...popup, open: false })}
        />


        <form onSubmit={handleSubmit} autoComplete="off" className="center-form">
          <div className="center-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="center-form-group">
            <label>Password</label>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ paddingRight: '2.3rem', width: '96%', boxSizing: 'border-box', display: 'block' }}
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
          <button
            type="submit"
            disabled={loading}
            className="center-btn"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <div className="center-or">or</div>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="center-btn center-btn-alt"
          >
            Register
          </button>
        
        </form>
                <div style={{ textAlign: 'center', marginBottom: '1em' }}>
          <span
            style={{ color: '#334E7B', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
            onClick={() => navigate('/')}
          >
            Go back to landing page
          </span>
        </div>

      </div>
    </div>
  );
}