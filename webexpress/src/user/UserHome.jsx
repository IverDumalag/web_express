import React, { useRef, useEffect, useState } from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';
import graphic from '../assets/graphic.png';
import weloveto1 from '../assets/weloveto1.png';
import helloVideo from '../assets/hello_rfyswh.mp4';
import howareyouVideo from '../assets/howareyou_bwzgiu.mp4';
import thankyouVideo from '../assets/thankyou_huzpb0.mp4';
import goodmorningVideo from '../assets/goodmorning_wgwhib.mp4';


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

  // Trigger the block reveal animation for the heading on mount
  useEffect(() => {
    const block = document.getElementById('sign-cards-block');
    if (!block) return;
    let animation;
    let running = true;
    const animateBlock = () => {
      if (!running) return;
      animation = block.animate([
        { transform: 'translateX(0%)' },
        { transform: 'translateX(101%)' }
      ], {
        duration: 1200,
        easing: 'cubic-bezier(.77,0,.18,1)',
        fill: 'forwards'
      });
      animation.onfinish = () => {
        if (!running) return;
        block.style.transform = 'translateX(0%)';
        setTimeout(animateBlock, 800);
      };
    };
    animateBlock();
    return () => {
      running = false;
      if (animation) animation.cancel();
    };
  }, []);

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ minHeight: '100vh', height: '100%', overflowY: 'auto', background: '#fff' }}>
      <UserBottomNavBar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5vw 2vw 0 2vw' }}>
        <div style={{ marginTop: '2.5vw', marginBottom: '1.5vw' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '2.7em', color: '#22365a', marginBottom: 8 }}>{getGreeting()}, {userData?.f_name || 'User'}!</div>
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
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24, fontFamily: 'Inder, sans-serif', fontWeight: 700, fontSize: '2.9em', color: '#22365a', overflow: 'hidden' }}>
            <span style={{ position: 'relative', zIndex: 2 }}>Sign Language Cards</span>
            <span id="sign-cards-block" style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 24px 0 rgba(51,78,123,0.13)',
              borderRadius: 12,
              zIndex: 3,
              pointerEvents: 'none',
              willChange: 'transform',
              transform: 'translateX(0%)',
              transition: 'background 0.3s',
            }}></span>
          </div>
          <div style={{ height: 60 }} />
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
                borderRadius: '20px',
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
          {/* Add vertical gap between grid and flex section */}
          <div style={{ height: 160 }} />
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
                className="add-more-card-animated"
                style={{ maxWidth: 640, width: '40%', height: 'auto', borderRadius: 32, marginRight: 96 }}
              />
              <style>
                {`
                  .add-more-card-animated {
                    animation: floatY 3.2s ease-in-out infinite;
                  }
                  @keyframes floatY {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-24px); }
                    100% { transform: translateY(0); }
                  }
                `}
              </style>
              <div style={{ textAlign: 'left', color: '#FFFFFF', flex: 1, marginLeft: 120 }}>
                <div style={{ fontFamily: 'League Spartan, monospace', fontWeight: 900, fontSize: '5em', marginBottom: 16, color: '#fff',display: 'flex', alignItems: 'center', gap: '0.2em' }}>
                  <span style={{ whiteSpace: 'pre' }}>Add More&nbsp;</span>
                  <span className="content__container">
                    <span className="content__container__text"></span>
                    <ul className="content__container__list">
                      <li className="content__container__list__item">Card?</li>
                      <li className="content__container__list__item">Signs?</li>
                      <li className="content__container__list__item">Words?</li>
                      <li className="content__container__list__item">Phrases?</li>
                    </ul>
                  </span>
                  <style>{`
                    .content__container {
                      display: inline-block;
                      position: relative;
                      width: 4.8em;
                      height: 1.1em;
                      vertical-align: middle;
                      overflow: hidden;
                    }
                    .content__container__text {
                      display: block;
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      color: #ffe066;
                      font-family: inherit;
                      font-size: 1em;
                      font-weight: inherit;
                      letter-spacing: 0.01em;
                    }
                    .content__container__list {
                      list-style: none;
                      padding: 0;
                      margin: 0;
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      animation: swapper-vertical 4.2s steps(4) infinite;
                    }
                    .content__container__list__item {
                      height: 1.1em;
                      min-width: 4.8em;
                      color: #1C2E4A;
                      font-family: inherit;
                      font-size: 1em;
                      font-weight: inherit;
                      letter-spacing: 0.01em;
                      display: flex;
                      align-items: center;
                      justify-content: flex-start;
                      white-space: nowrap;
                      background: none !important;
                    }
                    @keyframes swapper-vertical {
                      0% { transform: translateY(0); }
                      20% { transform: translateY(0); }
                      25% { transform: translateY(-1.1em); }
                      45% { transform: translateY(-1.1em); }
                      50% { transform: translateY(-2.2em); }
                      70% { transform: translateY(-2.2em); }
                      75% { transform: translateY(-3.3em); }
                      95% { transform: translateY(-3.3em); }
                      100% { transform: translateY(0); }
                    }
                  `}</style>
                </div>
                <div style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '1.35em', marginBottom: 32 }}>
                  Try and add cards for more information
                </div>
                <button
                  className="add-cards-btn"
                  onClick={() => window.location.href = '/usercards'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(70px)',
                    border: '1px solid rgba(255, 255, 255, 0.83)',
                    borderRadius: 15,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: 20,
                    width: 320,
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, monospace',
                    fontWeight: 900,
                    fontSize: '1.6em',
                    cursor: 'pointer',
                    marginTop: 8,
                    transition: 'background 0.2s, transform 0.18s',
                    textAlign: 'center',
                    display: 'block',
                    borderStyle: 'solid',
                  }}
                >
                  Add Cards Now
                </button>
                <style>
                  {`
                    .add-cards-btn:hover {
                      background: rgba(255,255,255,0.36) !important;
                      color:rgb(255, 255, 255) !important;
                      transform: scale(1.045);
                      box-shadow: 0 8px 24px rgba(51,78,123,0.18), 0 2px 12px rgba(51,78,123,0.10);
                    }
                  `}
                </style>
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
              {/* SVG Stars - fatter, classic 5-pointed, animated */}
              <svg className="star-svg star1" width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ position: 'absolute', top: '12%', left: '8%', zIndex: 2 }}>
                <path d="M19 4 L23.09 14.26 L34.51 14.27 L25.91 21.74 L29.82 32.02 L19 25.5 L8.18 32.02 L12.09 21.74 L3.49 14.27 L14.91 14.26 Z" fill="#ffe066"/>
              </svg>
              <svg className="star-svg star2" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: '22%', left: '88%', zIndex: 2 }}>
                <path d="M14 3 L16.85 10.7 L25.2 10.7 L18.18 16.1 L20.98 23.8 L14 19.2 L7.02 23.8 L9.82 16.1 L2.8 10.7 L11.15 10.7 Z" fill="#ffd700"/>
              </svg>
              <svg className="star-svg star3" width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ position: 'absolute', top: '60%', left: '92%', zIndex: 2 }}>
                <path d="M11 2 L13.2 8.2 L20.1 8.2 L14.45 12.7 L16.6 18.9 L11 15.1 L5.4 18.9 L7.55 12.7 L1.9 8.2 L8.8 8.2 Z" fill="#fffbe6"/>
              </svg>
              <svg className="star-svg star4" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ position: 'absolute', top: '80%', left: '7%', zIndex: 2 }}>
                <path d="M9 1.5 L10.8 6.7 L16.2 6.7 L11.7 10.1 L13.5 15.3 L9 12.1 L4.5 15.3 L6.3 10.1 L1.8 6.7 L7.2 6.7 Z" fill="#ffe066"/>
              </svg>
              <svg className="star-svg star5" width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ position: 'absolute', top: '70%', left: '50%', zIndex: 2 }}>
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
                right: '7vw', // moved more to the right
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
        {/* End Sign Language Card Section */}
        <div ref={pageEndRef} style={{ height: 120 }} />
      </div>
    </div>
  );
}