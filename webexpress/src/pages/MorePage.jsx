import React, { forwardRef } from "react";

const AboutPage = forwardRef((props, ref) => {
  return (
    <>
      <style>{`
        .about-page-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .youtube-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .youtube-bg iframe {
          width: 100vw;
          height: 56.25vw; /* 16:9 aspect ratio */
          min-height: 100vh;
          min-width: 177.77vh;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
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

        .about-page h2 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }

        .about-page p {
          font-size: 1.2em;
          max-width: 800px;
          line-height: 1.5;
          color: #d0dce7;
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
        <div className="youtube-bg">
          <iframe
            src="https://www.youtube.com/embed/J80Vc2y9Fcs?autoplay=1&mute=1&loop=1&playlist=J80Vc2y9Fcs&controls=0&showinfo=0&modestbranding=1"
            frameBorder="0"
            allow="autoplay; fullscreen"
            title="Background Video"
          ></iframe>
        </div>

        <section className="about-page">
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
