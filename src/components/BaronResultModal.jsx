import React from "react";

// ==========================================
// BARON DUEL MODAL STYLES - Royal Combat Styling
// ==========================================

const styles = {
  // Baron Modal Background - positioned relative to royal-game-area
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 950,
    pointerEvents: "none",
  },

  // Baron Modal Overlay - creates blur effect and centers the duel
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(12px) brightness(0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    pointerEvents: "auto",
    animation: "baronModalFadeIn 0.5s ease-out",
  },

  // The Baron Duel Arena
  content: {
    position: "relative",
    background:
      "linear-gradient(135deg, #1a0000 0%, #4a0000 30%, #8b0000 70%, #2d1b1b 100%)",
    border: "4px solid #ffd700",
    borderRadius: "20px",
    padding: "2.5rem",
    minWidth: "75%",
    maxWidth: "80%",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 215, 0, 0.3), inset 0 -2px 0 rgba(139, 0, 0, 0.8)",
    animation: "baronModalSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    fontFamily: '"Cinzel", serif',
  },

  // Ornate border pattern
  contentBefore: {
    content: '""',
    position: "absolute",
    top: "8px",
    left: "8px",
    right: "8px",
    bottom: "8px",
    border: "2px solid rgba(255, 215, 0, 0.4)",
    borderRadius: "15px",
    pointerEvents: "none",
    boxShadow: "inset 0 0 20px rgba(139, 0, 0, 0.3)",
  },

  // Modal Header
  header: {
    textAlign: "center",
    marginBottom: "25px",
    position: "relative",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow:
      "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "2px",
  },

  // Combat Arena
  arena: {
    margin: "3rem 0",
    padding: "0 1rem",
  },

  combatArena: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Knight sections
  knight: {
    textAlign: "center",
    position: "relative",
    width: "45%",
  },

  knightName: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: "15px",
    textShadow:
      "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  duelCard: {
    background:
      "linear-gradient(135deg, #1a0000 0%, #4a0000 50%, #8b0000 100%)",
    border: "3px solid #ffd700",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 auto",
    position: "relative",
    transition: "all 0.4s ease",
    boxShadow:
      "0 10px 25px rgba(26, 0, 0, 0.8), 0 4px 12px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 215, 0, 0.3)",
  },

  cardName: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: "8px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },

  cardStrength: {
    fontSize: "1.1rem",
    color: "#ffeb99",
    marginBottom: "10px",
    fontWeight: 600,
  },

  cardEffect: {
    fontSize: "0.9rem",
    color: "#ffffcc",
    fontStyle: "italic",
    lineHeight: 1.3,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
  },

  // VS Section
  vsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 30px",
    position: "relative",
  },

  crossedSwords: {
    fontSize: "3rem",
    margin: "10px 0",
    filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))",
    animation: "spearPulse 2s ease-in-out infinite",
  },

  // Result Section
  resultSection: {
    textAlign: "center",
    marginTop: "2rem",
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
    filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))",
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

  // Action Section
  actionSection: {
    textAlign: "center",
    marginTop: "25px",
  },

  continueButton: {
    background:
      "linear-gradient(135deg, #8b0000 0%, #ff4500 50%, #8b0000 100%)",
    border: "3px solid #ffd700",
    borderRadius: "8px",
    color: "#ffd700",
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
      "0 6px 20px rgba(26, 0, 0, 0.7), 0 3px 8px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
    width: "65%",
    marginTop: "1.5rem",
  },

  continueButtonHover: {
    background:
      "linear-gradient(135deg, #b30000 0%, #ff6500 50%, #b30000 100%)",
    borderColor: "#ffeb99",
    color: "#ffffff",
    transform: "translateY(-2px)",
    boxShadow:
      "0 8px 25px rgba(26, 0, 0, 0.8), 0 4px 12px rgba(255, 215, 0, 0.5), inset 0 1px 0 rgba(255, 235, 153, 0.4)",
  },

  continueButtonActive: {
    transform: "translateY(0)",
    boxShadow:
      "0 4px 15px rgba(26, 0, 0, 0.7), 0 2px 6px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
  },

  waitingText: {
    fontSize: "1.1rem",
    color: "#ffeb99",
    fontStyle: "italic",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
  },

  knightLoser: {
    opacity: 0.6,
    filter: "grayscale(50%)",
  },

  nameWinner: {
    color: "#98fb98",
    textShadow:
      "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(152, 251, 152, 0.7)",
  },

  nameLoser: {
    color: "#cd5c5c",
    textShadow:
      "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(205, 92, 92, 0.7)",
  },

  cardWinner: {
    border: "3px solid #98fb98",
    boxShadow:
      "0 10px 25px rgba(26, 0, 0, 0.8), 0 4px 12px rgba(152, 251, 152, 0.6), inset 0 2px 0 rgba(152, 251, 152, 0.4)",
  },

  cardLoser: {
    border: "3px solid #cd5c5c",
    boxShadow:
      "0 10px 25px rgba(26, 0, 0, 0.8), 0 4px 12px rgba(205, 92, 92, 0.6), inset 0 2px 0 rgba(205, 92, 92, 0.4)",
  },
};

