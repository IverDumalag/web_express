import React from "react";

const ProblemSolutionPage = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} style={{ padding: "5em 2em", minHeight: "60vh" }}>
      <h2>Problem & Solution</h2>
      <p>
        Many people face communication barriers due to the lack of accessible
        sign language resources. exPress solves this by providing a visual and
        interactive learning tool for everyone.
      </p>
    </section>
  );
});

export default ProblemSolutionPage;
