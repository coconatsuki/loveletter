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

  // Regent Queen Modal Overlay - creates dark court effect
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(18, 18, 18, 0.88)",
    backdropFilter: "blur(12px) brightness(0.4)",
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
      "linear-gradient(135deg, rgb(13 0 30) 0%, rgb(26 9 71) 20%, rgb(70 25 137) 50%, rgb(58 36 100) 70%, rgb(128 29 245) 90%, rgb(21 6 44) 100%)",
    border: "4px solid #d4af37",
    borderRadius: "20px",
    padding: "30px",
    width: "85%",
    maxWidth: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(212, 175, 55, 0.6), inset 0 2px 0 rgba(212, 175, 55, 0.4), inset 0 -2px 0 rgba(15, 15, 15, 0.8)",
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
    border: "2px solid rgba(212, 175, 55, 0.4)",
    borderRadius: "15px",
    pointerEvents: "none",
    boxShadow: "inset 0 0 20px rgba(46, 93, 71, 0.3)",
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
    color: "#f4f1e8",
    textShadow:
      "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "2px",
    background: "linear-gradient(45deg, #d4af37, #f4f1e8, #e6c575)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundSize: "200% 200%",
    animation: "goldShimmer 3s ease-in-out infinite",
  },

  // Combat Arena - The Mirror Reflection Section
  combatArena: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arena: {
    marginTop: "2rem",
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
    color: "#f4f1e8",
    marginBottom: "15px",
    textShadow:
      "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(212, 175, 55, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  // The Court Comparison Cards
  duelCard: {
    background:
      "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 30%, #2e5d47 70%, #0f0f0f 100%)",
    border: "3px solid #d4af37",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 auto",
    position: "relative",
    transform: "perspective(1000px) rotateY(0deg)",
    transition: "all 0.4s ease",
    boxShadow:
      "0 10px 25px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(212, 175, 55, 0.4), inset 0 2px 0 rgba(212, 175, 55, 0.3)",
  },

  cardName: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#f4f1e8",
    marginBottom: "8px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },

  cardStrength: {
    fontSize: "1.1rem",
    color: "#e6c575",
    marginLeft: "0.6rem",
    fontWeight: 600,
  },

  cardEffect: {
    fontSize: "0.9rem",
    color: "#c0c0c0",
    fontStyle: "italic",
    lineHeight: "1.3",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
  },

  // VS Section - The Queen's Judgment
  vsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 30px",
    position: "relative",
  },

  regentGaze: {
    fontSize: "3rem",
    margin: "10px 0",
    animation: "regentPulse 3s ease-in-out infinite",
    filter: "drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))",
  },

  // Result Section - Victory or Defeat by the Queen's Will
  resultSection: {
    textAlign: "center",
    marginTop: "2.5rem",
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
    filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.7))",
  },

  resultTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "8px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    color: "#d4af37",
  },

  resultSubtitle: {
    fontSize: "1rem",
    opacity: 0.9,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
    color: "#e6c575",
  },

  // Message Section
  messageSection: {
    background: "rgba(15, 15, 15, 0.7)",
    borderRadius: "12px",
    padding: "0.7rem 1rem",
    margin: "20px 0",
    border: "1px solid rgb(212, 175, 55)",
    boxShadow: "inset 0 0 10px rgba(46, 93, 71, 0.3)",
  },

  messageText: {
    fontSize: "1.1rem",
    fontFamily: "Lora, serif",
    color: "#c0c0c0",
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
      "linear-gradient(135deg, #2e5d47 0%, #3e7b56 50%, #2e5d47 100%)",
    border: "3px solid #d4af37",
    borderRadius: "8px",
    color: "#f4f1e8",
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
      "0 6px 20px rgba(0, 0, 0, 0.7), 0 3px 8px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.3)",
  },

  continueButtonHover: {
    background:
      "linear-gradient(135deg, #3e7b56 0%, #4e9b66 50%, #3e7b56 100%)",
    borderColor: "#e6c575",
    color: "#ffffff",
    transform: "translateY(-2px)",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(230, 197, 117, 0.4)",
  },

  continueButtonActive: {
    transform: "translateY(0)",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.7), 0 2px 6px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.3)",
  },

  waitingText: {
    fontSize: "1.1rem",
    color: "#e6c575",
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

  @keyframes goldShimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes regentPulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.8));
    }
    50% {
      transform: scale(1.2);
      filter: drop-shadow(0 0 25px rgba(212, 175, 55, 1)) drop-shadow(0 0 35px rgba(46, 93, 71, 0.6));
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

  // Helper function to get loser-specific dimmed styles
  const getLoserStyles = (playerName) => {
    const isLoser = eliminatedPlayer === playerName && !isTie;

    return {
      knightName: {
        ...styles.knightName,
        color: isLoser ? "#8B8B8B" : styles.knightName.color, // Dimmed gray for loser
        opacity: isLoser ? 0.7 : 1,
      },
      duelCard: {
        ...styles.duelCard,
        border: isLoser ? "3px solid #666666" : styles.duelCard.border, // Dimmed border for loser
        opacity: isLoser ? 0.8 : 1,
      },
      cardName: {
        ...styles.cardName,
        color: isLoser ? "#A0A0A0" : styles.cardName.color, // Dimmed text for loser
      },
      cardStrength: {
        ...styles.cardStrength,
        color: isLoser ? "#888888" : styles.cardStrength.color, // Dimmed strength for loser
      },
      cardEffect: {
        ...styles.cardEffect,
        color: isLoser ? "#777777" : styles.cardEffect.color, // Dimmed effect for loser
      },
    };
  };

  // Helper function to get narrative text based on scenario
  const getNarrativeText = () => {
    if (isTie) {
      return "The Regent Queen watches both suitors with calculating eyes. 'Equally matched,' she muses. 'How... interesting. You both may remain... for now.'";
    }

    const attackerWon = eliminatedPlayer === targetName;
    const currentPlayerIsAttacker = userRole === "attacker";
    const currentPlayerWon =
      (currentPlayerIsAttacker && attackerWon) ||
      (!currentPlayerIsAttacker && !attackerWon);

    if (currentPlayerWon) {
      // This player won
      if (currentPlayerIsAttacker) {
        // Attacker won - target was eliminated
        return `${
          targetName === nickname ? "You were" : targetName + " was"
        } far too bold, too dangerous to the Regent Queen's taste. Her guards remove ${
          targetName === nickname ? "you" : "them"
        } from court, clearing your path to the Princess.`;
      } else {
        // Target won - attacker was eliminated
        return "The Regent Queen studies you, expecting arrogance, but finds only humility. 'Hmm,' she sighs. 'You may stay. At least you know your place.'";
      }
    } else {
      // This player lost
      if (currentPlayerIsAttacker) {
        // Attacker lost
        return `The Regent Queen's eyes narrow. Her attempt to strike down a perceived threat only exposes her folly — ${targetName} proves to be more dangerous than anticipated. The Queen's judgment has backfired.`;
      } else {
        // Target lost
        return "The Regent Queen's gaze lingers on you — too sharp, too knowing. 'Such confidence,' she says. 'It reminds me of my late husband. One was enough.' Her guards step forward before you can answer.";
      }
    }
  };

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
              <h2 style={styles.title}>🪞 The Regent Queen's Judgment 🐍</h2>
            </div>

            {/* Combat Arena - Where the reflection magic happens */}
            <div style={styles.arena}>
              <div style={styles.combatArena}>
                {/* Attacker Knight */}
                <div style={styles.knight}>
                  <div style={getLoserStyles(attackerName).knightName}>
                    {attackerName}
                  </div>
                  <div style={getLoserStyles(attackerName).duelCard}>
                    <div style={getLoserStyles(attackerName).cardName}>
                      {attackerCard.name}
                      <span style={getLoserStyles(attackerName).cardStrength}>
                        (Strength: {attackerCard.strength})
                      </span>
                    </div>

                    {attackerCard.effect && (
                      <div style={getLoserStyles(attackerName).cardEffect}>
                        {attackerCard.effect}
                      </div>
                    )}
                  </div>
                </div>

                {/* VS Section with Queen's Gaze */}
                <div style={styles.vsSection}>
                  <div style={styles.regentGaze}>🪞</div>
                </div>

                {/* Target Knight */}
                <div style={styles.knight}>
                  <div style={getLoserStyles(targetName).knightName}>
                    {targetName}
                  </div>
                  <div style={getLoserStyles(targetName).duelCard}>
                    <div style={getLoserStyles(targetName).cardName}>
                      {targetCard.name}
                      <span style={getLoserStyles(targetName).cardStrength}>
                        (Strength: {targetCard.strength})
                      </span>
                    </div>
                    {targetCard.effect && (
                      <div style={getLoserStyles(targetName).cardEffect}>
                        {targetCard.effect}
                      </div>
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
                    <div style={{ ...styles.resultTitle, color: "#e6c575" }}>
                      The Queen's Indecision
                    </div>
                    <div style={{ ...styles.resultSubtitle, color: "#c0c0c0" }}>
                      Both suitors prove equally... manageable
                    </div>
                  </div>
                  <span style={styles.resultIcon}>⚖️</span>
                </>
              ) : (
                <>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "👎" : "👑"}
                  </span>
                  <div style={styles.resultMessage}>
                    <div
                      style={{
                        ...styles.resultTitle,
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
                      }}
                    >
                      {eliminatedPlayer === nickname
                        ? "You have"
                        : eliminatedPlayer + " has"}{" "}
                      fallen from the Queen's grace
                    </div>
                  </div>
                  <span style={styles.resultIcon}>
                    {wasEliminated ? "👎" : "👑"}
                  </span>
                </>
              )}
            </div>

            {/* Message Section */}
            <div style={styles.messageSection}>
              <p style={styles.messageText}>{getNarrativeText()}</p>
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
