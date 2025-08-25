import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";
import signLanguageImage from "../assets/express_logo.png"; // resolved conflict
import AboutPage from "../pages/AboutPage";
import ChallengesPage from "../pages/ChallengesPage";
import FeaturesPage from "../pages/FeaturePage";
import FaqsPage from "../pages/FAQsPage";

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
          background: linear-gradient(270deg, #fff, #e3eafc, #d6e0f5, #fff, #e3eafc);
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
          background-color: #12243A;
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

        <div ref={aboutPageRef}><AboutPage /></div>
        <div ref={challengesPageRef}><ChallengesPage /></div>
        <div ref={featuresPageRef}><FeaturesPage /></div>
        <div ref={faqsPageRef}><FaqsPage /></div>
      </div>
    </>
  );
};

export default HomePage;
