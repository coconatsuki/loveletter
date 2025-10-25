import React, { useState, useEffect } from "react";

// Inquisitor Modal Styling Constants
const INQUISITOR_STYLES = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    background: "inherit",
    borderRadius: "15px",
    color: "#e8e6e3",
    fontFamily: "Cinzel, serif",
    animation: "inquisitorSlideIn 0.5s ease-out",
  },

  noTargetMessage: {
    color: "rgb(222 188 188)",
    textAlign: "justify",
    fontStyle: "italic",
    marginBottom: "2%",
    marginTop: 0,
    fontFamily: "Lora, serif",
    fontSize: "1.2rem",
    lineHeight: "1.6rem",
  },

  dropdownContainer: {
    display: "flex",
    flexDirection: "column",
  },

  dropdownSection: {
    // marginBottom: "1.5rem",
  },

  dropdownLabel: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: "0.8rem",
    display: "block",
    textAlign: "left",
  },

  select: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
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
    display: "flex",
    justifyContent: "space-between",
  },

  button: {
    width: "47%",
    padding: "0.7rem",
    fontSize: "1.1rem",
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
  nextTarget = null, // 🗣️ Court Whisperer forcing target
  isDeckEmpty = false, // is Deck Empty: can't target anyone.
  onConfirm,
  onCancel,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [guess, setGuess] = useState(2); // Default to 2
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  // 🗣️ Court Whisperer: Check if targeting is forced
  const isTargetingForced = nextTarget && nextTarget.used === true;
  const forcedTargetNickname = isTargetingForced ? nextTarget.nickname : null;

  const validTargets = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer && !p.isOut && !protectedPlayers.includes(name)
  );

  // 🗣️ Court Whisperer: Filter targets based on gossip
  const finalValidTargets = isTargetingForced
    ? validTargets.filter(([name, p]) => name === forcedTargetNickname)
    : isDeckEmpty
    ? []
    : validTargets;

  const hasNoTargets = finalValidTargets.length === 0 || isDeckEmpty;

  const isConfirmDisabled = !selectedTarget || selectedTarget === "";

  // Don't auto-select forced targets - let user see the modal and make the choice
  // This was causing issues in TargetModal and should be consistent here too

  // Inquisitor can guess strengths: [0, 2, 3, 4, 5, 6, 7, 8]
  const allowedStrengths = [0, 2, 3, 4, 5, 6, 7, 8];

  // Log only once when component mounts or targets change
  useEffect(() => {
    console.log(
      "🕵️ InquisitorTargetModal opened! validTargets:",
      validTargets.length,
      "protectedPlayers:",
      protectedPlayers
    );
  }, [validTargets.length, protectedPlayers.length]);

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
      <div style={INQUISITOR_STYLES.content}>
        <div
          style={{
            ...INQUISITOR_STYLES.dropdownContainer,
            ...(isTargetingForced && !hasNoTargets
              ? { gap: "0.5em" }
              : { gap: "2rem" }),
          }}
        >
          <div style={INQUISITOR_STYLES.dropdownSection}>
            <label style={INQUISITOR_STYLES.dropdownLabel}>
              🎯 Select Investigation Target
            </label>

            <select
              style={{
                ...INQUISITOR_STYLES.select,
              }}
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              onFocus={(e) => {
                if (!(isTargetingForced && !hasNoTargets)) {
                  e.target.style.borderColor =
                    INQUISITOR_STYLES.selectFocus.borderColor;
                  e.target.style.boxShadow =
                    INQUISITOR_STYLES.selectFocus.boxShadow;
                }
              }}
              onBlur={(e) => {
                if (!(isTargetingForced && !hasNoTargets)) {
                  e.target.style.borderColor =
                    INQUISITOR_STYLES.select.borderColor;
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              <option value="">⚖️ Choose a suspect...</option>
              {finalValidTargets.map(([name, p]) => (
                <option key={name} value={name}>
                  👤 {p.name || name} {isTargetingForced ? "🎯" : ""}
                </option>
              ))}
              {hasNoTargets && (
                <option value="SKIP_TURN">
                  ⏭️ Skip turn (no available targets)
                </option>
              )}
            </select>
          </div>

          {/* 🗣️ Court Whisperer: Show gossip message when targeting is forced */}
          {isTargetingForced && !hasNoTargets && (
            <p
              style={{
                fontSize: "1.1rem",
                margin: "8px 0",
                color: "rgb(245 170 242)",
                fontStyle: "italic",
                textAlign: "left",
                fontFamily: "Lora, serif",
                lineHeight: "1.4em",
              }}
            >
              💅✨ The whole court can only talk about one name lately…
            </p>
          )}

          {hasNoTargets && !isTargetingForced && !isDeckEmpty && (
            <div
              style={{
                ...INQUISITOR_STYLES.noTargetMessage,
                color: "rgb(238 163 224)",
              }}
            >
              🫖 All other players are enjoying tea with the Princess' Handmaid
              and cannot be investigated.
            </div>
          )}

          {isDeckEmpty && (
            <p style={INQUISITOR_STYLES.noTargetMessage}>
              Too late, Sir. The Deck is empty. You can't target anyone.
            </p>
          )}

          {/* Only show strength dropdown when there are targets */}
          {!hasNoTargets && (
            <div style={INQUISITOR_STYLES.dropdownSection}>
              <label style={INQUISITOR_STYLES.dropdownLabel}>
                ⚔️ Who are they ploting with?
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
          )}
        </div>

        <div style={INQUISITOR_STYLES.buttonsContainer}>
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
          <button
            onClick={() => onConfirm({ target: selectedTarget, guess })}
            disabled={isConfirmDisabled}
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              ...INQUISITOR_STYLES.button,
              ...(selectedTarget && selectedTarget !== ""
                ? isConfirmHovered
                  ? {
                      ...INQUISITOR_STYLES.confirmButton,
                      ...INQUISITOR_STYLES.confirmButtonHover,
                    }
                  : INQUISITOR_STYLES.confirmButton
                : INQUISITOR_STYLES.confirmButtonDisabled),
            }}
          >
            {selectedTarget === "SKIP_TURN" ? "Skip Turn" : "Investigate"}
          </button>
        </div>
      </div>
    </>
  );
}
