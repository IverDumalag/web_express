import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GuestNavBar from "../components/GuestNavBar";
import signLanguageImage from "../assets/logo.png";
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
        html {
          scroll-behavior: smooth;
        }

        .app-container {
          background: linear-gradient(to bottom, #05131B, #4A5E70);
          color: #E6E6E6;
          text-align: center;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
        }

        .navbar {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #12243A;
          padding: 10px 20px;
          border-radius: 8px;
          width: 100%;
          max-width: 2000px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 900px;
        }

        .left-section, .right-section {
          display: flex;
          align-items: center;
          gap: 1.5em;
        }

        .nav-item, .brand-link, .download-link {
          cursor: pointer;
          color: #E6E6E6;
          font-weight: 500;
          font-size: 0.95em;
          user-select: none;
        }

        .brand-link {
          font-size: 1.5em;
          font-weight: bold;
          margin-right: 1em;
          display: flex;
          align-items: center;
        }

        .download-link {
          text-decoration: underline;
        }

        .account-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .account-icon {
          cursor: pointer;
          font-size: 1.5em;
          user-select: none;
        }

        .dropdown {
          display: none;
          position: absolute;
          right: 0;
          top: 2em;
          background: #E6E6E6;
          color: #12243A;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          min-width: 130px;
          z-index: 1002;
          flex-direction: column;
          font-weight: 500;
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
        }

        .dropdown a:hover {
          background: #d0dce7;
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
        }

        .hero-image {
          flex: 1 1 400px;
          max-width: 450px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .hero-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .hero-text {
          flex: 1 1 400px;
          max-width: 600px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .main-title {
          font-size: 2.8em;
          font-weight: bold;
          color: #E6E6E6;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .highlight-text {
          color: #FF6B6B;
        }

        .sub-title {
          font-size: 1.2em;
          color: #B0BFCB;
          margin-bottom: 30px;
        }

        .button-container {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .get-started-btn,
        .learn-more-btn {
          background-color: #2C3E5A;
          color: #E6E6E6;
          border: none;
          padding: 12px 28px;
          cursor: pointer;
          border-radius: 12px;
          font-size: 1em;
          font-weight: 600;
          transition: background 0.3s ease;
          user-select: none;
        }

        .get-started-btn:hover,
        .learn-more-btn:hover {
          background-color: #3d5473;
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
