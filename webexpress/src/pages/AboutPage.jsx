import React from "react";
import expressDemoVideo from "../assets/express video  demonstration.mp4"; // <-- your file

const AboutPage = React.forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      style={{
        padding: "5em 2em",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
      }}
    >
      {/* Left Side - Text */}
      <div style={{ flex: "1 1 400px", maxWidth: "500px", textAlign: "left" }}>
        <h2 style={{ fontSize: "2em", marginBottom: "0.5em", color: "#12243A" }}>
          What is exPress?
        </h2>
        <p style={{ fontSize: "1.1em", lineHeight: "1.6", color: "#333" }}>
          <strong>exPress</strong> is an interactive platform designed to make
          learning sign language accessible, engaging, and easy for everyone.
          With a hands-on demo, you’ll experience how technology can empower
          communication in a fun and meaningful way.
        </p>
      </div>

      {/* Right Side - Video */}
      <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
        <video
          width="100%"
          height="auto"
          controls
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <source src={expressDemoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
});

export default AboutPage;
