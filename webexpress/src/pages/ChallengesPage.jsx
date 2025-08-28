import React from "react";

const ChallengesPage = React.forwardRef((props, ref) => {
  const challenges = [
    { title: "Limited awareness of Filipino Sign Language (FSL)", info: "exPress provides real-time FSL-to-text and text-to-FSL translation, making communication seamless and accessible for everyone. " },
    { title: "Communication barriers in essential services", info: " exPress empowers inclusive interactions anywhere ensuring the Deaf community is heard and understood.Our tool provides an accessible, immediate, and private way to have conversations, connect independently." },
    { title: "Technology not tailored to the Filipino Deaf experience", info: "exPress is built using localized FSL data, with support for FSL-English code-switching and non-verbal cues unique to Filipino sign language. " },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "5em 2vw 7em 2vw", // reduce side padding for full-width
        minHeight: "100vh",
        width: "100vw", // full viewport width
        background: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        gap: "2em",
      }}
    >
      <h2 style={{ fontSize: "1.8em", marginBottom: "0em", color: "#334E7B" }}>
        Challenges We Address
      </h2>

      <p
        style={{
          fontSize: "1.1em",
          lineHeight: "1.6",
          maxWidth: "1200px", // optionally increase max width for larger screens
          marginBottom: "3em",
          color: "#333",
        }}
      >
        Many individuals struggle to learn sign language due to the lack of
        accessible and engaging resources. exPress tackles these challenges by
        providing an interactive, visual, and beginner-friendly platform that
        bridges the gap between communication and inclusivity.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2em",
          flexWrap: "wrap",
          width: "100%", // full container width
        }}
      >
        {challenges.map((challenge, index) => (
          <div
            key={index}
            style={{
              flex: "1 1 250px",
              maxWidth: "300px",
              height: "380px",
              perspective: "1000px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                textAlign: "center",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
              }}
              className="flip-card"
            >
              {/* Front */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  background: "linear-gradient(135deg, #12243A, #1a3b6a)",
                  color: "#fff",
                }}
              >
                <h3 style={{ marginBottom: "0.5em" }}>{challenge.title}</h3>
                <p style={{ margin: 0 }}>{challenge.caption}</p>
              </div>

              {/* Back */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  backgroundColor: "#fff",
                  color: "#12243A",
                  transform: "rotateY(180deg)",
                }}
              >
                <p style={{ margin: 0 }}>{challenge.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .flip-card:hover {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
});

export default ChallengesPage;
