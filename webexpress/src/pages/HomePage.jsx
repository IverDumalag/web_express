import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";
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
  const aboutPageRef = useRef(null);
  const challengesPageRef = useRef(null);
  const featuresPageRef = useRef(null);
  const faqsPageRef = useRef(null);

  const scrollToAboutPage = () => {
    if (aboutPageRef.current) {
      aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      switch (location.state.scrollTo) {
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
          font-size: 1.7em;
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
          font-size: 1em;
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

        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-image">
              <img src={signLanguageImage} alt="Sign language illustration" />
            </div>

            <div className="hero-text">
              <h1 className="main-title">
                Learn Sign Language<br />
                <span className="highlight-text">Visually & Interactively</span>
              </h1>

              <p className="sub-title">
                Empower communication for everyone—start learning sign language the easy and engaging way.
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
            <p style={{ fontSize: "1.1em", lineHeight: "1.6", color: "#333" }}>
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
              color: "#333"
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
              color: #333;
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
  <section ref={faqsPageRef} id="faqs" className="landing-section faqs-section" style={{ padding: "7em 2vw", background: "#fff", width: "100vw", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <style>{`
            .faq-item {
              background: #fff;
              border-radius: 12px;
              margin-bottom: 1.5em;
              padding: 1.5em 2em;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              cursor: pointer;
              overflow: hidden;
              transition: all 0.3s ease;
              max-width: 900px;
              width: 100%;
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
            }
            .faq-answer {
              margin-top: 0.8em;
              color: #555;
              line-height: 1.5;
              transition: max-height 0.4s ease;
            }
            .faq-item.open {
              background: #f7faff;
              box-shadow: 0 6px 20px rgba(51,84,199,0.08);
            }
          `}</style>
          <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "2em", color: "#334E7B" }}>Frequently Asked Questions</h1>
          <div style={{ maxWidth: "900px", width: "100%" }}>
            <FAQItem question="What is exPress?" answer="exPress is a sign language learning platform that provides real-time translation and interactive learning tools." />
            <FAQItem question="Who can use exPress?" answer="Anyone interested in learning Filipino Sign Language, including beginners and advanced learners, can use exPress." />
            <FAQItem question="Is exPress available on mobile devices?" answer="Yes! exPress works across multiple platforms including web and mobile devices." />
            <FAQItem question="Can exPress translate both sign-to-text and text-to-sign?" answer="Absolutely! It supports real-time translation in both directions to facilitate communication." />
          </div>
        </section>

  {/* FAQItem component for FAQ section */}
      </div>
      <footer style={{
        width: '100%',
        fontFamily: 'Roboto Mono, monospace',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#334E7B',
        color: '#fff',
        padding: '2.5em 0 1.2em 0'
      }}>
        <div style={{
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(51,84,199,0.08)',
          padding: '0 2em',
          maxWidth: 900,
          width: '95%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '2em',
        }}>
          {/* About express */}
          <div style={{ minWidth: 180, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', color: '#fff', fontSize: '0.98em' }}>
              <a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>About us</a>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact us</a>
            </div>
          </div>
        </div>
       
        <div style={{ color: '#fff', fontSize: '0.98em', marginBottom: '1.2em', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} exPress. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default HomePage;
