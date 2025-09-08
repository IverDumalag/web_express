// File: src/user/UserAboutPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/UserAboutPage.css';

const UserAboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="user-about-page">
      <div className="about-container">
        <h1>About This App</h1>

        {/* App Information Section */}
        <section className="about-section">
          <h2>App Information</h2>
          <p>
            Version: 1.0.0<br />
            Build Number: basta number d2<br />
            Release Date: Di ko pa sure<br /><br />
            exPress is a communication app designed to bridge the gap between the deaf-mute community 
            and the general public. It offers real-time speech-to-text and text-to-speech functionalities, 
            making conversations seamless and inclusive.<br /><br />
            For support or inquiries, contact us at @exPress@gmail.com
          </p>
        </section>

        {/* About Us Section */}
        <section className="about-section">
          <h2>About Us</h2>
          <p>
            We are the team behind exPress—Alyssa, Aisha, and Iver, a group of developers, innovators, 
            and advocates for inclusivity. Our journey began with one simple question: how can technology 
            help break down the barriers that keep people from understanding one another?<br /><br />
            We realized that communication challenges, especially for the deaf-mute community, often go unnoticed. 
            Many people struggle to express themselves or be understood, simply because sign language is not universally known. 
            This inspired us to create exPress, a tool that empowers individuals to connect, learn, and communicate without limits.<br /><br />
            We combined global and local knowledge by training our models with international sign language datasets from Kaggle 
            and Filipino Sign Language data from Mendeley to ensure accuracy and relevance for the Filipino community.<br /><br />
            Our mission: Develop innovative technologies that empower the deaf-mute community and foster inclusive communication for all.<br /><br />
            Our vision: A future where communication knows no limits, where exPress serves as both a tool and movement toward universal inclusivity.<br /><br />
            Our values: Inclusivity, purposeful innovation, community-first mindset, and empowerment guide everything we do.
          </p>
        </section>

        {/* Privacy Policy Section */}
        <section className="about-section">
          <h2>Privacy Policy</h2>
          <p>
            Last Updated: August 22, 2025<br /><br />
            exPress is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, and safeguard your personal information when you use our mobile and web applications.<br /><br />
            • We collect only the minimum data necessary to provide and improve functionality.<br />
            • Conversations are processed locally whenever possible to maximize privacy.<br />
            • We never sell or trade your personal information to third parties.<br />
            • You may request access, correction, or deletion of your data at any time.<br /><br />
            We apply industry-standard security measures to protect your information. 
            If data must be stored in the cloud, it is encrypted and handled with strict safeguards.<br /><br />
            By using exPress, you consent to this Privacy Policy. Updates will be reflected with a revised “Last Updated” date above. 
            For questions or requests regarding your data, contact us at @exPress@gmail.com.
          </p>
        </section>

        {/* Terms Section */}
        <section className="about-section">
          <h2>Terms</h2>
          <p>
            Last Updated: August 22, 2025<br /><br />
            By using exPress, you agree to the following terms:<br /><br />
            • Use the app for lawful purposes only.<br />
            • Respect other users and their privacy.<br />
            • Do not attempt to reverse engineer the app.<br />
            • We reserve the right to update these terms.<br />
            • Continued use constitutes acceptance of changes.
          </p>
        </section>

        <button className="back-button" onClick={() => navigate("/usermenu")}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default UserAboutPage;
