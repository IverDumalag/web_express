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
  const navigate = useNavigate();

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
            <h2>Register</h2>
            <p>Create your account below</p>
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
            <button type="submit" disabled={loading} className="login-btn login-btn-main">
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="login-or">or</div>
            <button type="button" className="login-btn login-btn-register" onClick={() => navigate('/login')}>
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
