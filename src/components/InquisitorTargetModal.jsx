import React, { useState } from "react";

// Inquisitor Modal Styling Constants
const INQUISITOR_STYLES = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "inquisitorFadeIn 0.4s ease-out",
  },

  content: {
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    border: "3px solid #ffd700",
    borderRadius: "15px",
    padding: "2rem",
    minWidth: "500px",
    maxWidth: "600px",
    color: "#e8e6e3",
    fontFamily: "Cinzel, serif",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.3)",
    position: "relative",
    animation: "inquisitorSlideIn 0.5s ease-out",
  },

  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffd700",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    marginBottom: "1.5rem",
    borderBottom: "2px solid #ffd700",
    paddingBottom: "0.5rem",
  },

  description: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    textAlign: "center",
    color: "#d4d4d4",
    marginBottom: "1.5rem",
    fontStyle: "italic",
  },

  noTargetMessage: {
    fontSize: "1.2rem",
    textAlign: "center",
    color: "#ffd700",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "rgba(255, 215, 0, 0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },

  dropdownSection: {
    marginBottom: "1.5rem",
  },

  dropdownLabel: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: "0.5rem",
    display: "block",
  },

  select: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1.1rem",
    backgroundColor: "#2a2a3e",
    color: "#e8e6e3",
    border: "2px solid #ffd700",
    borderRadius: "8px",
    fontFamily: "Cinzel, serif",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.3s ease",
  },

  selectFocus: {
    borderColor: "#fff",
    boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
  },

  buttonsContainer: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
  },

  button: {
    padding: "0.8rem 1.5rem",
    flex: 1,
    fontSize: "1.2rem",
    border: "2px solid",
    borderRadius: "8px",
    fontFamily: "Cinzel, serif",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    outline: "none",
  },

  confirmButton: {
    background: "linear-gradient(135deg, #8b0000 0%, #dc143c 100%)",
    color: "#ffd700",
    borderColor: "#ffd700",
    boxShadow: "0 4px 12px rgba(139, 0, 0, 0.4)",
  },

  confirmButtonHover: {
    background: "linear-gradient(135deg, #dc143c 0%, #ff4500 100%)",
    color: "#fff",
    borderColor: "#fff",
    boxShadow: "0 6px 18px rgba(220, 20, 60, 0.6)",
    transform: "translateY(-2px)",
  },

  confirmButtonDisabled: {
    background: "linear-gradient(135deg, #4a4a4a 0%, #666666 100%)",
    color: "#999999",
    borderColor: "#666666",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },

  backButton: {
    background: "linear-gradient(135deg, #4a4a5e 0%, #2a2a3e 100%)",
    color: "#d4d4d4",
    borderColor: "#6a6a7e",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  },

  backButtonHover: {
    background: "linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)",
    color: "#ffd700",
    borderColor: "#ffd700",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
    transform: "translateY(-1px)",
  },
};

export default function InquisitorTargetModal({
  players,
  currentPlayer,
  protectedPlayers = [],
  onConfirm,
  onCancel,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [guess, setGuess] = useState(2); // Default to 2
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  const validTargets = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer && !p.isOut && !protectedPlayers.includes(name)
  );

  const hasNoTargets = validTargets.length === 0;

  // Inquisitor can guess strengths: [0, 2, 3, 4, 5, 6, 7, 8]
  const allowedStrengths = [0, 2, 3, 4, 5, 6, 7, 8];

  console.log(
    "🕵️ InquisitorTargetModal opened! validTargets:",
    validTargets.length,
    "protectedPlayers:",
    protectedPlayers
  );

  return (
    <>
      <style>
        {`
          @keyframes inquisitorFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(5px);
            }
          }
          
          @keyframes inquisitorSlideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <div style={INQUISITOR_STYLES.modal}>
        <div style={INQUISITOR_STYLES.content}>
          <div style={INQUISITOR_STYLES.title}>🕵️‍♀️ THE ROYAL INQUISITOR 🔍</div>

          <div style={INQUISITOR_STYLES.description}>
            Your Inquisitor seeks heretical allies at the royal court. Choose a
            target and the strength of the suspect you seek...
          </div>

          {hasNoTargets && (
            <div style={INQUISITOR_STYLES.noTargetMessage}>
              🫖 All other players are enjoying tea with the Princess' Handmaid
              and cannot be investigated.
            </div>
          )}

          {!hasNoTargets && (
            <>
              <div style={INQUISITOR_STYLES.dropdownSection}>
                <label style={INQUISITOR_STYLES.dropdownLabel}>
                  🎯 Select Investigation Target
                </label>
                <select
                  style={INQUISITOR_STYLES.select}
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      INQUISITOR_STYLES.selectFocus.borderColor;
                    e.target.style.boxShadow =
                      INQUISITOR_STYLES.selectFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      INQUISITOR_STYLES.select.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">⚖️ Choose a suspect...</option>
                  {validTargets.map(([name, p]) => (
                    <option key={name} value={name}>
                      👤 {p.name || name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={INQUISITOR_STYLES.dropdownSection}>
                <label style={INQUISITOR_STYLES.dropdownLabel}>
                  ⚔️ Guess Ally Strength
                </label>
                <select
                  style={INQUISITOR_STYLES.select}
                  value={guess}
                  onChange={(e) => setGuess(Number(e.target.value))}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      INQUISITOR_STYLES.selectFocus.borderColor;
                    e.target.style.boxShadow =
                      INQUISITOR_STYLES.selectFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      INQUISITOR_STYLES.select.borderColor;
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {allowedStrengths.map((str) => (
                    <option key={str} value={str}>
                      💪 Strength {str}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div style={INQUISITOR_STYLES.buttonsContainer}>
            {hasNoTargets ? (
              <button
                onClick={() => onConfirm({ target: "SKIP_TURN", guess: 0 })}
                style={{
                  ...INQUISITOR_STYLES.button,
                  ...INQUISITOR_STYLES.confirmButton,
                  width: "100%",
                }}
              >
                ⏭️ Skip Turn
              </button>
            ) : (
              <>
                <button
                  onClick={() => onConfirm({ target: selectedTarget, guess })}
                  disabled={!selectedTarget}
                  onMouseEnter={() => setIsConfirmHovered(true)}
                  onMouseLeave={() => setIsConfirmHovered(false)}
                  style={{
                    ...INQUISITOR_STYLES.button,
                    ...(selectedTarget
                      ? isConfirmHovered
                        ? {
                            ...INQUISITOR_STYLES.confirmButton,
                            ...INQUISITOR_STYLES.confirmButtonHover,
                          }
                        : INQUISITOR_STYLES.confirmButton
                      : INQUISITOR_STYLES.confirmButtonDisabled),
                  }}
                >
                  🔍 Investigate
                </button>

                <button
                  onClick={onCancel}
                  onMouseEnter={() => setIsBackHovered(true)}
                  onMouseLeave={() => setIsBackHovered(false)}
                  style={{
                    ...INQUISITOR_STYLES.button,
                    ...(isBackHovered
                      ? {
                          ...INQUISITOR_STYLES.backButton,
                          ...INQUISITOR_STYLES.backButtonHover,
                        }
                      : INQUISITOR_STYLES.backButton),
                  }}
                >
                  ↩️ Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
