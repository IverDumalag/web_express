import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import GuestNavBar from "../components/GuestNavBar";
import backgroundImg from '../assets/bg.png'; 

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

  const mainColor = '#334E7B';

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_USERINSERT,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.status === 201) {
        setPopup({ open: true, title: "Success", description: "Registration successful! User ID: " + res.data.user_id });
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
      } else {
        setPopup({ open: true, title: "Registration Failed", description: res.data.message || 'Registration failed.' });
      }
    } catch (err) {
      setPopup({ open: true, title: "Error", description: err.response?.data?.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GuestNavBar />
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 600,
          minWidth: 320,
          padding: '3rem 2.5rem',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          fontFamily: 'Segoe UI, sans-serif',
          animation: 'fadeIn 0.5s ease-in-out',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          <MessagePopup
            open={popup.open}
            title={popup.title}
            description={popup.description}
            onClose={() => setPopup({ ...popup, open: false })}
          />

          <nav style={{ marginBottom: 20 }}>
            <Link to="/login" style={{ color: mainColor, textDecoration: 'underline', marginRight: 8 }}>Login</Link>
            <span style={{ margin: '0 8px', color: '#888' }}>/</span>
            <Link to="/register" style={{ color: '#888', textDecoration: 'none', pointerEvents: 'none' }}>Register</Link>
          </nav>

          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: mainColor }}>User Registration</h2>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label>Email:
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </label><br /><br />
            <label>First Name:
              <input type="text" name="f_name" value={form.f_name} onChange={handleChange} required style={inputStyle} />
            </label><br /><br />
            <label>Middle Name:
              <input type="text" name="m_name" value={form.m_name} onChange={handleChange} style={inputStyle} />
            </label><br /><br />
            <label>Last Name:
              <input type="text" name="l_name" value={form.l_name} onChange={handleChange} required style={inputStyle} />
            </label><br /><br />
            <label>Sex:
              <select name="sex" value={form.sex} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label><br /><br />
            <label>Birthdate:
              <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required style={inputStyle} />
            </label><br /><br />
            <label>Password:
              <input type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} />
            </label><br /><br />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#2a416b' : mainColor,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
              }}
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  marginTop: '4px',
  marginBottom: '8px',
  backgroundColor: '#f9f9f9',
};
