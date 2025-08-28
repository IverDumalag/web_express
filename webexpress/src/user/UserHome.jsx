import React, { useRef, useEffect, useState } from "react";
import girlbg from '../assets/contentbg1.png';
import UserBottomNavBar from '../components/UserBottomNavBar';
import weloveto1 from '../assets/weloveto1.png';
import helloVideo from '../assets/hello_rfyswh.mp4';
import howareyouVideo from '../assets/howareyou_bwzgiu.mp4';
import thankyouVideo from '../assets/thankyou_huzpb0.mp4';
import goodmorningVideo from '../assets/goodmorning_wgwhib.mp4';
import expressVideo from '../assets/express video  demonstration.mp4';
import '../CSS/UserHome.css';

export default function UserHome() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const pageEndRef = useRef(null);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      setShowFooter(scrollY + windowHeight >= bodyHeight - 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ minHeight: '100vh', height: '100%', overflowY: 'auto', background: '#fff', position: 'relative' }}>
      {/* Animated background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #e3eafc 0%, #fff 80%)',
          filter: 'blur(20px)', opacity: 0.6, animation: 'float1 12s ease-in-out infinite alternate',
          left: '-60px', top: '-40px'
        }} />
        <div style={{
          position: 'absolute', width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 70%, #c7d2fe 0%, #fff 80%)',
          filter: 'blur(14px)', opacity: 0.4, animation: 'float2 14s ease-in-out infinite alternate',
          right: '-30px', bottom: '-20px'
        }} />
        <div style={{
          position: 'absolute', width: 90, height: 90, borderRadius: '50%',
          background: 'radial-gradient(circle at 80% 20%, #b6e0fe 0%, #fff 80%)',
          filter: 'blur(10px)', opacity: 0.3, animation: 'float3 18s ease-in-out infinite alternate',
          left: '60vw', top: '10vh'
        }} />
        <style>{`
          @keyframes float1 { 0% { transform: translateY(0) scale(1);} 100% { transform: translateY(40px) scale(1.08);} }
          @keyframes float2 { 0% { transform: translateY(0) scale(1);} 100% { transform: translateY(-30px) scale(1.06);} }
          @keyframes float3 { 0% { transform: translateY(0) scale(1);} 100% { transform: translateY(60px) scale(1.12);} }
        `}</style>
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
              style={{ maxWidth: 1200, width: '100%', height: 'auto', borderRadius: 18, background: '#fff', marginLeft: '40px' }}
              className="user-home-img"
            />
          </div>

          <div style={{ height: 40 }} />

          {/* Video card grid */}
          <div className="user-home-video-container">    
            <div className="user-home-video-grid">
              {[0,1,2,3].map(i => (
                <div key={i} className="sign-card-video-box">
                  <video src={i === 0 ? helloVideo : i === 1 ? howareyouVideo : i === 2 ? thankyouVideo : goodmorningVideo} className="sign-language-video" controls />
                  <div className="video-overlay" />
                  <div className="video-label">
                    {i === 0 ? 'Hello' : i === 1 ? 'How are you' : i === 2 ? 'Thank you' : 'Good morning'}
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Section: exPress demo video */}
            <div style={{ height: 160 }} />
            <hr style={{ border:'none', borderTop:'2.5px solid #e3eafc', margin:'0 0 36px 0', width:'100%' }} />

            <div className="express-demo-container">
              {/* Text */}
              <div className="express-demo-text">
                <div className="express-demo-title">
                  exPress Demo
                </div>
                <div className="express-demo-description">
                  See how exPress helps you learn and practice sign language interactively. Watch the demonstration to explore our features and discover how easy it is to start communicating visually!
                </div>
              </div>

              {/* Video */}
              <div className="express-demo-video-wrapper">
                <video src={expressVideo} className="express-demo-video" controls muted />
              </div>
            </div>

          <div ref={pageEndRef} style={{ height: 120 }} />
        </div>
      </div>
    </div>
  );
}
