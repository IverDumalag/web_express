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
      title: "",
      img: secondImg,
      heading: "Audio-Text to Sign",
      description: "Receive instant feedback on your signs to improve learning efficiency.",
      reverse: true, // image right
    },
    {
      title: "", 
      img: thirdImg,
      heading: "Sign Language Cards",
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
          color: #334E7B;
        }

        @media (max-width: 1200px) {
          .feature-page-container {
            padding: 6em 15vw;
          }
        }

        @media (max-width: 1024px) {
          .feature-page-container {
            padding: 5em 10vw;
            gap: 4em;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .section-text h2 {
            font-size: 1.6rem;
          }
          
          .section-text p {
            font-size: 1rem;
          }
        }

        @media (max-width: 900px) {
          .feature-page-container {
            padding: 4em 5vw;
            gap: 3em;
          }
          
          .section-container {
            flex-direction: column !important;
            gap: 2em;
          }
          
          .section-container img {
            max-width: 80%;
            margin-bottom: 1em;
          }
          
          .section-text {
            text-align: center;
          }
          
          .section-title {
            font-size: 1.8rem;
            margin-bottom: 1.5em;
          }
        }

        @media (max-width: 768px) {
          .feature-page-container {
            padding: 3em 3vw;
            gap: 2.5em;
          }
          
          .section-title {
            font-size: 1.6rem;
            letter-spacing: 1px;
          }
          
          .section-text h2 {
            font-size: 1.4rem;
          }
          
          .section-text p {
            font-size: 0.95rem;
          }
          
          .section-container img {
            max-width: 90%;
          }
        }

        @media (max-width: 600px) {
          .feature-page-container {
            padding: 2em 2vw;
            gap: 2em;
          }
          
          .section-title {
            font-size: 1.4rem;
            margin-bottom: 1em;
          }
          
          .section-text h2 {
            font-size: 1.3rem;
            margin-bottom: 8px;
          }
          
          .section-text p {
            font-size: 0.9rem;
            line-height: 1.4;
          }
          
          .section-container img {
            max-width: 95%;
          }
        }

        @media (max-width: 480px) {
          .feature-page-container {
            padding: 1.5em 1vw;
            gap: 1.5em;
          }
          
          .section-title {
            font-size: 1.2rem;
            letter-spacing: 0.5px;
          }
          
          .section-text h2 {
            font-size: 1.2rem;
          }
          
          .section-text p {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 360px) {
          .feature-page-container {
            padding: 1em 0.5vw;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
          
          .section-text h2 {
            font-size: 1.1rem;
          }
          
          .section-text p {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="feature-page-container">
        {sections.map((section, idx) => (
          <div key={idx} style={{ width: "100%" }}>
            {section.title && <h1 className="section-title">{section.title}</h1>}
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
