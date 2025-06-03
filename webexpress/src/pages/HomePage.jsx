import React from "react";
import GuestNavBar from "../components/GuestNavBar";
import '../CSS/HomePage.css';

const HomePage = () => {
  const pageStyle = {
    backgroundColor: "#0F1A2B",
    minHeight: "100vh",
    width: "100%",
    position: "relative",
  };

  return (
    <>
      <div className="page-background" style={pageStyle}>
        <GuestNavBar />
        <div className="container">
        </div>
        <div>
          <div className="homepage-description-container">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%'}}>
              <span className="homepage-description-text">Express is very good</span>
              <span className="homepage-description-text2">Express is very good</span>
            </div>
          </div>
          <div className="button-container">
            <button className="under-logo-btn">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
