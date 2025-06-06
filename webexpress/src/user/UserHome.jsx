import React from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';

export default function UserHome() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return (
    <div style={{ minHeight: '100vh', height: '100%', overflowY: 'auto', background: '#fff' }}>
      <UserBottomNavBar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5vw 2vw 0 2vw' }}>
        <div style={{ marginTop: '2.5vw', marginBottom: '1.5vw' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '2.7em', color: '#22365a', marginBottom: 8 }}>Good Morning, {userData?.f_name || 'User'}!</div>
          <div style={{ fontFamily: 'Roboto Mono, monospace', color: '#7b8794', fontSize: '1.25em', marginBottom: 24 }}>Learn Sign Language Today</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <img
            src={girlbg}
            alt="Sign Language Illustration"
            style={{
              maxWidth: 1200,
              width: '100%',
              height: 'auto',
              borderRadius: 18,
              background: '#fff',
              boxShadow: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}