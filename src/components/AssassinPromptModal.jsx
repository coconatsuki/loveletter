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
    maxWidth: "700px",
    animation:
      "assassinModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
  },
  header: {
    borderRadius: "20px 20px 0 0",
    background: "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
    padding: "30px 25px 20px 25px",
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
    padding: "6% 4% 3%",
    background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 100%)",
  },
  message: {
    fontFamily: '"Lora", serif',
    fontSize: "1.3rem",
    lineHeight: "1.6",
    color: "#afddf6",
    margin: 0,
    textAlign: "justify",
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
    message = `${attacker} played a Guard and guessed strength ${guessedStrength}, but you're holding ${targetCard.name} (Strength ${targetCard.strength}). You're safe... for now.`;
    buttons = (
      <button
        style={{
          ...ASSASSIN_STYLES.button,
          ...ASSASSIN_STYLES.acknowledgeButton,
          width: "100%",
        }}
        onClick={onAcknowledge}
      >
        Continue
      </button>
    );
  } else if (!hasAssassin && isCorrectGuess) {
    message = `${attacker} played a Guard and guessed your strength (${guessedStrength}) correctly! You've been ELIMINATED.`;
    buttons = (
      <button
        style={{
          ...ASSASSIN_STYLES.button,
          ...ASSASSIN_STYLES.acknowledgeButton,
          width: "100%",
        }}
        onClick={onAcknowledge}
      >
        Face your fate
      </button>
    );
  } else if (hasAssassin && isCorrectGuess) {
    title = "🗡️ YOUR DEADLY SECRET DISCOVERED!";
    message = `� ${attacker}'s guard comes too close to the truth! They suspect you hold ${guessedStrength}-strength card, and they're RIGHT! But as their eyes meet yours, a glint of steel catches the moonlight... You are no mere courtier seeking the Princess's heart. You are DEATH incarnate, hidden among the nobles. Will you let them live with this knowledge, or shall tonight be their last?`;
    buttons = (
      <button
        style={{
          ...ASSASSIN_STYLES.button,
          ...ASSASSIN_STYLES.strikeButton,
          width: "100%",
        }}
        onClick={onReveal}
      >
        ⚔️ STRIKE FROM THE SHADOWS
      </button>
    );
  } else if (hasAssassin && !isCorrectGuess) {
    title = "🌙 SHADOWS WHISPER OF OPPORTUNITY";
    message = `🔍 ${attacker}'s guard searches for strength ${guessedStrength}, but finds only ${targetCard.name} (Strength ${targetCard.strength}) in your grasp. They turn to leave, satisfied with their failed investigation... but you feel the weight of the blade concealed beneath your court robes. This guard has grown too bold, too curious. Perhaps it's time to send a message to the court about what happens to those who pry too deeply into royal secrets?`;
    buttons = (
      <div style={ASSASSIN_STYLES.footer}>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.strikeButton,
          }}
          onClick={onReveal}
        >
          ⚔️ SILENCE THEM FOREVER
        </button>
        <button
          style={{
            ...ASSASSIN_STYLES.button,
            ...ASSASSIN_STYLES.mercyButton,
          }}
          onClick={onIgnore}
        >
          🕊️ LET THEM WALK AWAY
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
          <div
            style={{
              ...ASSASSIN_STYLES.content,
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
            }}
          >
            ⚔️
          </div>
          <div style={ASSASSIN_STYLES.header}>
            <h3 style={ASSASSIN_STYLES.title}>{title}</h3>
          </div>
          <div style={ASSASSIN_STYLES.body}>
            <p style={ASSASSIN_STYLES.message}>{message}</p>
          </div>
          {buttons}
        </div>
      </div>
    </>
  );
}
