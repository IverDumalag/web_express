import React, { useState, useRef, useEffect } from "react";

const FaqsPage = () => {
  const faqs = [
    {
      question: "What is exPress?",
      answer: "exPress is a sign language learning platform that provides real-time translation and interactive learning tools."
    },
    {
      question: "Who can use exPress?",
      answer: "Anyone interested in learning Filipino Sign Language, including beginners and advanced learners, can use exPress."
    },
    {
      question: "Is exPress available on mobile devices?",
      answer: "Yes! exPress works across multiple platforms including web and mobile devices."
    },
    {
      question: "Can exPress translate both sign-to-text and text-to-sign?",
      answer: "Absolutely! It supports real-time translation in both directions to facilitate communication."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Ensure contentRefs has a ref for each FAQ
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, [faqs.length]);

  return (
    <section style={{ padding: "7em 5vw", background: "#f0f4ff", width: "100%" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "2em", color: "#334E7B" }}>
    Frequently Asked Questions
      </h1>

      <div style={{ maxWidth: "800px", margin: "0 225px" }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "12px",
              marginBottom: "1em",
              padding: "1em 1.5em",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => toggleFaq(index)}
          >
            <h2 style={{ margin: 0, color: "#12243A" }}>{faq.question}</h2>
            
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              style={{
                maxHeight: openIndex === index ? `${contentRefs.current[index]?.scrollHeight}px` : "0px",
                transition: "max-height 0.4s ease",
                overflow: "hidden",
              }}
            >
              <p style={{ marginTop: "0.8em", color: "#555", lineHeight: 1.5 }}>
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqsPage;
