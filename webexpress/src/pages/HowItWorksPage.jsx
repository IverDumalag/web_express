import React from "react";

const HowItWorksPage = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} style={{ padding: "5em 2em", minHeight: "60vh" }}>
      <h2>How it Works</h2>
      <p>
        exPress uses AI-powered recognition and tutorials to teach sign language
        step by step, making the learning process interactive and fun.
      </p>
    </section>
  );
});

export default HowItWorksPage;
