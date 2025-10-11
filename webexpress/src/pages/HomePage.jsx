import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";
import MessagePopup from "../components/MessagePopup";
import DownloadAppPopup from "../components/DownloadAppPopup";
import signLanguageImage from "../assets/express.png"; 
import demoVideo from "../assets/express video  demonstration.mp4";

import firstImg from "../assets/first.png";
import secondImg from "../assets/second.png";
import thirdImg from "../assets/third.png";


function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        {question}
        <span className="faq-toggle">{open ? '-' : '+'}</span>
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState({ open: false, title: '', description: '' });
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const aboutPageRef = useRef(null);
  const challengesPageRef = useRef(null);
  const featuresPageRef = useRef(null);
  const faqsPageRef = useRef(null);

  const scrollToAboutPage = () => {
    if (aboutPageRef.current) {
      aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactClick = () => {
    setPopup({
      open: true,
      title: "Contact Us Here",
      description: "projectz681@gmail.com, garciaumiko@gmail.com, rossangelaisha201423@gmail.com"
    });
  };

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      switch (location.state.scrollTo) {
        case "hero":
          setTimeout(() => {
            const heroElement = document.getElementById("hero");
            if (heroElement) {
              heroElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 80);
          break;
        case "about":
          if (aboutPageRef.current)
            setTimeout(() => aboutPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
          break;
        case "challenges":
          if (challengesPageRef.current)
            setTimeout(() => challengesPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
          break;
        case "features":
        case "feature":
          if (featuresPageRef.current)
            setTimeout(() => featuresPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
          break;
        case "faqs":
          if (faqsPageRef.current)
            setTimeout(() => faqsPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
          break;
        default:
          break;
      }
    }
  }, [location]);

  React.useEffect(() => {
    const handleGuestNavScroll = (e) => {
      const section = e.detail?.section;
      if (section) {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("guestnav-scroll", handleGuestNavScroll);
    return () => window.removeEventListener("guestnav-scroll", handleGuestNavScroll);
  }, []);

  React.useEffect(() => {
    const handleDownloadPopup = () => {
      setShowDownloadPopup(true);
    };
    window.addEventListener("show-download-popup", handleDownloadPopup);
    return () => window.removeEventListener("show-download-popup", handleDownloadPopup);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        html {
          scroll-behavior: smooth;
        }

        .app-container {
          font-family: 'Roboto Mono', monospace;
          overflow-x: hidden;
          background: #fff;
          background-size: 200% 200%;
          animation: bg-animate 12s ease-in-out infinite;
          color: #12243A;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          text-align: left;
        }

        @keyframes bg-animate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-section {
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 40px;
          max-width: 900px;
          width: 100%;
          flex-wrap: wrap;
        }

        .hero-image {
          flex: 1 1 300px;
          max-width: 320px;
          padding: 10px;
          overflow: visible;
        }

        .hero-image img {
          width: 100%;
          height: auto;
          display: block;
          animation: logo-wave 4s infinite ease-in-out;
          transform-origin: 70% 80%;
        }

        @keyframes logo-wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }

        .hero-text {
          flex: 1 1 300px;
          max-width: 350px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }

        .main-title {
          font-size: 2.5em;
          font-weight: bold;
          color: #12243A;
          margin-bottom: 12px;
          line-height: 1.2;

          
        }

        .highlight-text {
          color: #12243A;
          font-weight: bold;
        }

        .sub-title {
          font-size: 1.2em;
          color: #12243A;
          margin-bottom: 18px;
        }

        .learn-more-btn {
          background-color: #334E7B;
          color: #fff;
          border: none;
          padding: 8px 18px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.95em;
          font-weight: 600;
          transition: background 0.3s ease;
          user-select: none;
          align-self: flex-start;
        }

        .learn-more-btn:hover {
          background-color: #1a2e4a;
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .hero-image {
            max-width: 200px;
          }

          .hero-text {
            text-align: center;
          }

          .learn-more-btn {
            align-self: center;
          }
        }
      `}</style>

      <div className="app-container">
        <GuestNavBar />
        
        <MessagePopup
          open={popup.open}
          title={popup.title}
          description={popup.description}
          onClose={() => setPopup({ ...popup, open: false })}
        />

        <DownloadAppPopup
          open={showDownloadPopup}
          onClose={() => setShowDownloadPopup(false)}
        />

        <section id="hero" className="hero-section">
          <div className="hero-content">
            <div className="hero-image">
              <img src={signLanguageImage} alt="Sign language illustration" />
            </div>

            <div className="hero-text">
              <h1 className="main-title">
                Use Sign Language Cards<br /> 
                <span className="highlight-text">Easily & Interactively</span>
              </h1>

              <p className="sub-title">
                Empower communication for everyone—start using sign language the easy and engaging way.
              </p>

              <button className="learn-more-btn" onClick={scrollToAboutPage}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section ref={aboutPageRef} id="about" className="landing-section about-section" style={{ padding: "5em 2em", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px", maxWidth: "500px", textAlign: "left" }}>
            <h2 style={{ fontSize: "2em", marginBottom: "0.5em", color: "#334E7B" }}>What is exPress?</h2>
            <p style={{ fontSize: "1.1em", lineHeight: "1.6", color: "#334E7B" }}>
              <strong>exPress</strong> is an interactive platform designed to make learning sign language accessible, engaging, and easy for everyone. With a hands-on demo, you’ll experience how technology can empower communication in a fun and meaningful way.
            </p>
          </div>
          <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
            <video width="100%" height="auto" controls style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
        <section ref={challengesPageRef} id="challenges" className="landing-section challenges-section"
          style={{
            padding: "5em 2vw 7em 2vw",
            minHeight: "100vh",
            width: "100vw",
            background: "#fff",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            boxSizing: "border-box",
            gap: "2em"
          }}
        >
          <h2 style={{ fontSize: "1.8em", marginBottom: "0em", color: "#334E7B" }}>
            Challenges We Address
          </h2>
          <p
            style={{
              fontSize: "1.1em",
              lineHeight: "1.6",
              maxWidth: "1200px",
              marginBottom: "3em",
              color: "#334E7B"
            }}
          >
            Many individuals struggle to learn sign language due to the lack of
            accessible and engaging resources. exPress tackles these challenges by
            providing an interactive, visual, and beginner-friendly platform that
            bridges the gap between communication and inclusivity.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "2em",
              flexWrap: "wrap",
              width: "100%"
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                height: "380px",
                perspective: "1000px"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.6s",
                  transformStyle: "preserve-3d"
                }}
                className="flip-card"
              >
                {/* Front */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    background: "linear-gradient(135deg, #12243A, #1a3b6a)",
                    color: "#fff"
                  }}
                >
                  <h3 style={{ marginBottom: "0.5em" }}>Limited awareness of Filipino Sign Language (FSL)</h3>
                  <p style={{ margin: 0 }}></p>
                </div>
                {/* Back */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                    color: "#12243A",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <p style={{ margin: 0 }}>exPress provides real-time FSL-to-text and text-to-FSL translation, making communication seamless and accessible for everyone.</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                height: "380px",
                perspective: "1000px"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.6s",
                  transformStyle: "preserve-3d"
                }}
                className="flip-card"
              >
                {/* Front */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    background: "linear-gradient(135deg, #12243A, #1a3b6a)",
                    color: "#fff"
                  }}
                >
                  <h3 style={{ marginBottom: "0.5em" }}>Communication barriers in essential services</h3>
                  <p style={{ margin: 0 }}></p>
                </div>
                {/* Back */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                    color: "#12243A",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <p style={{ margin: 0 }}>exPress empowers inclusive interactions anywhere ensuring the Deaf community is heard and understood. Our tool provides an accessible, immediate, and private way to have conversations, connect independently.</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                height: "380px",
                perspective: "1000px"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.6s",
                  transformStyle: "preserve-3d"
                }}
                className="flip-card"
              >
                {/* Front */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    background: "linear-gradient(135deg, #12243A, #1a3b6a)",
                    color: "#fff"
                  }}
                >
                  <h3 style={{ marginBottom: "0.5em" }}>Technology not tailored to the Filipino Deaf experience</h3>
                  <p style={{ margin: 0 }}></p>
                </div>
                {/* Back */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                    color: "#12243A",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <p style={{ margin: 0 }}>exPress is built using localized FSL data, with support for FSL-English code-switching and non-verbal cues unique to Filipino sign language.</p>
                </div>
              </div>
            </div>
          </div>
          <style>{`.flip-card:hover { transform: rotateY(180deg); }`}</style>
        </section>
  <section ref={featuresPageRef} id="features" className="landing-section features-section">
          <style>{`
            .feature-page-container {
              min-height: 100vh;
              width: 100vw;
              padding: 8em 25vw;
              box-sizing: border-box;
              font-family: 'Roboto Mono', monospace;
              background: #fff;
              color: #12243A;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6em;
            }
            .section-title {
              font-weight: 900;
              font-size: 2.5rem;
              text-align: center;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #334E7B;
              margin-bottom: 2em;
            }
            .section-container {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 3em;
              flex-wrap: wrap;
              width: 100%;
              max-width: 1200px;
            }
            .section-container img {
              max-width: 45%;
              height: auto;
              border-radius: 14px;
              object-fit: contain;
            }
            .section-text {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: left;
            }
            .section-text h2 {
              font-size: 1.8rem;
              margin-bottom: 12px;
              color: #12243A;
            }
            .section-text p {
              font-size: 1.1rem;
              line-height: 1.5;
              color: #334E7B;
            }
            @media (max-width: 900px) {
              .section-container {
                flex-direction: column !important;
              }
              .section-container img {
                max-width: 90%;
                margin-bottom: 1em;
              }
              .section-text {
                text-align: center;
              }
            }
          `}</style>
          <div className="feature-page-container">
            <h1 className="section-title">EXPLORE OUR FEATURES</h1>
            <div className="section-container" style={{ flexDirection: "row" }}>
              <img src={firstImg} alt="Sign To Text" />
              <div className="section-text">
                <h2 style={{ color: '#334E7B' }}>Sign To Text</h2>
                <p>Real-time sign language to text powered by TensorFlow – fast, accurate, and inclusive communication.</p>
              </div>
            </div>
            <div className="section-container" style={{ flexDirection: "row-reverse" }}>
              <img src={secondImg} alt="Audio-Text to Sign" />
              <div className="section-text">
                <h2 style={{ color: '#334E7B' }}>Audio-Text to Sign</h2>
                <p>Receive instant feedback on your signs to improve learning efficiency.</p>
              </div>
            </div>
            <div className="section-container" style={{ flexDirection: "row" }}>
              <img src={thirdImg} alt="Sign Language Cards" />
              <div className="section-text">
                <h2 style={{ color: '#334E7B' }}>Sign Language Cards</h2>
                <p>Works across multiple platforms to provide inclusive communication anywhere.</p>
              </div>
            </div>
          </div>
        </section>
<section 
  ref={faqsPageRef} 
  id="faqs" 
  className="landing-section faqs-section" 
  style={{ 
    padding: "7em 2vw", 
    background: "#fff", 
    width: "100vw", 
    boxSizing: "border-box", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  }}
>
  <style>{`
    .faq-item {
      background: #fff;
      border-radius: 12px;
      margin-bottom: 1.5em;
      padding: 1.5em 2em;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      max-width: 900px;
      width: 100%;
      transform: translateY(0);
    }
    .faq-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 22px rgba(0,0,0,0.15);
    }
    .faq-question {
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-size: 1.2em;
      color: #12243A;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      outline: none;
      padding: 0;
    }
    .faq-toggle {
      font-size: 1.5em;
      color: #334E7B;
      margin-left: 1em;
      transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .faq-item.open .faq-toggle {
      transform: rotate(180deg);
    }
    .faq-answer {
      margin-top: 0.8em;
      color: #555;
      line-height: 1.6;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: 
        max-height 0.8s cubic-bezier(0.25, 1, 0.5, 1),
        opacity 0.6s ease 0.1s,
        transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      transform: translateY(-12px);
    }
    .faq-item.open .faq-answer {
      max-height: 500px; /* large enough for longest answer */
      opacity: 1;
      transform: translateY(0);
    }
    .faq-item.open {
      background: #fff;
      outline: 2px solid #334E7B;
      box-shadow: 0 10px 28px rgba(0,0,0,0.15);
    }
  `}</style>

  <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "2em", color: "#334E7B" }}>
    Frequently Asked Questions
  </h1>

  <div style={{ maxWidth: "900px", width: "100%" }}>
    <FAQItem 
      question="What is exPress?" 
      answer="exPress is a sign language learning platform that provides real-time translation and interactive learning tools." 
      icon="▼"
    />
    <FAQItem 
      question="Who can use exPress?" 
      answer="Anyone interested in learning Filipino Sign Language, including beginners and advanced learners, can use exPress." 
      icon="▼"
    />
    <FAQItem 
      question="Is exPress available on mobile devices?" 
      answer="Yes! exPress works across multiple platforms including web and mobile devices." 
      icon="▼"
    />
    <FAQItem 
      question="Can exPress translate both sign-to-text and text-to-sign?" 
      answer="Absolutely! It supports real-time translation in both directions to facilitate communication." 
      icon="▼"
    />
  </div>
</section>

{/* FAQItem component for FAQ section */}
</div>

<footer style={{
  width: '100%',
  fontFamily: 'Roboto Mono, monospace',
  background: '#334E7B',
  color: '#fff',
  padding: '3em 0 1.5em 0'
}}>

  {/* Main container */}
  <div style={{
    maxWidth: 1100,
    width: '95%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2em',
    flexWrap: 'wrap'
  }}>

    {/* Column 1 - Join/Register */}
    <div style={{ flex: '1.5', minWidth: '250px', paddingTop: '3em' }}>
      <p style={{ fontSize: '1em', marginBottom: '1em' }}>
        Welcome to <strong>exPress</strong>, your bridge for inclusive communication.  
        Join our growing community today.
      </p>
      <a href="/register" style={{
        background: '#fff',
        color: '#334E7B',
        padding: '0.6em 1.4em',
        borderRadius: '8px',
        fontWeight: '600',
        textDecoration: 'none',
        fontSize: '0.95em',
        display: 'inline-block'
      }}>Register Now</a>
    </div>

    {/* Column 2 - Credibility Info */}
    <div style={{ flex: '1', minWidth: '250px' }}>
      <h4 style={{ marginBottom: '0.8em' }}>Trusted Data Sources</h4>
      <p style={{ fontSize: '0.95em', lineHeight: '1.6em' }}>
        Our sign language recognition system is built on certified datasets from <strong>Kaggle</strong> and <strong>Mendeley</strong>, and has been validated by professionals in the Philippines. We are committed to ensuring authenticity, accuracy, and reliability in every interaction.
      </p>
    </div>

    {/* Column 3 - Contact Info */}
    <div style={{ flex: '1', minWidth: '250px' }}>
      <h4 style={{ marginBottom: '0.8em' }}>Contact Us</h4>
      <p>Need help or want to collaborate? Reach out to us anytime.</p>
      <button 
        onClick={handleContactClick}
        style={{
          background: '#fff',
          color: '#334E7B',
          padding: '0.8em 1.4em',
          borderRadius: '8px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.95em',
          margin: '1em 0',
          display: 'inline-block'
        }}
      >
        Contact Us
      </button>

      {/* Social Media */}
      {/* 
      <div style={{ display: 'flex', gap: '1.2em', marginTop: '0.5em' }}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35C.597 0 0 .597 0 
                     1.326v21.348C0 23.403.597 24 1.326 
                     24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 
                     1.894-4.788 4.659-4.788 1.325 0 2.464.099 
                     2.796.143v3.24l-1.918.001c-1.504 
                     0-1.796.715-1.796 1.763v2.313h3.587l-.467 
                     3.622h-3.12V24h6.116C23.403 24 
                     24 23.403 24 22.674V1.326C24 
                     .597 23.403 0 22.675 0z"/>
          </svg>
        </a>

        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M24 4.557a9.83 9.83 0 0 
                     1-2.828.775 4.932 4.932 0 0 
                     0 2.165-2.724c-.951.555-2.005.959-3.127 
                     1.184A4.916 4.916 0 0 0 16.616 
                     3c-2.72 0-4.924 2.204-4.924 
                     4.924 0 .386.044.762.128 
                     1.124C7.728 8.89 4.1 6.908 
                     1.671 3.936a4.822 4.822 0 0 
                     0-.666 2.475c0 1.708.869 
                     3.216 2.188 4.099a4.902 
                     4.902 0 0 1-2.229-.616v.062c0 
                     2.385 1.693 4.374 3.946 
                     4.827a4.936 4.936 0 0 
                     1-2.224.085c.626 1.956 2.444 
                     3.377 4.6 3.419A9.867 9.867 
                     0 0 1 0 19.54a13.94 13.94 
                     0 0 0 7.548 2.212c9.057 
                     0 14.01-7.513 14.01-14.01 
                     0-.213-.005-.425-.014-.636A10.012 
                     10.012 0 0 0 24 4.557z"/>
          </svg>
        </a>

        <a href="mailto:express.app@gmail.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 12.713l-11.99-9.713h23.98l-11.99 9.713zm0 2.574l-12-9.713v13.426c0 
                     1.104.896 2 2 2h20c1.104 0 2-.896 
                     2-2v-13.426l-12 9.713z"/>
          </svg>
        </a>
      </div>
      */}
    </div>
  </div>

  {/* Copyright Row */}
  <div style={{
    textAlign: 'center',
    marginTop: '2em',
    fontSize: '0.9em',
    borderTop: '1px solid rgba(255,255,255,0.3)',
    paddingTop: '1em'
  }}>
    &copy; {new Date().getFullYear()} exPress. All rights reserved.
  </div>
</footer>
</>
);
};

export default HomePage;