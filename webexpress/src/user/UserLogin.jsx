import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import { setUserData } from '../data/UserData';
import logo from '../assets/logo.png';
import bgImage from '../assets/bglogin.png';
import '../CSS/UserLogin.css';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [loading, setLoading] = useState(false);
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
    <div className="login-bg">
      {/* Background block */}
      <div className="login-bg-block" />

      {/* Left Welcome Section (inside blue container) */}
      <div className="login-left">
        <div className="login-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>exPress</div>
        <div className="login-welcome-bottom">
          <h1 className="login-welcome">WELCOME<br /><span className="login-back">BACK!</span></h1>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="login-right">
        <div className="login-container" style={{ marginRight: '2.5vw' }}>
          <header className="login-header">
            <h2>Log In</h2>
            <p>Sign in to continue to your account</p>
          </header>

          <MessagePopup
            open={popup.open}
            title={popup.title}
            description={popup.description}
            onClose={() => setPopup({ ...popup, open: false })}
          />

          <form onSubmit={handleSubmit} autoComplete="off" className="login-form">
            <div className="login-form-group">
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

            <div className="login-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="login-forgot">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn login-btn-main"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <div className="login-or">or</div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="login-btn login-btn-register"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
