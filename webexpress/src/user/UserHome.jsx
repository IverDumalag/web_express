import React, { useRef, useEffect, useState } from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';
import weloveto1 from '../assets/weloveto1.png';
import helloVideo from '../assets/hello_rfyswh.mp4';
import howareyouVideo from '../assets/howareyou_bwzgiu.mp4';
import thankyouVideo from '../assets/thankyou_huzpb0.mp4';
import goodmorningVideo from '../assets/goodmorning_wgwhib.mp4';
import expressVideo from '../assets/express video  demonstration.mp4';

export default function UserHome() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const pageEndRef = useRef(null);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      if (scrollY + windowHeight >= bodyHeight - 10) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100%',
        overflowY: 'auto',
        background: '#fff',
        position: 'relative',
      }}
    >
      {/* Animated background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #e3eafc 0%, #fff 80%)',
            filter: 'blur(20px)',
            opacity: 0.6,
            animation: 'float1 12s ease-in-out infinite alternate',
            left: '-60px',
            top: '-40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 70%, #c7d2fe 0%, #fff 80%)',
            filter: 'blur(14px)',
            opacity: 0.4,
            animation: 'float2 14s ease-in-out infinite alternate',
            right: '-30px',
            bottom: '-20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 80% 20%, #b6e0fe 0%, #fff 80%)',
            filter: 'blur(10px)',
            opacity: 0.3,
            animation: 'float3 18s ease-in-out infinite alternate',
            left: '60vw',
            top: '10vh',
          }}
        />
        <style>
          {`
            @keyframes float1 {
              0% { transform: translateY(0) scale(1);}
              100% { transform: translateY(40px) scale(1.08);}
            }
            @keyframes float2 {
              0% { transform: translateY(0) scale(1);}
              100% { transform: translateY(-30px) scale(1.06);}
            }
            @keyframes float3 {
              0% { transform: translateY(0) scale(1);}
              100% { transform: translateY(60px) scale(1.12);}
            }
          `}
        </style>
      </div>
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <UserBottomNavBar />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5vw 2vw 0 2vw' }}>
          <div style={{ marginTop: '2.5vw', marginBottom: '1.5vw' }}>
            <div style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 600, fontSize: '2.7em', color: '#22365a', marginBottom: 8 , marginLeft: '18px' }} className="user-home-header">
              {getGreeting()}, <span style={{ color: '#4C75F2', fontFamily: 'Roboto Mono, monospace', marginLeft: '-9px' }}>{userData?.f_name || 'User'}</span>!
            </div>
            <div style={{ fontFamily: 'Roboto Mono, monospace', color: '#7b8794', fontSize: '1.25em', marginBottom: 24, marginLeft: '20px' }} className="user-home-subheader">Use the Sign Language Cards Today</div>
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
                marginLeft: '40px'
              }}
              className="user-home-img"
            />
          </div>
         
          <div style={{ height: 40 }} />    
          <div style={{ position: 'relative', margin: '40px 0 24px 0', textAlign: 'center' }}>    
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '88px', // increased gap
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: 1600, // increased from 1200
                margin: '0 auto 56px auto',
              }} className="sign-card-grid">
                {[0,1,2,3].map(i => (
                  <div key={i} className="sign-card-video-box" style={{
                    background: '#22365a',
                    borderRadius: '10px',
                    minHeight: 480, 
                    minWidth: 560, 
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
                        fontFamily: 'Roboto Mono, monospace',
                        zIndex: 2,
                      }}>
                        {i === 0 ? 'Hello' : i === 1 ? 'How are you' : i === 2 ? 'Thank you' : 'Good\u00a0morning'}
                      </div>
                    </>
                  </div>
                ))}
              </div>
              
              <div style={{ height: 160 }} />
              {/* Section line above video/text section */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '2.5px solid #e3eafc',
                  margin: '0 0 36px 0',
                  width: '100%',
                }}
              />
              <div style={{
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '40px 0',
                position: 'relative',
                left: '50%',
                right: '50%',
                transform: 'translateX(-50%)'
              }}>
                {/* Text section to the left of the video */}
                <div
                  style={{
                    flex: '0 0 340px',
                    maxWidth: 380,
                    marginRight: '24px', // reduced right margin for better balance
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{
                    fontFamily: 'Roboto Mono, monospace',
                    fontWeight: 700,
                    fontSize: '2em',
                    color: '#22365a',
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}>
                    exPress Demo
                  </div>
                  <div style={{
                    fontFamily: 'Roboto Mono, monospace',
                    fontWeight: 400,
                    fontSize: '1.15em',
                    color: '#334E7B',
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}>
                    See how exPress helps you learn and practice sign language interactively. Watch the demonstration to explore our features and discover how easy it is to start communicating visually!
                  </div>
                </div>
                {/* Video container */}
                <div
                  style={{
                    background: '#fff',
                    border: '4px solid #334E7B',
                    borderRadius: 20,
                    boxShadow: '0 4px 24px rgba(51,78,123,0.10)',
                    padding: 18,
                    display: 'inline-block',
                    maxWidth: '800px',
                    width: '54vw',
                    minWidth: 340,
                  }}
                >
                  <video
                    src={expressVideo}
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      height: 'auto',
                      borderRadius: 12,
                      background: 'none',
                      boxShadow: 'none',
                      display: 'block',
                      objectFit: 'contain',
                    }}
                    controls
                    autoPlay={false}
                    muted
                  />
                </div>
              </div>
              {/* Section line below video/text section */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '2.5px solid #e3eafc',
                  margin: '64px 0 0 0',
                  width: '100%',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '64px 0 64px 0',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <div style={{ position: 'relative', width: '100vw', maxWidth: 1800 }}>
                  <img
                    src={weloveto1}
                    alt="We Love To Illustration"
                    style={{
                      maxWidth: 1800,
                      width: '100vw',
                      height: 'auto',
                      borderRadius: 24,
                      boxShadow: 'none',
                      padding: 0,
                      display: 'block',
                      zIndex: 1
                    }}
                  />
                  {/* SVG Stars */}
                  <svg className="star-svg star1" width="18" height="18" viewBox="0 0 38 38" fill="none" style={{ position: 'absolute', top: '12%', left: '8%', zIndex: 2 }}>
                    <path d="M19 4 L23.09 14.26 L34.51 14.27 L25.91 21.74 L29.82 32.02 L19 25.5 L8.18 32.02 L12.09 21.74 L3.49 14.27 L14.91 14.26 Z" fill="#ffe066"/>
                  </svg>
                  <svg className="star-svg star2" width="12" height="12" viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: '22%', left: '88%', zIndex: 2 }}>
                    <path d="M14 3 L16.85 10.7 L25.2 10.7 L18.18 16.1 L20.98 23.8 L14 19.2 L7.02 23.8 L9.82 16.1 L2.8 10.7 L11.15 10.7 Z" fill="#ffd700"/>
                  </svg>
                  <svg className="star-svg star3" width="9" height="9" viewBox="0 0 22 22" fill="none" style={{ position: 'absolute', top: '60%', left: '92%', zIndex: 2 }}>
                    <path d="M11 2 L13.2 8.2 L20.1 8.2 L14.45 12.7 L16.6 18.9 L11 15.1 L5.4 18.9 L7.55 12.7 L1.9 8.2 L8.8 8.2 Z" fill="#fffbe6"/>
                  </svg>
                  <svg className="star-svg star4" width="7" height="7" viewBox="0 0 18 18" fill="none" style={{ position: 'absolute', top: '80%', left: '7%', zIndex: 2 }}>
                    <path d="M9 1.5 L10.8 6.7 L16.2 6.7 L11.7 10.1 L13.5 15.3 L9 12.1 L4.5 15.3 L6.3 10.1 L1.8 6.7 L7.2 6.7 Z" fill="#ffe066"/>
                  </svg>
                  <svg className="star-svg star5" width="11" height="11" viewBox="0 0 26 26" fill="none" style={{ position: 'absolute', top: '70%', left: '50%', zIndex: 2 }}>
                    <path d="M13 2.5 L15.6 9.5 L23.5 9.5 L17.45 14.3 L20.05 21.3 L13 16.7 L5.95 21.3 L8.55 14.3 L2.5 9.5 L10.4 9.5 Z" fill="#ffd700"/>
                  </svg>
                  <style>
                    {`
                      .star-svg {
                        opacity: 0.85;
                        filter: drop-shadow(0 0 8px #fffbe6);
                        animation: star-float 4.5s ease-in-out infinite, star-blink 2.2s infinite;
                      }
                      .star1 { animation-delay: 0s, 0s; }
                      .star2 { animation-delay: 1.2s, 0.7s; }
                      .star3 { animation-delay: 2.1s, 1.1s; }
                      .star4 { animation-delay: 0.7s, 1.7s; }
                      .star5 { animation-delay: 1.8s, 0.3s; }
                      @keyframes star-float {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-18px); }
                        100% { transform: translateY(0); }
                      }
                      @keyframes star-blink {
                        0%, 100% { opacity: 0.85; }
                        45% { opacity: 0.25; }
                        50% { opacity: 1; }
                        55% { opacity: 0.25; }
                      }
                    `}
                  </style>
                </div>
                {showFooter && (
                  <footer
                    style={{
                      width: '100vw',
                      background: '#1C2E4A',
                      textAlign: 'center',
                      position: 'fixed',
                      left: 0,
                      bottom: 0,
                      zIndex: 100,
                      padding: '20px 0 16px 0',
                      color: '#fff',
                      fontFamily: 'Roboto Mono, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.3em',
                      letterSpacing: 2,
                      opacity: 1,
                      pointerEvents: 'auto',
                      transition: 'opacity 0.3s',
                    }}
                  >
                    exPress 2025
                  </footer>
                )}
                <div
                  className="welove-btn-pos"
                  style={{
                    position: 'absolute',
                    right: '7vw',
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
                    onClick={() => window.location.assign('/usersettings#feedbackarrow')}
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
                      transition: 'background 0.2s, font-size 0.2s, padding 0.2s, transform 0.18s',
                      marginLeft: '48px'
                    }}
                  >
                    Let us know
                  </button>
                  <style>
                    {`
                      .welove-btn:hover {
                        background: #3a4e7a !important;
                        color: #fff !important;
                        transform: scale(1.045);
                        box-shadow: 0 8px 24px rgba(51,78,123,0.18), 0 2px 12px rgba(51,78,123,0.10);
                      }
                    `}
                  </style>
                </div>
              </div>
            </div>
          </div>
          {/* End Sign Language Card Section */}
          <div ref={pageEndRef} style={{ height: 120 }} />
        </div>
        <style>{`
          @media screen and (max-width: 767px) {
            body, html {
              width: 100vw;
              overflow-x: hidden;
            }
            .user-home-main {
              padding: 0 !important;
            }
            .user-home-header {
              font-size: 1.4em !important;
              margin-bottom: 4px !important;
            }
            .user-home-subheader {
              font-size: 1em !important;
              margin-bottom: 12px !important;
            }
            .user-home-img {
              max-width: 98vw !important;
              margin-left: 0 !important;
              border-radius: 10px !important;
            }
            .sign-card-video-box {
              min-width: 90vw !important;
              min-height: 220px !important;
              max-width: 98vw !important;
              border-radius: 12px !important;
            }
            .animated-grid-bg {
              min-width: 90vw !important;
              min-height: 220px !important;
              border-radius: 12px !important;
            }
            .add-more-card-animated {
              max-width: 60vw !important;
              width: 100% !important;
              margin-right: 0 !important;
              border-radius: 12px !important;
            }
            .content__container {
              width: 4.2em !important;
              height: 1.1em !important;
            }
            .add-more-section {
              flex-direction: column !important;
              padding: 18px 0 !important;
              min-height: 220px !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .add-more-section-inner {
              flex-direction: column !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              align-items: center !important;
            }
            .add-cards-btn {
              width: 90vw !important;
              font-size: 1.1em !important;
              padding: 12px 0 !important;
              border-radius: 10px !important;
            }
            .welove-btn-pos {
              position: static !important;
              right: unset !important;
              top: unset !important;
              transform: none !important;
              align-items: center !important;
              margin-top: 24px !important;
              width: 100vw !important;
            }
            .welove-btn {
              font-size: 1em !important;
              padding: 12px 28px !important;
              width: 90vw !important;
              border-radius: 10px !important;
            }
            .star-svg {
              width: 12px !important;
              height: 12px !important;
            }
            .star1, .star2, .star3, .star4, .star5 {
              left: 10% !important;
              top: 10% !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}