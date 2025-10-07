import React from "react";

// ============================================
// REGENT QUEEN MODAL STYLES - Maleficent Theme
// ============================================

const styles = {
  // Background overlay
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 950,
    pointerEvents: "none",
  },

  // Regent Queen Modal Overlay - creates dark magical effect
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(46, 7, 63, 0.85)",
    backdropFilter: "blur(12px) brightness(0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    pointerEvents: "auto",
    animation: "regentQueenModalFadeIn 0.6s ease-out",
  },

  // The Regent Queen's Dark Court
  content: {
    position: "relative",
    background:
      "linear-gradient(135deg, #1a0d26 0%, #2e073f 30%, #4a148c 70%, #1a0d26 100%)",
    border: "4px solid #9b59b6",
    borderRadius: "20px",
    padding: "30px",
    width: "85%",
    maxWidth: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 60px rgba(123, 31, 162, 0.9), 0 8px 25px rgba(155, 89, 182, 0.6), inset 0 2px 0 rgba(155, 89, 182, 0.4), inset 0 -2px 0 rgba(46, 7, 63, 0.8)",
    animation:
      "regentQueenModalSlideIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    fontFamily: '"Cinzel", serif',
  },

  // Ornate mystical border pattern (::before pseudo-element)
  contentBefore: {
    content: '""',
    position: "absolute",
    top: "8px",
    left: "8px",
    right: "8px",
    bottom: "8px",
    border: "2px solid rgba(155, 89, 182, 0.4)",
    borderRadius: "15px",
    pointerEvents: "none",
    boxShadow: "inset 0 0 20px rgba(123, 31, 162, 0.3)",
  },

  // Modal Header - The Dark Mirror Title
  header: {
    textAlign: "center",
    marginBottom: "25px",
    position: "relative",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#d2b4de",
    textShadow:
      "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 20px rgba(155, 89, 182, 0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "2px",
    background: "linear-gradient(45deg, #9b59b6, #d2b4de, #bb8fce)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundSize: "200% 200%",
    animation: "purpleShimmer 3s ease-in-out infinite",
  },

  // Combat Arena - The Mirror Reflection Section
  combatArena: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arena: {
    margin: "25px 0",
    padding: "25px 20px 10px 20px",
    background: "rgba(46, 7, 63, 0.5)",
    borderRadius: "15px",
    border: "2px solid rgba(155, 89, 182, 0.3)",
    boxShadow: "inset 0 0 15px rgba(123, 31, 162, 0.4)",
  },

  // Knight Card Containers
  knight: {
    textAlign: "center",
    position: "relative",
    width: "45%",
  },

  knightName: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#d2b4de",
    marginBottom: "15px",
    textShadow:
      "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(155, 89, 182, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  // The Mirror Reflection Cards
  duelCard: {
    background:
      "linear-gradient(135deg, #1a0d26 0%, #2e073f 50%, #4a148c 100%)",
    border: "3px solid #9b59b6",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 auto",
    position: "relative",
    transform: "perspective(1000px) rotateY(0deg)",
    transition: "all 0.4s ease",
    boxShadow:
      "0 10px 25px rgba(46, 7, 63, 0.8), 0 4px 12px rgba(155, 89, 182, 0.4), inset 0 2px 0 rgba(155, 89, 182, 0.3)",
  },

  cardName: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#d2b4de",
    marginBottom: "8px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },

  cardStrength: {
    fontSize: "1.1rem",
    color: "#bb8fce",
    marginBottom: "10px",
    fontWeight: 600,
  },

  cardEffect: {
    fontSize: "0.9rem",
    color: "#d7bde2",
    fontStyle: "italic",
    lineHeight: 1.3,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
  },

  // VS Section - The Magic Mirror
  vsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 30px",
    position: "relative",
  },

  mirrorReflection: {
    fontSize: "3rem",
    margin: "10px 0",
    animation: "mirrorPulse 3s ease-in-out infinite",
    filter: "drop-shadow(0 0 15px rgba(155, 89, 182, 0.8))",
  },

  // Result Section - Victory or Defeat by the Mirror
  resultSection: {
    textAlign: "center",
    marginTop: "3%",
    padding: "20px",
    paddingBottom: "10px",
    borderRadius: "12px",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  resultMessage: {
    margin: "0 2%",
  },

  resultIcon: {
    fontSize: "3rem",
    display: "block",
    filter: "drop-shadow(0 0 10px rgba(155, 89, 182, 0.7))",
  },

  resultTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "8px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },

  resultSubtitle: {
    fontSize: "1rem",
    opacity: 0.9,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
  },

  // Message Section
  messageSection: {
    background: "rgba(46, 7, 63, 0.5)",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px 0",
    border: "2px solid rgba(155, 89, 182, 0.3)",
    boxShadow: "inset 0 0 10px rgba(123, 31, 162, 0.3)",
  },

  messageText: {
    fontSize: "1.1rem",
    color: "#d7bde2",
    fontStyle: "italic",
    lineHeight: 1.5,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    margin: 0,
  },

  // Action Buttons
  actionSection: {
    textAlign: "center",
    marginTop: "25px",
  },

  continueButton: {
    background:
      "linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #4a148c 100%)",
    border: "3px solid #9b59b6",
    borderRadius: "8px",
    color: "#d2b4de",
    fontFamily: '"Cinzel", serif',
    fontSize: "1.3rem",
    fontWeight: "bold",
    padding: "1.5% 8%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    boxShadow:
      "0 6px 20px rgba(46, 7, 63, 0.7), 0 3px 8px rgba(155, 89, 182, 0.4), inset 0 1px 0 rgba(155, 89, 182, 0.3)",
  },

  continueButtonHover: {
    background:
      "linear-gradient(135deg, #6a1b9a 0%, #9c27b0 50%, #6a1b9a 100%)",
    borderColor: "#bb8fce",
    color: "#f3e5f5",
    transform: "translateY(-2px)",
    boxShadow:
      "0 8px 25px rgba(46, 7, 63, 0.8), 0 4px 12px rgba(155, 89, 182, 0.5), inset 0 1px 0 rgba(187, 143, 206, 0.4)",
  },

  continueButtonActive: {
    transform: "translateY(0)",
    boxShadow:
      "0 4px 15px rgba(46, 7, 63, 0.7), 0 2px 6px rgba(155, 89, 182, 0.4), inset 0 1px 0 rgba(155, 89, 182, 0.3)",
  },

  waitingText: {
    fontSize: "1.1rem",
    color: "#bb8fce",
    fontStyle: "italic",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
  },
};

