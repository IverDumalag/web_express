import React from "react";

const TestimonialsPage = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} style={{ padding: "5em 2em", minHeight: "60vh" }}>
      <h2>Testimonials</h2>
      <blockquote>
        "exPress made learning sign language so much easier for me!"
      </blockquote>
      <blockquote>
        "Finally, a tool that bridges the communication gap effectively."
      </blockquote>
    </section>
  );
});

export default TestimonialsPage;
