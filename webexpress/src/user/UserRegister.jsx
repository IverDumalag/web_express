import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MessagePopup from '../components/MessagePopup';
import GuestNavBar from "../components/GuestNavBar";

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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
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
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline', marginRight: 8 }}>Login</Link>
        <span style={{ margin: '0 8px', color: '#888' }}>/</span>
        <Link to="/register" style={{ color: '#888', textDecoration: 'none', pointerEvents: 'none' }}>Register</Link>
      </nav>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>Email:<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label><br /><br />
        <label>First Name:<br />
          <input type="text" name="f_name" value={form.f_name} onChange={handleChange} required />
        </label><br /><br />
        <label>Middle Name:<br />
          <input type="text" name="m_name" value={form.m_name} onChange={handleChange} />
        </label><br /><br />
        <label>Last Name:<br />
          <input type="text" name="l_name" value={form.l_name} onChange={handleChange} required />
        </label><br /><br />
        <label>Sex:<br />
          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label><br /><br />
        <label>Birthdate:<br />
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />
        </label><br /><br />
        <label>Password:<br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label><br /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
    </>
  );
}