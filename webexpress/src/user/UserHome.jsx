import React, { useRef, useEffect, useState } from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';
import graphic from '../assets/graphic.png';
import weloveto from '../assets/weloveto.png';


export default function UserHome() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [showFooter, setShowFooter] = useState(false);
  const pageEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!pageEndRef.current) return;
      const rect = pageEndRef.current.getBoundingClientRect();
      // Show footer if the bottom of the page is in view
      setShowFooter(rect.top <= window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        {/* Sign Language Card Section - moved after main illustration */}
        <div style={{ margin: '40px 0 24px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Inder, sans-serif', fontWeight: 700, fontSize: '2.2em', color: '#22365a', marginBottom: 24 }}>
            Sign Language Cards
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '48px',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 1000,
            margin: '0 auto 56px auto',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                background: '#22365a',
                borderRadius: '32px',
                minHeight: 320,
                minWidth: 380,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.3em',
                fontWeight: 500,
                boxShadow: '0 4px 24px rgba(51,78,123,0.13)',
              }}>
                {/* Leave blank for default */}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 64px 0' }}>
            <div style={{
              background: '#5c6e81',
              borderRadius: 25,
              width: '100vw',
              maxWidth: 1600,
              minHeight: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', 
              padding: '40px 0',
              boxSizing: 'border-box',
              boxShadow: '0 8px 40px rgba(51,78,123,0.18)'
            }}>
              <img
                src={graphic}
                alt="Add More Card Illustration"
                style={{ maxWidth: 520, width: '40%', height: 'auto', borderRadius: 32, marginRight: 48 }}
              />
              <div style={{ textAlign: 'left', color: '#fff', flex: 1 }}>
                <div style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 700, fontSize: '3em', marginBottom: 16 }}>
                  Add More Card?
                </div>
                <div style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '1.35em', marginBottom: 32 }}>
                  Try and add cards for more information
                </div>
                <button
                  onClick={() => window.location.href = '/usercards'}
                  style={{
                    background: '#fff',
                    color: '#22365a',
                    fontFamily: 'Roboto Mono, monospace',
                    fontWeight: 700,
                    fontSize: '1.5em',
                    border: 'none',
                    borderRadius: 10,
                    padding: '20px 64px',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    marginTop: 8,
                    transition: 'background 0.2s',
                    width: 420,
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  Add Cards Now
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '64px 0 0 0' }}>
            <img
              src={weloveto}
              alt="We Love To Illustration"
              style={{ maxWidth: 1800, width: '100vw', height: 'auto', borderRadius: 24, boxShadow: 'none', padding: 0 }}
            />
          </div>
        </div>
        {/* End Sign Language Card Section */}
        <div ref={pageEndRef} />
      </div>
      {showFooter && (
        <footer style={{
          width: '100vw',
          background: '#1C2E4A',
          textAlign: 'center',
          position: 'fixed',
          left: 0,
          bottom: 0,
          zIndex: 100,
          padding: '32px 0 16px 0',
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '1.3em',
          letterSpacing: 2
        }}>
          exPress 2025
        </footer>
      )}
    </div>
  );
}