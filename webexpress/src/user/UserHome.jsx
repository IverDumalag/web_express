import React, { useRef, useEffect, useState } from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';
import graphic from '../assets/graphic.png';
import weloveto from '../assets/weloveto.png';
import helloVideo from '../assets/hello_rfyswh.mp4';
import howareyouVideo from '../assets/howareyou_bwzgiu.mp4';
import thankyouVideo from '../assets/thankyou_huzpb0.mp4';
import goodmorningVideo from '../assets/goodmorning_wgwhib.mp4';


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
              boxShadow: 'none',
              marginLeft: '40px' // move image a bit to the right
            }}
          />
        </div>
        {/* Add gap between image and cards */}
        <div style={{ height: 40 }} />
        {/* Sign Language Card Section - moved after main illustration */}
        <div style={{ margin: '40px 0 24px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Inder, sans-serif', fontWeight: 700, fontSize: '2.2em', color: '#22365a', marginBottom: 24 }}>
            Sign Language Cards
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '64px',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '0 auto 56px auto',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="sign-card-video-box" style={{
                background: '#22365a',
                borderRadius: '32px',
                minHeight: 400,
                minWidth: 480,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.3em',
                fontWeight: 500,
                boxShadow: '0 4px 24px rgba(51,78,123,0.13)',
                position: 'relative',
                overflow: 'hidden',
                padding: 0,
              }}>
                {(i === 0 || i === 1 || i === 2 || i === 3) && (
                  <>
                    <video
                      src={i === 0 ? helloVideo : i === 1 ? howareyouVideo : i === 2 ? thankyouVideo : goodmorningVideo}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', margin: 0, padding: 0, border: 'none' }}
                      controls
                    />
                    <div className="sign-card-video-overlay" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(30,40,60,0.55)',
                      transition: 'background 0.3s',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '2em',
                      textShadow: '0 2px 8px #22365a, 0 0 16px #0008',
                      pointerEvents: 'none',
                      fontFamily: 'Inder, sans-serif',
                      zIndex: 2,
                    }}>
                      {i === 0 ? 'Hello' : i === 1 ? 'How are you' : i === 2 ? 'Thank you' : 'Good morning'}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <style>
            {`
              .sign-card-video-box:hover .sign-card-video-overlay {
                background: rgba(30,40,60,0.05) !important;
              }
            `}
          </style>
          {/* Responsive grid: keep 2 columns on small screens */}
          <style>
            {`
              @media (max-width: 900px) {
                .sign-card-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  grid-template-rows: repeat(2, 1fr) !important;
                }
              }
              @media (max-width: 700px) {
                .sign-card-grid {
                  grid-template-columns: 1fr !important;
                  grid-template-rows: repeat(4, 1fr) !important;
                }
              }
            `}
          </style>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 64px 0' }}>
            <div style={{
              background: '#5c6e81',
              borderRadius: 0,
              width: '100vw',
              maxWidth: 'none', // allow full stretch
              minHeight: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
              boxSizing: 'border-box',
              boxShadow: '0 8px 40px rgba(51,78,123,0.18)',
              marginLeft: 'calc(-50vw + 50%)', // stretch background to full width
              marginRight: 'calc(-50vw + 50%)',
            }}>
              <div style={{ width: '100%', maxWidth: 1600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={graphic}
                  alt="Add More Card Illustration"
                  style={{ maxWidth: 520, width: '40%', height: 'auto', borderRadius: 32, marginRight: 96 }}
                />
                <div style={{ textAlign: 'left', color: '#fff', flex: 1, marginLeft: 320 }}>
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
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '64px 0 0 0',
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Responsive style for button */}
            <style>
              {`
                @media (max-width: 900px) {
                  .welove-btn-pos {
                    position: static !important;
                    right: unset !important;
                    top: unset !important;
                    transform: none !important;
                    align-items: center !important;
                    margin-top: 24px !important;
                  }
                  .welove-btn {
                    font-size: 1em !important;
                    padding: 12px 28px !important;
                  }
                }
                @media (min-width: 901px) {
                  .welove-btn {
                    font-size: 1.6em !important;
                    padding: 22px 64px !important;
                  }
                }
              `}
            </style>
            <img
              src={weloveto}
              alt="We Love To Illustration"
              style={{
                maxWidth: 1800,
                width: '100vw',
                height: 'auto',
                borderRadius: 24,
                boxShadow: 'none',
                padding: 0,
                display: 'block'
              }}
            />
            <div
              className="welove-btn-pos"
              style={{
                position: 'absolute',
                right: '8vw', // moved more to the right
                top: '69%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                zIndex: 2
              }}
            >
              <button
                className="welove-btn"
                onClick={() => window.location.href = '/usersettings'}
                style={{
                  background: '#22365a',
                  color: '#fff',
                  fontFamily: 'Roboto Mono, monospace',
                  fontWeight: 700,
                  fontSize: '1.6em',
                  border: 'none',
                  borderRadius: 10,
                  padding: '22px 64px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(51,78,123,0.13)',
                  letterSpacing: 1,
                  transition: 'background 0.2s, font-size 0.2s, padding 0.2s',
                  marginLeft: '48px'
                }}
              >
                Let us know
              </button>
            </div>
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