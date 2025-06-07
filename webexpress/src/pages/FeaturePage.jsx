import React from "react";

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
          font-weight: 700;
          font-size: 4rem;
          margin-bottom: 60px;
          color: black;
          user-select: none;
          text-align: center;
        }

        .cards-wrapper {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .card {
          flex: 1 1 300px;
          max-width: 400px;
          height: 520px;
          border-radius: 40px;
          box-sizing: border-box;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-weight: 600;
          font-size: 1.5rem;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
          background-clip: padding-box;
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
          justify-content: flex-start;
          align-items: center;
          padding: 20px;
          text-align: center;
        }

        .card-image {
          width: 100%;
          max-height: 180px;
          object-fit: contain;
          margin-bottom: 20px;
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
          font-size: 1.75rem;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .card-content p {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.3;
          margin: 0 10px;
        }

        .button {
          width: 180px;
          height: 60px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          transition: background-color 0.3s ease;
          margin-top: auto;
        }
        .button.light {
          background: #D1CFC9;
          color: #11212D;
          border: none;
        }
        .button.dark {
          background: #1C2E4A;
          color: white;
          border: none;
        }

        .button.light:hover {
          background-color: #c0bdb8;
        }

        .button.dark:hover {
          background-color: #163053;
        }

        @media (max-width: 900px) {
          .title-text {
            font-size: 2.5rem;
          }
          .card {
            max-width: 90vw;
            height: auto;
            padding: 25px 20px;
            font-size: 1.2rem;
          }
          .card-content h2 {
            font-size: 1.4rem;
          }
          .card-content p {
            font-size: 0.9rem;
          }
          .button {
            width: 140px;
            height: 50px;
            font-size: 0.9rem;
          }
          .card-image {
            max-height: 140px;
            margin-bottom: 15px;
          }
        }

        @media (max-width: 500px) {
          .card-content h2 {
            font-size: 1.2rem;
          }
          .card-content p {
            font-size: 0.85rem;
          }
          .button {
            width: 120px;
            height: 45px;
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
      `}</style>

      <div className="feature-page-container">
        <h1 className="title-text">EXPLORE OUR FEATURES</h1>

        <div className="cards-wrapper">
          <div className="card left">
            <div className="card-content">
              <img
                src="/assets/first.png"
                alt="Sign Language Cards"
                className="card-image"
              />
              <h2>Sign Language Cards</h2>
              <p>Real-time sign language to text powered by TensorFlow – fast, accurate, and inclusive communication.</p>
            </div>
            <button className="button light">Learn More</button>
          </div>
          <div className="card center">
            <div className="card-content">
              <img
                src="/assets/second.png"
                alt="Text-Audio to Sign"
                className="card-image"
              />
              <h2>Text-Audio to Sign</h2>
              <p>Delivering instant, inclusive communication through smart, real-time translation.</p>
            </div>
            <button className="button dark">Learn More</button>
          </div>
          <div className="card right">
            <div className="card-content">
              <img
                src="/assets/third.png"
                alt="Sign to Text"
                className="card-image"
              />
              <h2>Sign to Text</h2>
              <p>Real-time, accurate translation that breaks communication barriers and promotes inclusivity.</p>
            </div>
            <button className="button light">Learn More</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturePage;
