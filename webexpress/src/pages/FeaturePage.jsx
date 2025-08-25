import React from "react";
import firstImg from "../assets/first.png";
import secondImg from "../assets/second.png";
import thirdImg from "../assets/third.png";

const FeaturePage = () => {
  const sections = [
    {
      title: "EXPLORE OUR FEATURES",
      img: firstImg,
      heading: "Sign To Text",
      description: "Real-time sign language to text powered by TensorFlow – fast, accurate, and inclusive communication.",
      reverse: false, // image left
    },
    {
      img: secondImg,
      heading: "Personalized Feedback",
      description: "Receive instant feedback on your signs to improve learning efficiency.",
      reverse: true, // image right
    },
    {
      img: thirdImg,
      heading: "Cross-Platform Support",
      description: "Works across multiple platforms to provide inclusive communication anywhere.",
      reverse: false, // image left
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

        .feature-page-container {
          min-height: 100vh;
          width: 100vw;
          padding: 5em 5vw;
          box-sizing: border-box;
          font-family: 'Roboto Mono', monospace;
          background: linear-gradient(135deg, #e0f0ff, #ffffff);
          background-size: cover;
          background-position: center;
          color: #12243A;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8em;
        }

        .section-title {
          font-weight: 900;
          font-size: 2.7rem;
          text-align: center;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #334E7B;
          margin-bottom: 2em;
        }

        .section-container {
          display: flex;
          max-width: 1000px;
          width: 100%;
          gap: 8em;
          align-items: center;
          justify-content: center;
        }

        .section-container img {
          max-width: 55%;
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
            flex-direction: column;
          }
          .section-container img {
            max-width: 90%;
            margin-bottom: 1em;
          }
          .section-text { text-align: center; }
        }
      `}</style>

      <div className="feature-page-container">
        {sections.map((section, idx) => (
          <div key={idx} style={{ width: "90%" }}>
            <h1 className="section-title">{section.title}</h1>
            <div
              className="section-container"
              style={{ flexDirection: section.reverse ? "row-reverse" : "row" }}
            >
              <img src={section.img} alt={section.heading} />
              <div className="section-text">
                <h2>{section.heading}</h2>
                <p>{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturePage;
