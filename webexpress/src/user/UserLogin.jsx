import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import { setUserData } from '../data/UserData';
import GuestNavBar from "../components/GuestNavBar";
import backgroundImg from '../assets/bg.png';
import logo from '../assets/logo.png';

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setPopup({ open: true, title: "Please wait", description: "Please wait for a moment as the server is currently starting up..." });
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
        setPopup({ open: true, title: "Login Failed", description: res.data.message || 'Login failed.' });
      }
    } catch (err) {
      setLoading(false);
      setPopup({ open: true, title: "Error", description: err.response?.data?.message || 'Server error' });
    }
  };

  const mainColor = "#334E7B";

  return (
    <>
      <GuestNavBar />
      <div
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <MessagePopup
          open={popup.open}
          title={popup.title}
          description={popup.description}
          onClose={() => setPopup({ ...popup, open: false })}
        />

        <div
          style={{
            width: '100%',
            maxWidth: 420,
            padding: '3rem',
            borderRadius: '24px',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            color: '#000',
            animation: 'fadeInUp 0.7s ease forwards',
            opacity: 0, 
            transform: 'translateY(20px)', 
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem', color: mainColor }}>
            Welcome Back
          </h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Sign in to continue to your account
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label style={{ display: 'block', marginBottom: '1.2rem' }}>
              <span style={{ display: 'block', marginBottom: 6 }}>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '94%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                  outline: 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${mainColor}`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '2rem' }}>
              <span style={{ display: 'block', marginBottom: 6 }}>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '94%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                  outline: 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${mainColor}`}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: mainColor,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease, transform 0.2s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2a416b')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = mainColor)}
              onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading && (
                <div
                  style={{
                    border: '3px solid #fff',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span>Don't have an account? </span>
            <Link to="/register" style={{ color: mainColor, textDecoration: 'underline' }}>
              Register
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
