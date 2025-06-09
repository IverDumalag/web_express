import React from "react";
import firstImg from "../assets/first.png";
import secondImg from "../assets/second.png";
import thirdImg from "../assets/third.png";

const FeaturePage = () => {
  return (
    <>
      <style>{`
        .feature-page-container {
          min-height: 100vh;
          width: 100%;
          padding: 60px 40px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(
            0deg, 
            #9BA8AB 0%, 
            #253745 0%, 
            #4A5C6A 24%, 
            #11212D 52%, 
            #06141B 62%
          );
          color: white;
          position: relative;
          overflow-x: hidden;
        }

        .title-text {
          font-weight: 900;
          font-size: 3.7rem;
          margin-bottom: 60px;
          user-select: none;
          text-align: center;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #2563eb 0%, #4F8AF4 60%, #B0BFCB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 24px #11212d33) drop-shadow(0 1px 0 #fff);
          border-radius: 28px;
          padding: 22px 38px 18px 38px;
          box-shadow: 0 8px 32px 0 #2563eb22;
          position: relative;
          display: inline-block;
          transition: box-shadow 0.3s;
        }

        .cards-wrapper {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 32px 48px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .card {
          flex: 1 1 320px;
          max-width: 380px;
          min-width: 260px;
          height: 480px;
          border-radius: 40px;
          box-sizing: border-box;
          padding: 36px 24px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          color: white;
          font-weight: 600;
          font-size: 1.35rem;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
          transition: transform 0.3s cubic-bezier(.4,1.7,.6,1);
          background-clip: padding-box;
          margin: 0 8px 32px 8px;
        }
        .card:hover {
          transform: translateY(-12px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.7);
        }

        .card.left {
          background: #52677D;
          border: 10px solid white;
        }

        .card.center {
          background: #D1CFC9;
          color: #11212D;
        }

        .card.right {
          background: #1C2E4A;
          border: 10px solid white;
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
          max-width: 270px;
          max-height: 200px;
          object-fit: contain;
          margin-bottom: 28px;
          border-radius: 20px;
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
          font-size: 1.45rem;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .card-content p {
          font-size: 1.05rem;
          font-weight: 400;
          line-height: 1.4;
          margin: 0 8px;
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
          color: #11212D;
        }
        .card.left .card-content h2, .card.left .card-content p,
        .card.right .card-content h2, .card.right .card-content p {
          color: #fff;
        }
        .card.center .card-content h2, .card.center .card-content p {
          color: #11212D;
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