// CSS Animations as a style tag
const animations = `
  @keyframes regentQueenModalFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px) brightness(0.5);
    }
  }

  @keyframes regentQueenModalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.7) translateY(-50px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes purpleShimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes mirrorPulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 0 15px rgba(155, 89, 182, 0.8));
    }
    50% {
      transform: scale(1.2);
      filter: drop-shadow(0 0 25px rgba(155, 89, 182, 1)) drop-shadow(0 0 35px rgba(123, 31, 162, 0.6));
    }
  }
`;

const RegentQueenResultModal = ({
  isOpen,
  nickname,
  onConfirm,
  userRole, // "attacker" or "target"
  attackerName,
  targetName,
  attackerCard,
  targetCard,
  eliminatedPlayer,
  isTie,
}) => {
  if (!isOpen) return null;

  // Determine if this player was eliminated
  const currentPlayer = userRole === "attacker" ? attackerName : targetName;
  const wasEliminated = eliminatedPlayer === currentPlayer;

  return (
    <>
      {/* Inject animations */}
      <style>{animations}</style>

      <div style={styles.background}>
        <div style={styles.overlay}>
          <div style={styles.content}>
            {/* Ornate border effect */}
            <div style={styles.contentBefore}></div>

            {/* Modal Header */}
            <div style={styles.header}>
              <h2 style={styles.title}>🪞 Regent Queen's Mirror of Truth 🪞</h2>
            </div>

            {/* Combat Arena - Where the reflection magic happens */}
            <div style={styles.arena}>
              <div style={styles.combatArena}>
                {/* Attacker Knight */}
                <div style={styles.knight}>
                  <div style={styles.knightName}>👑 {attackerName}</div>
                  <div style={styles.duelCard}>
                    <div style={styles.cardName}>{attackerCard.name}</div>
                    <div style={styles.cardStrength}>
                      Strength: {attackerCard.strength}
                    </div>
                    {attackerCard.effect && (
                      <div style={styles.cardEffect}>{attackerCard.effect}</div>
                    )}
                  </div>
                </div>

                {/* VS Section with Mirror Icon */}
                <div style={styles.vsSection}>
                  <div style={styles.mirrorReflection}>🪞</div>
                </div>

                {/* Target Knight */}
                <div style={styles.knight}>
                  <div style={styles.knightName}>🏰 {targetName}</div>
                  <div style={styles.duelCard}>
                    <div style={styles.cardName}>{targetCard.name}</div>
                    <div style={styles.cardStrength}>
                      Strength: {targetCard.strength}
                    </div>
                    {targetCard.effect && (
                      <div style={styles.cardEffect}>{targetCard.effect}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div style={styles.resultSection}>
              {isTie ? (
                <>
                  <span style={styles.resultIcon}>⚖️</span>
                  <div style={styles.resultMessage}>
                    <div style={{ ...styles.resultTitle, color: "#C39BD3" }}>
                      Mirror Shows Equality
                    </div>
                    <div style={{ ...styles.resultSubtitle, color: "#D7BDE2" }}>
                      Both souls survive the dark reflection
                    </div>
                  </div>
                  <span style={styles.resultIcon}>⚖️</span>
                </>
              ) : (
                <>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "💀" : "👑"}
                  </span>
                  <div style={styles.resultMessage}>
                    <div
                      style={{
                        ...styles.resultTitle,
                        color: wasEliminated ? "#8E44AD" : "#9B59B6",
                      }}
                    >
                      {eliminatedPlayer === attackerName
                        ? `${
                            targetName === nickname ? "YOU" : targetName
                          } Survive${targetName === nickname ? "" : "s"}!`
                        : `${
                            attackerName === nickname ? "YOU" : attackerName
                          } Survive${attackerName === nickname ? "" : "s"}!`}
                    </div>
                    <div
                      style={{
                        ...styles.resultSubtitle,
                        color: wasEliminated ? "#BB8FCE" : "#D2B4DE",
                      }}
                    >
                      {eliminatedPlayer === nickname
                        ? "You are"
                        : eliminatedPlayer + " is"}{" "}
                      consumed by their own power
                    </div>
                  </div>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "💀" : "👑"}
                  </span>
                </>
              )}
            </div>

            {/* Message Section */}
            <div style={styles.messageSection}>
              <p style={styles.messageText}>
                {isTie
                  ? "The Regent Queen's enchanted mirror reveals that both nobles possess equal power. The magic reflects their parity, and neither shall fall this day."
                  : eliminatedPlayer
                  ? `The cursed mirror shows ${eliminatedPlayer}'s reflection cracking as their weaker power is consumed by the stronger force. The Regent Queen's dark magic has chosen its victim.`
                  : "The mirror's dark surface shimmers, revealing the true hierarchy of power in this twisted court."}
              </p>
            </div>

            {/* Action Section */}
            <div style={styles.actionSection}>
              {/* Only show confirm button to attacker (to control game flow) */}
              {userRole === "attacker" && (
                <button
                  style={styles.continueButton}
                  onClick={onConfirm}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, styles.continueButtonHover)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.continueButton)
                  }
                  onMouseDown={(e) =>
                    Object.assign(e.target.style, styles.continueButtonActive)
                  }
                  onMouseUp={(e) =>
                    Object.assign(e.target.style, styles.continueButtonHover)
                  }
                >
                  Continue
                </button>
              )}
              {userRole === "target" && (
                <div style={styles.waitingText}>
                  ⏳ Awaiting {attackerName}'s command to continue...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegentQueenResultModal;
