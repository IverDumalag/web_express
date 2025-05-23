import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import { setUserData } from '../data/UserData';
import GuestNavBar from "../components/GuestNavBar";

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Show loading message
    setPopup({ open: true, title: "Please wait", description: "Please wait for a moment as the server is currently starting up..." });
    try {
      const res = await axios.post(
        'https://express-php.onrender.com/api/userLogin.php',
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.status === 200) {
        setUserData(res.data.user); // Save user data globally
        setPopup({ open: true, title: "Success", description: "Login successful!" });
        setTimeout(() => {
          setLoading(false);
          if (res.data.user.role === 'admin') {
            navigate('/tempadmin');
          } else {
            navigate('/userhome');  
          }
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

  return (
    <>
    <GuestNavBar />
    <div style={{ maxWidth: 400, margin: '2rem auto', border: '1px solid #ccc', padding: 20 }}>
      <MessagePopup
        open={popup.open}
        title={popup.title}
        description={popup.description}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 20 }}>
        <Link to="/login" style={{ color: '#888', textDecoration: 'none', pointerEvents: 'none', marginRight: 8 }}>Login</Link>
        <span style={{ margin: '0 8px', color: '#888' }}>/</span>
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>Register</Link>
      </nav>
      <h2>User Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>Email:<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required disabled={loading} />
        </label><br /><br />
        <label>Password:<br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required disabled={loading} />
        </label><br /><br /><br />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
    </>
  );
}