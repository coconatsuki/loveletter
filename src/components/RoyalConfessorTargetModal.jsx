import React, { useState, useEffect } from "react";

// Confessor Modal Styling Constants
const CONFESSOR_STYLES = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    background: "inherit",
    borderRadius: "15px",
    color: "#e8e6e3",
    fontFamily: "Cinzel, serif",
    animation: "confessorSlideIn 0.5s ease-out",
  },

  noTargetMessage: {
    lineHeight: "1.6em",
    textAlign: "justify",
    color: "rgb(197 201 220)",
    fontSize: "1.1rem",
    fontFamily: "Lora, serif",
    fontStyle: "italic",
    margin: "0.7rem 0 0",
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
    margin: "1rem 0",
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

export default function RoyalConfessorInquisitorTargetModal({
  players,
  currentPlayer,
  protectedPlayers = [],
  nextTarget = null, // 🗣️ Court Whisperer forcing target
  onConfirm,
  onCancel,
}) {
  const [selectedTarget1, setSelectedTarget1] = useState("");
  const [selectedTarget2, setSelectedTarget2] = useState("");

  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  // 🗣️ Court Whisperer: Check if targeting is forced
  const isTargetingForced = nextTarget && nextTarget.used === true;
  const forcedTargetNickname = isTargetingForced ? nextTarget.nickname : null;

  const validTargets1 = Object.entries(players).filter(
    ([name, p]) => !p.isOut && !protectedPlayers.includes(name)
  );

  // The second target selector can NOT include the currentPlayer
  const validTargets2 = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer && !p.isOut && !protectedPlayers.includes(name)
  );

  // 🗣️ Court Whisperer: Filter targets based on gossip
  // If targeting is forced, only show the forced target on the FIRST target selector (not on the second)
  const finalValidTargets1 = isTargetingForced
    ? validTargets1.filter(([name, p]) => name === forcedTargetNickname)
    : validTargets1;

  const hasNoTargets1 = finalValidTargets1.length === 0;
  const hasNoTargets2 = validTargets2.length === 0;
  const hasLessThan2validTargets =
    [...validTargets1, ...validTargets2].length < 2;

  const missingTarget2 =
    selectedTarget1 !== "SKIP_TURN" &&
    (!selectedTarget2 || selectedTarget2 === "");
  const sameTarget =
    selectedTarget1 !== "" && selectedTarget1 === selectedTarget2;

  const isConfirmDisabled =
    !selectedTarget1 || selectedTarget1 === "" || missingTarget2 || sameTarget;

  // Log only once when component mounts or targets change
  useEffect(() => {
    console.log(
      "🕵️ InquisitorTargetModal opened! validTargets1:",
      validTargets1.length,
      "validTargets2:",
      validTargets2.length,
      "protectedPlayers:",
      protectedPlayers
    );
  }, [validTargets1.length, validTargets2.length, protectedPlayers.length]);

  return (
    <>
      <style>
        {`
          @keyframes confessorFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(5px);
            }
          }
          
          @keyframes confessorSlideIn {
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

      <div style={CONFESSOR_STYLES.content}>
        <div style={CONFESSOR_STYLES.dropdownContainer}>
          <div style={CONFESSOR_STYLES.dropdownSection}>
            <label style={CONFESSOR_STYLES.dropdownLabel}>
              Who should confess their sins?
            </label>

            <select
              style={{
                ...CONFESSOR_STYLES.select,
              }}
              value={selectedTarget1}
              onChange={(e) => setSelectedTarget1(e.target.value)}
              onFocus={(e) => {
                if (!(isTargetingForced && !hasNoTargets1)) {
                  e.target.style.borderColor =
                    CONFESSOR_STYLES.selectFocus.borderColor;
                  e.target.style.boxShadow =
                    CONFESSOR_STYLES.selectFocus.boxShadow;
                }
              }}
              onBlur={(e) => {
                if (!(isTargetingForced && !hasNoTargets1)) {
                  e.target.style.borderColor =
                    CONFESSOR_STYLES.select.borderColor;
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              <option value="">🧎🏼‍➡️Choose a sinner...</option>
              {!hasNoTargets1 &&
                !hasLessThan2validTargets &&
                finalValidTargets1.map(([name, p]) => (
                  <option key={name} value={name}>
                    {name === currentPlayer
                      ? "🙏🏼 YOURSELF"
                      : `🙏🏼 ${p.name} (${p.realName})`}{" "}
                    {isTargetingForced ? "🎯" : ""}
                  </option>
                ))}
              {(hasNoTargets1 || hasLessThan2validTargets) && (
                <option value="SKIP_TURN">
                  ⏭️ Skip turn (no available targets)
                </option>
              )}
            </select>
          </div>

          {/* 🗣️ Court Whisperer: Show gossip message when targeting is forced */}
          {isTargetingForced && !hasNoTargets1 && !hasLessThan2validTargets && (
            <p style={CONFESSOR_STYLES.noTargetMessage}>
              💅✨ The whole court can only talk about one name lately…
            </p>
          )}

          {hasLessThan2validTargets && !isTargetingForced && (
            <div style={CONFESSOR_STYLES.noTargetMessage}>
              🫖 All other players are enjoying tea with the Princess' Handmaid
              and cannot confess right now.
            </div>
          )}

          {!hasNoTargets2 && (
            <div style={CONFESSOR_STYLES.dropdownSection}>
              <label style={CONFESSOR_STYLES.dropdownLabel}>To whom?</label>
              <select
                style={{
                  ...CONFESSOR_STYLES.select,
                  marginBottom: "1.5rem",
                }}
                value={selectedTarget2}
                onChange={(e) => setSelectedTarget2(e.target.value)}
                onFocus={(e) => {
                  if (!(isTargetingForced && !hasNoTargets2)) {
                    e.target.style.borderColor =
                      CONFESSOR_STYLES.selectFocus.borderColor;
                    e.target.style.boxShadow =
                      CONFESSOR_STYLES.selectFocus.boxShadow;
                  }
                }}
                onBlur={(e) => {
                  if (!(isTargetingForced && !hasNoTargets2)) {
                    e.target.style.borderColor =
                      CONFESSOR_STYLES.select.borderColor;
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                <option value="">🧎🏼Choose a second sinner...</option>
                {validTargets2.map(([name, p]) => (
                  <option key={name} value={name}>
                    🙏🏼 {p.name || name} {isTargetingForced ? "🎯" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!hasLessThan2validTargets && sameTarget && (
            <div style={CONFESSOR_STYLES.noTargetMessage}>
              You need 2 different sinners!{" "}
              <span
                style={{
                  fontStyle: "normal",
                  fontSize: "1.3rem",
                  margin: "0rem 0px 1rem",
                }}
              >
                🧎🏼‍➡️🧎🏼
              </span>
            </div>
          )}
        </div>

        <div style={CONFESSOR_STYLES.buttonsContainer}>
          <button
            onClick={onCancel}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              ...CONFESSOR_STYLES.button,
              ...(isBackHovered
                ? {
                    ...CONFESSOR_STYLES.backButton,
                    ...CONFESSOR_STYLES.backButtonHover,
                  }
                : CONFESSOR_STYLES.backButton),
            }}
          >
            ↩️ Back
          </button>
          <button
            onClick={() =>
              onConfirm({
                target: selectedTarget1,
                target2: selectedTarget2,
              })
            }
            disabled={isConfirmDisabled}
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              ...CONFESSOR_STYLES.button,
              ...(!isConfirmDisabled
                ? isConfirmHovered
                  ? {
                      ...CONFESSOR_STYLES.confirmButton,
                      ...CONFESSOR_STYLES.confirmButtonHover,
                    }
                  : CONFESSOR_STYLES.confirmButton
                : CONFESSOR_STYLES.confirmButtonDisabled),
            }}
          >
            {selectedTarget1 === "SKIP_TURN" ? "Skip Turn" : "Confess!"}
          </button>
        </div>
      </div>
    </>
  );
}