// CSS Animations as a style tag
const animations = `
  @keyframes baronModalFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px) brightness(0.6);
    }
  }

  @keyframes baronModalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(-30px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes spearPulse {
    0%, 100% {
      transform: scale(0.9);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
  }
`;

const BaronResultModal = ({
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
              <h2 style={styles.title}>⚔️ Baron's Duel of Honor ⚔️</h2>
            </div>

            {/* Combat Arena - Where noble hearts clash */}
            <div style={styles.arena}>
              <div style={styles.combatArena}>
                {/* Attacker Knight */}
                <div
                  style={{
                    ...styles.knight,
                    ...(eliminatedPlayer === attackerName
                      ? styles.knightLoser
                      : eliminatedPlayer === targetName
                      ? styles.knightWinner
                      : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.knightName,
                      ...(eliminatedPlayer === attackerName
                        ? styles.nameLoser
                        : eliminatedPlayer === targetName
                        ? styles.nameWinner
                        : {}),
                    }}
                  >
                    🏰 {attackerName}
                  </div>
                  <div
                    style={{
                      ...styles.duelCard,
                      ...(eliminatedPlayer === attackerName
                        ? styles.cardLoser
                        : eliminatedPlayer === targetName
                        ? styles.cardWinner
                        : {}),
                    }}
                  >
                    <div style={styles.cardName}>{attackerCard.name}</div>
                    <div style={styles.cardStrength}>
                      Strength: {attackerCard.strength}
                    </div>
                    {attackerCard.effect && (
                      <div style={styles.cardEffect}>
                        "{attackerCard.effect}"
                      </div>
                    )}
                  </div>
                </div>

                {/* VS Section - Combat Clash */}
                <div style={styles.vsSection}>
                  <div style={styles.crossedSwords}>⚔️</div>
                </div>

                {/* Target Knight */}
                <div
                  style={{
                    ...styles.knight,
                    ...(eliminatedPlayer === targetName
                      ? styles.knightLoser
                      : eliminatedPlayer === attackerName
                      ? styles.knightWinner
                      : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.knightName,
                      ...(eliminatedPlayer === targetName
                        ? styles.nameLoser
                        : eliminatedPlayer === attackerName
                        ? styles.nameWinner
                        : {}),
                    }}
                  >
                    🏰 {targetName}
                  </div>
                  <div
                    style={{
                      ...styles.duelCard,
                      ...(eliminatedPlayer === targetName
                        ? styles.cardLoser
                        : eliminatedPlayer === attackerName
                        ? styles.cardWinner
                        : {}),
                    }}
                  >
                    <div style={styles.cardName}>{targetCard.name}</div>
                    <div style={styles.cardStrength}>
                      Strength: {targetCard.strength}
                    </div>
                    {targetCard.effect && (
                      <div style={styles.cardEffect}>"{targetCard.effect}"</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Result Section - Victory or Defeat */}
            <div style={styles.resultSection}>
              {isTie ? (
                <>
                  <span style={styles.resultIcon}>🤝</span>
                  <div style={styles.resultMessage}>
                    <div style={{ ...styles.resultTitle, color: "#87ceeb" }}>
                      Honorable Draw!
                    </div>
                    <div style={{ ...styles.resultSubtitle, color: "#b0c4de" }}>
                      Both warriors show equal valor
                    </div>
                  </div>
                  <span style={styles.resultIcon}>🤝</span>
                </>
              ) : (
                <>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "💀" : "🏆"}
                  </span>
                  <div style={styles.resultMessage}>
                    <div
                      style={{
                        ...styles.resultTitle,
                        color: wasEliminated ? "#ffcccb" : "#b8ffb8",
                      }}
                    >
                      {eliminatedPlayer === attackerName
                        ? `${targetName === nickname ? "YOU" : targetName} Win${
                            targetName === nickname ? "" : "s"
                          }!`
                        : `${
                            attackerName === nickname ? "YOU" : attackerName
                          } Win${attackerName === nickname ? "" : "s"}!`}
                    </div>
                    <div
                      style={{
                        ...styles.resultSubtitle,
                        color: wasEliminated ? "#ffcccb" : "#b8ffb8",
                      }}
                    >
                      {eliminatedPlayer === nickname
                        ? "You are"
                        : eliminatedPlayer + " is"}{" "}
                      eliminated from the round
                    </div>
                  </div>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "💀" : "🏆"}
                  </span>
                </>
              )}
            </div>

            {/* Action Section */}
            <div style={styles.actionSection}>
              {/* Only show confirm button to attacker (to control game flow) */}
              {userRole === "attacker" && (
                <button
                  onClick={onConfirm}
                  style={styles.continueButton}
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

export default BaronResultModal;
