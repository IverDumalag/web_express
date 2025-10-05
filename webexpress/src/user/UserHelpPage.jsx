// File: src/user/UserHelpPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/UserAboutPage.css'; // reuse the same CSS as AboutPage

const UserHelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
        <h1>Help & FAQ</h1>

        {/* Frequently Asked Questions Section */}
        <section className="about-section">
          <h2>Frequently Asked Questions</h2>
          <p>
            <strong>What is exPress?</strong><br />
            - exPress is a mobile and web-based communication tool that translates sign language 
            into text and text or audio into sign language animations, helping bridge conversations 
            between deaf individuals and non-signers.<br /><br />

            <strong>Is exPress an e-learning app?</strong><br />
            - No. exPress is not an e-learning platform. Its main purpose is to support real-time 
            communication, not structured teaching.<br /><br />

            <strong>Which languages does exPress support?</strong><br />
            - Currently, exPress supports international sign language datasets from Kaggle and 
            Filipino Sign Language (FSL) data from Mendeley. More sign languages will be added in 
            future updates.<br /><br />

            <strong>Do I need internet access to use exPress?</strong><br />
            - Most features require internet to ensure accuracy, but offline capabilities are 
            planned in future versions.<br /><br />

            <strong>How accurate is exPress?</strong><br />
            - exPress uses machine learning trained on both international and Filipino datasets. 
            Accuracy improves with each update, though variations in signing style may affect results.<br /><br />

            <strong>How can I send feedback?</strong><br />
            - Feedback can be shared through the Feedback Section in the app menu.<br /><br />

            <strong>Does exPress work on all devices?</strong><br />
            - exPress runs on most modern Android devices and web browsers. Older devices may have 
            limitations.<br /><br />

            <strong>Will exPress work in low-light environments?</strong><br />
            - Best results are achieved with good lighting. Poor lighting may affect gesture 
            recognition.<br /><br />

            <strong>Can exPress be used in schools or workplaces?</strong><br />
            - Yes. It can be used in classrooms, offices, healthcare, and public service settings.<br /><br />

            <strong>How often is the app updated?</strong><br />
            - Updates are released regularly to improve accuracy, add features, and expand language support.
          </p>
        </section>

  {/* Back to Menu button removed for popup usage */}
  </div>
  );
};

export default UserHelpPage;
