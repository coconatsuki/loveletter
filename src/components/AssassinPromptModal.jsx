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
    padding: "1.5rem 1.5rem 2rem",
    background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 100%)",
    borderRadius: "0 0 20px 20px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
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

  let title = "🛡️ You've been targeted!";
  let message = "";
  let buttons = null;

  if (!hasAssassin && !isCorrectGuess) {
    message = (
      <div style={ASSASSIN_STYLES.body}>
        <p style={ASSASSIN_STYLES.message}>
          <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span> sent a Guard
          your way and guessed{" "}
          <span style={ASSASSIN_STYLES.highlightedText}>
            {" "}
            strength {guessedStrength}
          </span>
          , but you're holding{" "}
          <span style={ASSASSIN_STYLES.highlightedText}>
            {targetCard.name} (Strength {targetCard.strength})
          </span>
          .
        </p>{" "}
        <p style={ASSASSIN_STYLES.message}>
          You're <strong>safe</strong>... for now.
        </p>
      </div>
    );
    buttons = (
      <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.acknowledgeButton,
          }}
          onClick={onAcknowledge}
        >
          Continue
        </button>
      </div>
    );
  } else if (!hasAssassin && isCorrectGuess) {
    message = (
      <div style={ASSASSIN_STYLES.body}>
        <p style={ASSASSIN_STYLES.message}>
          <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span> sent a Guard
          your way and guessed your{" "}
          <span style={ASSASSIN_STYLES.highlightedText}>
            strength ({guessedStrength})
          </span>{" "}
          correctly!
        </p>
        <p style={ASSASSIN_STYLES.message}>
          You've been{" "}
          <strong>
            <span style={ASSASSIN_STYLES.highlightedText}>ELIMINATED.</span>
          </strong>
        </p>
      </div>
    );
    buttons = (
      <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.acknowledgeButton,
          }}
          onClick={onAcknowledge}
        >
          Face your fate
        </button>
      </div>
    );
  } else if (hasAssassin && isCorrectGuess) {
    title = "🗡️ YOUR SECRET IS DISCOVERED!";
    message = (
      <div style={ASSASSIN_STYLES.body}>
        <p style={ASSASSIN_STYLES.message}>
          <span style={ASSASSIN_STYLES.rivalName}>{attacker}'s</span> guard has
          found your{" "}
          <span style={{ color: "#9c27b0", fontWeight: "bold" }}>
            Royal Assassin
          </span>{" "}
          ally! 🔍
        </p>
        <p style={ASSASSIN_STYLES.message}>
          ⚠️ They know your{" "}
          <span style={ASSASSIN_STYLES.highlightedText}>deadly secret</span> and
          will report back to their master...
        </p>
        <p style={ASSASSIN_STYLES.finalPunchLine}>
          Strike now, or face elimination! ⚔️
        </p>
      </div>
    );
    buttons = (
      <div style={{ ...ASSASSIN_STYLES.footer, justifyContent: "center" }}>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.strikeButton,
            width: "100%",
          }}
          onClick={onReveal}
        >
          ⚔️ Strike back!
        </button>
      </div>
    );
  } else if (hasAssassin && !isCorrectGuess) {
    title = "🌙 A RIVAL'S GUARD INVESTIGATES";
    message = (
      <div style={ASSASSIN_STYLES.body}>
        <p style={ASSASSIN_STYLES.message}>
          <span style={ASSASSIN_STYLES.rivalName}>{attacker}'s</span> guard
          comes looking for a{" "}
          <span style={{ color: "#ffd700", fontWeight: "bold" }}>
            strength {guessedStrength}
          </span>
          , but finds a beautiful lady of the court, instead. 🔍 She seems to
          have lost her way.
        </p>
        <p
          style={{
            ...ASSASSIN_STYLES.message,
            margin: "0 0 12px 0",
            color: "#90caf9",
          }}
        >
          👤 He helps her out and turns to leave, unaware they've discovered
          your{" "}
          <span style={{ color: "#9c27b0", fontWeight: "bold" }}>
            Royal Assassin
          </span>{" "}
          ally!
        </p>
        <p
          style={{
            ...ASSASSIN_STYLES.message,
            margin: "0 0 12px 0",
            color: "#90caf9",
          }}
        >
          Killing that guard would frighten your rival{" "}
          <span style={ASSASSIN_STYLES.rivalName}>{attacker}</span> to death and
          eliminate them.
        </p>
        <p
          style={{
            margin: "0",
            fontSize: "1.3rem",
            fontWeight: "bold",
            color: "#ffd700",
          }}
        >
          ⚔️ One word from you, and she would do the dirty work.
        </p>
      </div>
    );
    buttons = (
      <div style={ASSASSIN_STYLES.footer}>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.strikeButton,
          }}
          onClick={onReveal}
        >
          ⚔️ Strike back!
        </button>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.mercyButton,
          }}
          onClick={onIgnore}
        >
          🕊️ Let them go
        </button>
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
          {message}
          {buttons}
        </div>
      </div>
    </>
  );
}
