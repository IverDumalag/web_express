import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';

export default function TempAdminPage() {
  const navigate = useNavigate();

  return (
    <>
      <AdminNavBar />
      <div style={{ padding: '2rem' }}>
        Welcome, Admin! (Temp Admin Page)
        <br />
        <button
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          onClick={() => navigate('/adminhome')}
        >
          Go to Admin Home
        </button>
      </div>
    </>
  );
}