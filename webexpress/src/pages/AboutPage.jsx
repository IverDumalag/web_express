import React, { forwardRef, useEffect, useRef, useState } from "react";
import SLBG from "../assets/SLBG.mp4";

const AboutPage = forwardRef((props, ref) => {
  const sectionRef = useRef();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight - 100 && rect.bottom > 100) {
        setAnimate(true);
      } else {
        setAnimate(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // trigger on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .about-page-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .about-bg-video {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          filter: brightness(0.5) blur(1px);
          pointer-events: none;
          user-select: none;
        }

        .about-page {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
          box-sizing: border-box;
          color: #E6E6E6;
          backdrop-filter: brightness(0.5); /* subtle dark overlay for text clarity */
        }

        .about-page h2, .about-page p {
          opacity: 0;
          transform: translateY(40px);
        }
        .about-page.animate h2 {
          font-size: 2.7em;
          margin-bottom: 20px;
          letter-spacing: 1px;
          font-weight: 800;
          color:rgb(68, 117, 194);
          text-shadow: 0 2px 16px #05131B99;
          animation: fadeInUp 1.1s 0.2s cubic-bezier(.4,1.7,.6,1) forwards;
        }
        .about-page.animate p {
          font-size: 1.35em;
          max-width: 820px;
          line-height: 1.7;
          color: #fff;
          font-weight: 500;
          margin-top: 10px;
          letter-spacing: 0.2px;
          animation: fadeInUp 1.1s 0.6s cubic-bezier(.4,1.7,.6,1) forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .about-page h2 {
            font-size: 2em;
          }

          .about-page p {
            font-size: 1em;
            padding: 0 10px;
          }
        }
      `}</style>

      <div className="about-page-container" ref={ref}>
        <div className="video-bg">
          <video
            className="about-bg-video"
            src={SLBG}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        <section
          className={`about-page${animate ? " animate" : ""}`}
          ref={sectionRef}
        >
          <h2>Why Learn Sign Language?</h2>
          <p>
            Learning sign language opens doors to connect with the Deaf community,
            enhances communication skills, and promotes inclusivity in everyday life.
            Our interactive platform helps you master it with fun, easy lessons.
          </p>
        </section>
      </div>
    </>
  );
});

export default AboutPage;
