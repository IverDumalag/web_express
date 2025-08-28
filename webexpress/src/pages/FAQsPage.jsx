import React, { useState, useRef, useEffect } from "react";
import "../CSS/FAQsPage.css";

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
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, [faqs.length]);

  return (
    <section className="faqs-section">
      <h1 className="faqs-title">
        Frequently Asked Questions
      </h1>

      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="faq-item"
            onClick={() => toggleFaq(index)}
          >
            <h2 className="faq-question">{faq.question}</h2>

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`faq-content ${openIndex === index ? 'open' : ''}`}
              style={{
                maxHeight:
                  openIndex === index
                    ? `${contentRefs.current[index]?.scrollHeight}px`
                    : "0px",
              }}
            >
              <p className="faq-answer">
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
