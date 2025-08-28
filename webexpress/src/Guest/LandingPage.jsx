import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import GuestNavBar from "./GuestNavBar";
import signLanguageImage from "../assets/LOGO.png";
import demoVideo from "../assets/express video  demonstration.mp4";
import "./LandingPage.css";
import "./GuestNavBar.css";

const LandingPage = () => {
	const location = useLocation();
	const aboutPageRef = useRef(null);
	const challengesPageRef = useRef(null);
	const featuresPageRef = useRef(null);
	const faqsPageRef = useRef(null);

	const scrollToAboutPage = () => {
		if (aboutPageRef.current) {
			aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	React.useEffect(() => {
		if (location.state && location.state.scrollTo) {
			switch (location.state.scrollTo) {
				case "about":
					if (aboutPageRef.current)
						setTimeout(() => aboutPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
					break;
				case "challenges":
					if (challengesPageRef.current)
						setTimeout(() => challengesPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
					break;
				case "features":
				case "feature":
					if (featuresPageRef.current)
						setTimeout(() => featuresPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
					break;
				case "faqs":
					if (faqsPageRef.current)
						setTimeout(() => faqsPageRef.current.scrollIntoView({ behavior: "smooth" }), 80);
					break;
				default:
					break;
			}
		}
	}, [location]);

	React.useEffect(() => {
		const handleGuestNavScroll = (e) => {
			const section = e.detail?.section;
			if (section) {
				const el = document.getElementById(section);
				if (el) {
					el.scrollIntoView({ behavior: "smooth" });
				}
			}
		};
		window.addEventListener("guestnav-scroll", handleGuestNavScroll);
		return () => window.removeEventListener("guestnav-scroll", handleGuestNavScroll);
	}, []);

	return (
		<div className="app-container">
			<GuestNavBar />
			<section className="guest-navlinks-section">
				<div className="guest-navlinks-navbar">
					<div className="guest-nav-links">
						<span className="guest-nav-link" onClick={() => window.location.pathname = "/"}>Home</span>
						<span className="guest-nav-link" onClick={() => window.dispatchEvent(new CustomEvent("guestnav-scroll", { detail: { section: "demo" } }))}>Demo</span>
						<span className="guest-nav-link" onClick={() => window.dispatchEvent(new CustomEvent("guestnav-scroll", { detail: { section: "challenges" } }))}>Challenges</span>
						<span className="guest-nav-link" onClick={() => window.dispatchEvent(new CustomEvent("guestnav-scroll", { detail: { section: "features" } }))}>Features</span>
						<span className="guest-nav-link" onClick={() => window.dispatchEvent(new CustomEvent("guestnav-scroll", { detail: { section: "faqs" } }))}>FAQs</span>
					</div>
				</div>
			</section>
			<section className="hero-section">
				<div className="hero-content">
					<div className="hero-image">
						<img src={signLanguageImage} alt="Sign language illustration" />
					</div>
					<div className="hero-text">
						<h1 className="main-title">
							Learn Sign Language<br />
							<span className="highlight-text">Visually & Interactively</span>
						</h1>
						<p className="sub-title">
							Empower communication for everyone—start learning sign language the easy and engaging way.
						</p>
						<button className="learn-more-btn" onClick={scrollToAboutPage}>
							Learn More
						</button>
					</div>
				</div>
			</section>

			<section id="demo" className="landing-section demo-section">
				<h2 className="demo-header">Demo</h2>
				<div className="demo-content-flex">
					<div className="demo-text">
						<p>See exPress in action! Watch the demonstration video to understand how our platform works and how you can start using sign language cards.</p>
					</div>
					<div className="demo-video">
						<video src={demoVideo} controls width="700" style={{maxWidth: '100%'}} />
					</div>
				</div>
			</section>

			<section id="challenges" className="landing-section challenges-section">
				<h2>Challenges</h2>
				<div className="challenges-cards-flex">
					<div className="challenge-card">
						<div className="card-inner">
							<div className="card-front">
								<h3>Challenge 1</h3>
								<p>sample lang</p>
							</div>
							<div className="card-back">
								<h3>test</h3>
								<p>Practice and test your knowledge of the sign language alphabet with interactive quizzes.</p>
							</div>
						</div>
					</div>
					<div className="challenge-card">
						<div className="card-inner">
							<div className="card-front">
								<h3>Challenge 2</h3>
								<p>sample lang.</p>
							</div>
							<div className="card-back">
								<h3>test</h3>
								<p>Flip to see and practice essential phrases for daily conversation in sign language.</p>
							</div>
						</div>
					</div>
					<div className="challenge-card">
						<div className="card-inner">
							<div className="card-front">
								<h3>Challenge 3</h3>
								<p>sample lang </p>
							</div>
							<div className="card-back">
								<h3>test</h3>
								<p>Flip to learn and test your ability to sign numbers and count in sign language.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="features" className="landing-section features-section">
				<h2>Features</h2>
				<div className="features-list">
					<div className="feature-row left">
						<div className="feature-text">
							<h3>Sign-to-Text</h3>
							<p>Convert sign language gestures into written text in real time, making communication seamless for everyone.</p>
						</div>
						<div className="feature-img">
							{/* Replace with actual image/icon if available */}
							<span role="img" aria-label="Sign-to-Text" style={{fontSize: '3em'}}>1</span>
						</div>
					</div>
					<div className="feature-row right">
						<div className="feature-img">
							<span role="img" aria-label="Audio-to-Text" style={{fontSize: '3em'}}>2</span>
						</div>
						<div className="feature-text">
							<h3>Audio-to-Text</h3>
							<p>Transcribe spoken words into text instantly, helping users follow conversations and instructions easily.</p>
						</div>
					</div>
					<div className="feature-row left">
						<div className="feature-text">
							<h3>Sign Language Cards</h3>
							<p>Interactive cards to help you learn, review, and master sign language vocabulary at your own pace.</p>
						</div>
						<div className="feature-img">
							<span role="img" aria-label="Sign Language Cards" style={{fontSize: '3em'}}>3</span>
						</div>
					</div>
				</div>
			</section>

			<section id="faqs" className="landing-section faqs-section">
				<h2>FAQs</h2>
				<div className="faqs-accordion">
					<FAQItem question="What is exPress?" answer="exPress is a platform to help you learn and communicate using sign language, with interactive features and real-time translation." />
					<FAQItem question="Is exPress free to use?" answer="Yes, exPress offers free access to its core learning and communication features." />
					<FAQItem question="Can I use exPress on my phone?" answer="Absolutely! exPress is designed to work on both desktop and mobile devices." />
				</div>
			</section>

			<footer className="landing-footer">
				<p>&copy; 2025 exPress. All rights reserved.</p>
			</footer>
		</div>
	);
};

function FAQItem({ question, answer }) {
	const [open, setOpen] = React.useState(false);
	return (
		<div className={`faq-item${open ? ' open' : ''}`}>
			<button className="faq-question" onClick={() => setOpen(o => !o)}>
				{question}
				<span className="faq-toggle">{open ? '-' : '+'}</span>
			</button>
			{open && <div className="faq-answer">{answer}</div>}
		</div>
	);
}

export default LandingPage;
