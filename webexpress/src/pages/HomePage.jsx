import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";
import signLanguageImage from "../assets/express_logo.png";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturePage";
import MorePage from "../pages/MorePage";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const aboutPageRef = useRef(null);
  const featuresPageRef = useRef(null);

  const scrollToAboutPage = () => {
    if (aboutPageRef.current) {
      aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeaturesPage = () => {
    if (featuresPageRef.current) {
      featuresPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMorePage = () => {
    if (morePageRef.current) {
      morePageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to section if instructed by nav (via state or event)
  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      if (location.state.scrollTo === "about" && aboutPageRef.current) {
        setTimeout(() => aboutPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
      } else if (
        (location.state.scrollTo === "features" || location.state.scrollTo === "feature") && featuresPageRef.current
      ) {
        setTimeout(() => featuresPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
      }
    }
    const handler = (e) => {
      if (e.detail.section === "about" && aboutPageRef.current) {
        aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (
        (e.detail.section === "features" || e.detail.section === "feature") && featuresPageRef.current
      ) {
        featuresPageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("guestnav-scroll", handler);
    return () => window.removeEventListener("guestnav-scroll", handler);
  }, [location, aboutPageRef, featuresPageRef]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        html {
          scroll-behavior: smooth;
        }

        .app-container {
          background: linear-gradient(270deg, #fff, #e3eafc, #d6e0f5, #fff, #e3eafc);
          background-size: 200% 200%;
          animation: bg-animate 12s ease-in-out infinite;
          color: #12243A;
          text-align: center;
          min-height: 100vh;
          font-family: 'Roboto Mono', monospace;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
        }

        @keyframes bg-animate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .navbar {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #12243A;
          padding: 10px 20px;
          /* border-radius removed */
          width: 100%;
          max-width: 2000px;
          box-sizing: border-box;
          flex-shrink: 0;
          font-family: 'Roboto Mono', monospace;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 900px;
          font-family: 'Roboto Mono', monospace;
        }

        .left-section, .right-section {
          display: flex;
          align-items: center;
          gap: 1.5em;
          font-family: 'Roboto Mono', monospace;
        }

        .nav-item, .brand-link, .download-link {
          cursor: pointer;
          color: #fff;
          font-weight: 500;
          font-size: 0.95em;
          user-select: none;
          font-family: 'Roboto Mono', monospace;
        }

        .brand-link {
          font-size: 1.5em;
          font-weight: bold;
          margin-right: 1em;
          display: flex;
          align-items: center;
          font-family: 'Roboto Mono', monospace;
        }

        .download-link {
          text-decoration: underline;
          font-family: 'Roboto Mono', monospace;
        }

        .account-container {
          position: relative;
          display: flex;
          align-items: center;
          font-family: 'Roboto Mono', monospace;
        }

        .account-icon {
          cursor: pointer;
          font-size: 1.5em;
          user-select: none;
          font-family: 'Roboto Mono', monospace;
        }

        .dropdown {
          display: none;
          position: absolute;
          right: 0;
          top: 2em;
          background: #fff;
          color: #12243A;
          /* border-radius removed */
          box-shadow: 0 2px 8px rgba(18,36,58,0.08);
          min-width: 130px;
          z-index: 1002;
          flex-direction: column;
          font-weight: 500;
          font-family: 'Roboto Mono', monospace;
        }

        .dropdown.show {
          display: flex;
        }

        .dropdown a {
          padding: 0.75em 1.2em;
          text-decoration: none;
          color: #12243A;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Roboto Mono', monospace;
        }

        .dropdown a:hover {
          background: #f2f4f8;
        }

        .main-content {
          height: 100vh;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
          flex-grow: 1;
          font-family: 'Roboto Mono', monospace;
        }

        .hero-image {
          flex: 1 1 300px;
          max-width: 320px;
          /* border-radius removed to avoid clipping animation */
          padding: 10px;
          background: transparent;
          overflow: visible;
          font-family: 'Roboto Mono', monospace;
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
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: 'Roboto Mono', monospace;
        }

        .main-title {
          font-size: 1.7em;
          font-weight: bold;
          color: #12243A;
          margin-bottom: 12px;
          line-height: 1.2;
          font-family: 'Roboto Mono', monospace;
        }

        .highlight-text {
          color: #12243A;
          font-weight: bold;
          font-family: 'Roboto Mono', monospace;
        }

        .sub-title {
          font-size: 1em;
          color: #12243A;
          margin-bottom: 18px;
          font-family: 'Roboto Mono', monospace;
        }

        .button-container {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: flex-start;
          font-family: 'Roboto Mono', monospace;
        }

        .get-started-btn,
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
          font-family: 'Roboto Mono', monospace;
        }

        .get-started-btn:hover,
        .learn-more-btn:hover {
          background-color: #1a2e4a;
        }

        @media (max-width: 768px) {
          .nav-content {
            max-width: 100%;
            flex-direction: column;
            gap: 10px;
          }
          .main-content {
            flex-direction: column;
            text-align: center;
          }
          .hero-text, .hero-image {
            max-width: 100%;
            flex: unset;
          }
          .hero-text {
            text-align: center;
          }
          .button-container {
            justify-content: center;
          }
        }

        @media screen and (max-width: 767px) {
          .app-container {
            padding: 0 !important;
            min-width: 100vw !important;
            overflow-x: hidden !important;
          }
          .main-content {
            flex-direction: column !important;
            padding: 0 2vw !important;
            gap: 18px !important;
            height: auto !important;
            min-height: 60vh !important;
            max-width: 100vw !important;
          }
          .hero-image {
            max-width: 98vw !important;
            border-radius: 10px !important;
            margin-bottom: 18px !important;
          }
          .hero-text {
            max-width: 98vw !important;
            text-align: center !important;
            padding: 0 2vw !important;
          }
          .main-title {
            font-size: 1.5em !important;
            margin-bottom: 10px !important;
          }
          .sub-title {
            font-size: 1em !important;
            margin-bottom: 16px !important;
          }
          .button-container {
            flex-direction: column !important;
            gap: 10px !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div className="app-container">
        <GuestNavBar />

        <div className="main-content">
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

            <div className="button-container">
              <button
                className="learn-more-btn"
                onClick={scrollToAboutPage}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <AboutPage ref={aboutPageRef} />

        <div ref={featuresPageRef} />
        <FeaturesPage />

      </div>
    </>
  );
};

export default HomePage;
