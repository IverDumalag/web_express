import React from "react";
import firstImg from "../assets/first.png";
import secondImg from "../assets/second.png";
import thirdImg from "../assets/third.png";

const FeaturePage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        .feature-page-container {
          min-height: 100vh;
          width: 100%;
          padding: 0 40px;
          box-sizing: border-box;
          font-family: 'Roboto Mono', monospace;
          background: #fff;
          color: #12243A;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title-text {
          font-weight: 900;
          font-size: 2.7rem;
          margin-bottom: 32px;
          user-select: none;
          text-align: center;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: #334E7B;
          background: none;
          padding: 16px 28px 14px 28px;
          position: relative;
          display: inline-block;
        }

        .cards-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 26px 36px;
          flex-wrap: wrap;
          margin-bottom: 0;
          width: 100%;
        }

        .card {
          flex: 1 1 260px;
          max-width: 320px;
          min-width: 180px;
          height: 380px;
          border-radius: 30px;
          box-sizing: border-box;
          padding: 26px 18px 20px 18px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          color: #12243A;
          font-weight: 600;
          font-size: 1.13rem;
          text-align: center;
          box-shadow: 0 6px 16px #334E7B22;
          transition: transform 0.3s cubic-bezier(.4,1.7,.6,1);
          background-clip: padding-box;
          margin: 0 8px 22px 8px;
          border: 2px solid #334E7B22;
          background: #fff;
        }
        .card:hover {
          transform: translateY(-12px);
          box-shadow: 0 15px 30px #334E7B33;
        }

        .card.left {
          background: #334E7B;
          color: #fff;
          border: 2px solid #334E7B;
        }

        .card.center {
          background: #fff;
          color: #334E7B;
          border: 2px solid #334E7B22;
        }

        .card.right {
          background: #12243A;
          color: #fff;
          border: 2px solid #12243A;
        }

        .card-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px 0 0 0;
          text-align: center;
        }

        .card-image {
          width: 100%;
          max-width: 180px;
          max-height: 120px;
          object-fit: contain;
          margin-bottom: 18px;
          border-radius: 14px;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeInUp 0.8s ease forwards;
        }

        /* Animation */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-content h2 {
          font-size: 1.22rem;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .card-content p {
          font-size: 0.98rem;
          font-weight: 400;
          line-height: 1.35;
          margin: 0 6px;
        }

        @media (max-width: 900px) {
          .title-text {
            font-size: 2.5rem;
          }
          .cards-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 24px;
            margin-bottom: 16px;
          }
          .card {
            margin: 0 0 20px 0;
            max-width: 95vw;
            min-width: 0;
            height: auto;
            padding: 28px 10px 20px 10px;
            font-size: 1.1rem;
          }
          .card-content h2 {
            font-size: 1.2rem;
          }
          .card-content p {
            font-size: 0.95rem;
          }
          .card-image {
            max-width: 160px;
            max-height: 100px;
            margin-bottom: 12px;
          }
        }

        @media (max-width: 500px) {
          .card-content h2 {
            font-size: 1.2rem;
          }
          .card-content p {
            font-size: 0.85rem;
          }
        }

        .card-content h2, .card-content p {
          color: inherit;
        }

        @media screen and (max-width: 767px) {
          .feature-page-container {
            padding: 0 2vw !important;
            min-width: 100vw !important;
            overflow-x: hidden !important;
          }
          .main-content {
            min-height: 60vh !important;
            padding: 0 2vw !important;
          }
          .feature-cards {
            width: 100vw !important;
            padding: 0 2vw !important;
          }
          .title-text {
            font-size: 2em !important;
            padding: 12px 10px 10px 10px !important;
            margin-bottom: 24px !important;
          }
          .cards-wrapper {
            flex-direction: column !important;
            gap: 18px !important;
            margin-bottom: 10px !important;
          }
          .card {
            max-width: 98vw !important;
            min-width: 0 !important;
            height: auto !important;
            padding: 18px 6px 14px 6px !important;
            font-size: 1em !important;
            border-radius: 18px !important;
          }
          .card-image {
            max-width: 90vw !important;
            max-height: 100px !important;
            margin-bottom: 10px !important;
          }
          .card-content h2 {
            font-size: 1.1em !important;
          }
          .card-content p {
            font-size: 0.9em !important;
          }
        }
      `}</style>

      <div className="feature-page-container">
        <h1 className="title-text">EXPLORE OUR FEATURES</h1>

        <div className="cards-wrapper">
          <div className="card left">
            <div className="card-content">
              <img
                src={firstImg}
                alt="Sign Language Cards"
                className="card-image"
              />
              <h2>Sign Language Cards</h2>
              <p>Real-time sign language to text powered by TensorFlow – fast, accurate, and inclusive communication.</p>
            </div>
          </div>
          <div className="card center">
            <div className="card-content">
              <img
                src={secondImg}
                alt="Text-Audio to Sign"
                className="card-image"
              />
              <h2>Text-Audio to Sign</h2>
              <p>Delivering instant, inclusive communication through smart, real-time translation.</p>
            </div>
          </div>
          <div className="card right">
            <div className="card-content">
              <img
                src={thirdImg}
                alt="Sign to Text"
                className="card-image"
              />
              <h2>Sign to Text</h2>
              <p>Real-time, accurate translation that breaks communication barriers and promotes inclusivity.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturePage;