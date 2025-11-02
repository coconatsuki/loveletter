// Assassin Modal Styling Constants
const ASSASSIN_STYLES = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "assassinModalFadeIn 0.3s ease-out",
  },
  content: {
    background:
      "linear-gradient(135deg, #2d1b1b 0%, #4a0000 50%, #8b0000 100%)",
    border: "4px solid #ffd700",
    borderRadius: "20px",
    padding: 0,
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
    minWidth: "40%",
    maxWidth: "850px",
    animation:
      "assassinModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
  },
  blason: {
    content: '"⚔️"',
    position: "absolute",
    top: "-30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#8b0000",
    border: "3px solid #ffd700",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },
  header: {
    borderRadius: "20px 20px 0 0",
    background: "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
    padding: "2.5rem 1rem 1.2rem",
    textAlign: "center",
    borderBottom: "2px solid #ffd700",
  },
  title: {
    fontFamily: '"Cinzel", serif',
    fontSize: "1.4rem",
    color: "#ffd700",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },
  body: {
    padding: "1.5rem",
    background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 100%)",
    borderRadius: "0 0 20px 20px",
  },
  message: {
    fontFamily: '"Lora", serif',
    fontSize: "1.3rem",
    lineHeight: "1.6",
    color: "#afddf6",
    margin: "0 0 1rem 0",
    textAlign: "justify",
  },
  rivalName: {
    color: "rgb(231 122 202)",
    fontWeight: "bold",
  },
  highlightedText: {
    color: "#ffd700",
    fontWeight: "bold",
  },
  finalPunchLine: {
    margin: "2rem 0 0",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "rgb(255, 68, 68)",
  },
  footer: {
    padding: "1.5rem 1.5rem 0",
    borderRadius: "0 0 20px 20px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    borderTop: "1px inset #ffff00b0",
    marginTop: "1rem",
  },
  button: {
    fontFamily: '"Cinzel", serif',
    fontSize: "1.3rem",
    fontWeight: "bold",
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
    display: "flex",
    width: "45%",
    justifyContent: "center",
    cursor: "pointer",
  },
  strikeButton: {
    background: "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)",
    color: "#fff",
    border: "2px solid #ffd700",
  },
  mercyButton: {
    background: "linear-gradient(135deg, #4682b4 0%, #2f4f4f 100%)",
    color: "#fff",
    border: "2px solid #87ceeb",
  },
  acknowledgeButton: {
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    color: "#8b0000",
    border: "2px solid #8b4513",
    width: "60%",
  },
  // Effect illustration image styles
  effectImage: {
    float: "left",
    width: "clamp(150px, 20vw, 200px)", // Responsive: 150px min, 20% viewport width, 200px max
    height: "clamp(150px, 20vw, 200px)", // Perfect square that scales
    marginRight: "20px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "3px solid #d4af37",
    boxShadow:
      "0 8px 20px rgba(0, 0, 0, 0.6), 0 3px 10px rgba(255, 215, 0, 0.3)",
    objectFit: "cover",
    objectPosition: "center",
  },
  bodyWithImage: {
    overflow: "auto", // Clearfix for float
  },
};

