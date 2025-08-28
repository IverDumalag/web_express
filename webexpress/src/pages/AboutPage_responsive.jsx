import React from "react";
import expressDemoVideo from "../assets/express video  demonstration.mp4";
import "../CSS/AboutPage.css";

const AboutPage = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} className="about-section">
      {/* Left Side - Text */}
      <div className="about-text-content">
        <h2 className="about-title">
          What is exPress?
        </h2>
        <p className="about-description">
          <strong>exPress</strong> is an interactive platform designed to make
          learning sign language accessible, engaging, and easy for everyone.
          With a hands-on demo, you'll experience how technology can empower
          communication in a fun and meaningful way.
        </p>
      </div>

      {/* Right Side - Video */}
      <div className="about-video-content">
        <video
          width="100%"
          height="auto"
          controls
          className="about-video"
        >
          <source src={expressDemoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
});

export default AboutPage;