export default function AssassinPromptModal({
  promptData,
  onReveal,
  onIgnore,
  onAcknowledge,
}) {
  const { attacker, guessedStrength, targetCard } = promptData;
  const hasAssassin = targetCard?.id === 14;
  const isCorrectGuess = promptData?.isCorrectGuess;

  // Helper function to get the appropriate illustration image
  const getAssassinImage = () => {
    if (!hasAssassin && !isCorrectGuess) {
      return "/img/01-guard-failure-target.png";
    } else if (!hasAssassin && isCorrectGuess) {
      return "/img/01-guard-arrest.png";
    } else if (hasAssassin && isCorrectGuess) {
      return "/img/01-guard-assassin-discovered.png";
    } else if (hasAssassin && !isCorrectGuess) {
      return "/img/01-guard-assassin-not-discovered.png";
    }
    return null; // Fallback (should never happen)
  };

  const assassinImageUrl = getAssassinImage();

  let title = "";
  let body = null;

  if (!hasAssassin && !isCorrectGuess) {
    title = "🛡️ An Unfounded Accusation!";
    body = (
      <div
        style={{ ...ASSASSIN_STYLES.body, ...ASSASSIN_STYLES.bodyWithImage }}
      >
        {/* Effect illustration image */}
        <img
          src={assassinImageUrl}
          alt="Guard search illustration"
          style={ASSASSIN_STYLES.effectImage}
        />
        <div>
          <p style={ASSASSIN_STYLES.message}>
            🚪 A <span style={ASSASSIN_STYLES.highlightedText}>guard</span>{" "}
            bursts into your residence, sent by{" "}
            <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span> with tales
            of treachery. He searches every corner, looking for the "traitor"
            your rival described… but finds only your loyal ally, the{" "}
            <span style={ASSASSIN_STYLES.highlightedText}>
              {targetCard.name} (Strength {targetCard.strength})
            </span>
            .
          </p>
          <p style={ASSASSIN_STYLES.message}>
            Realizing his mistake, he stammers an apology and retreats, leaving
            your servants rattled but unharmed. You're <strong>safe…</strong>{" "}
            for now. 😌
          </p>
        </div>
        <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
          <button
            style={{
              ...ASSASSIN_STYLES.button,
              ...ASSASSIN_STYLES.acknowledgeButton,
            }}
            onClick={onAcknowledge}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 18px rgba(255, 215, 0, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  } else if (!hasAssassin && isCorrectGuess) {
    title = "💥 The Trap Springs Shut!";

    body = (
      <div
        style={{ ...ASSASSIN_STYLES.body, ...ASSASSIN_STYLES.bodyWithImage }}
      >
        {/* Effect illustration image */}
        <img
          src={assassinImageUrl}
          alt="Guard arrest illustration"
          style={ASSASSIN_STYLES.effectImage}
        />
        <div>
          <p style={ASSASSIN_STYLES.message}>
            🚨 Heavy boots echo through your hall—{" "}
            <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span>'s guard
            storms in, armed with a royal warrant.
          </p>
          <p style={ASSASSIN_STYLES.message}>
            He finds and arrests your secret accomplice, the{" "}
            <span style={ASSASSIN_STYLES.highlightedText}>
              {targetCard.name}, for conspiracy.
            </span>
            !
          </p>
          <p style={ASSASSIN_STYLES.finalPunchLine}>
            The scandal spreads like fire, damaging your reputation.{" "}
            <strong>
              You're{" "}
              <span style={ASSASSIN_STYLES.highlightedText}>ELIMINATED.</span>{" "}
              💔
            </strong>
          </p>
        </div>
        <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
          <button
            style={{
              ...ASSASSIN_STYLES.button,
              ...ASSASSIN_STYLES.acknowledgeButton,
            }}
            onClick={onAcknowledge}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 18px rgba(255, 215, 0, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }}
          >
            Face your fate
          </button>
        </div>
      </div>
    );
  } else if (hasAssassin && isCorrectGuess) {
    title = "🗡️ Cornered in the Dark!";
    body = (
      <div
        style={{ ...ASSASSIN_STYLES.body, ...ASSASSIN_STYLES.bodyWithImage }}
      >
        {/* Effect illustration image */}
        <img
          src={assassinImageUrl}
          alt="Assassin discovered illustration"
          style={ASSASSIN_STYLES.effectImage}
        />
        <div>
          <p style={ASSASSIN_STYLES.message}>
            ⚔️ <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span>'s guard
            forces his way into your quarters, hunting the traitor your rival
            described.
          </p>
          <p style={ASSASSIN_STYLES.message}>
            He pulls back a curtain and uncovers your accomplice — the beautiful
            and deadly{" "}
            <span style={{ color: "rgb(195, 92, 212)", fontWeight: "bold" }}>
              Royal Assassin
            </span>
            ! 🔍
          </p>
          <p style={{ ...ASSASSIN_STYLES.message, marginBottom: "0" }}>
            ⚠️ The guard knows your{" "}
            <span style={ASSASSIN_STYLES.highlightedText}>secret</span>. If he
            arrests both of you for treason, your reputation will be ruined...
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#ffd700",
              textAlign: "center",
            }}
          >
            Strike now, or face elimination! ⚔️
          </p>
        </div>
        <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
          <button
            style={{
              ...ASSASSIN_STYLES.button,
              ...ASSASSIN_STYLES.strikeButton,
              width: "100%",
            }}
            onClick={onReveal}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ff1744 0%, #dc143c 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 18px rgba(220, 20, 60, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }}
          >
            ⚔️ Strike back!
          </button>
        </div>
      </div>
    );
  } else if (hasAssassin && !isCorrectGuess) {
    title = "🌙 Shadows Stir in the Hall";
    body = (
      <div
        style={{ ...ASSASSIN_STYLES.body, ...ASSASSIN_STYLES.bodyWithImage }}
      >
        {/* Effect illustration image */}
        <img
          src={assassinImageUrl}
          alt="Assassin concealed illustration"
          style={ASSASSIN_STYLES.effectImage}
        />
        <div>
          <p style={ASSASSIN_STYLES.message}>
            Under orders from{" "}
            <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span>, a guard
            prowls your halls, hunting the conspirator they described.
          </p>
          <p style={ASSASSIN_STYLES.message}>
            He passes within a breath of your hidden ally — the{" "}
            <span style={{ color: "rgb(195 92 212)", fontWeight: "bold" }}>
              Royal Assassin
            </span>{" "}
            — and suspects nothing. The door is half-open… the night very quiet.
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#ffd700",
            }}
          >
            ⚔️ Silence him to terrify your rival, or let him leave in ignorance.
          </p>
        </div>
        <div style={ASSASSIN_STYLES.footer}>
          <button
            style={{
              ...ASSASSIN_STYLES.button,
              ...ASSASSIN_STYLES.strikeButton,
            }}
            onClick={onReveal}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ff1744 0%, #dc143c 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 18px rgba(220, 20, 60, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }}
          >
            ⚔️ Strike back!
          </button>
          <button
            style={{
              ...ASSASSIN_STYLES.button,
              ...ASSASSIN_STYLES.mercyButton,
            }}
            onClick={onIgnore}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #5a9fd4 0%, #4682b4 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 18px rgba(70, 130, 180, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #4682b4 0%, #2f4f4f 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }}
          >
            🕊️ Let them go
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes assassinModalFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(5px);
            }
          }
          
          @keyframes assassinModalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-40px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={ASSASSIN_STYLES.overlay}>
        <div style={ASSASSIN_STYLES.content}>
          <div style={ASSASSIN_STYLES.blason}>⚔️</div>
          <div style={ASSASSIN_STYLES.header}>
            <h3 style={ASSASSIN_STYLES.title}>{title}</h3>
          </div>
          {body}
        </div>
      </div>
    </>
  );
}
