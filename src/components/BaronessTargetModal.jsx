import React, { useState, useEffect } from "react";

// Baroness Modal Styling Constants - Romantic Theme
const BARONESS_STYLES = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    color: "#ffe4e6",
    fontFamily: "Cinzel, serif",
    animation: "baronessSlideIn 0.5s ease-out",
  },

  noTargetMessage: {
    lineHeight: "1.6em",
    textAlign: "justify",
    color: "rgb(255 192 203)",
    fontSize: "1.1rem",
    fontFamily: "Lora, serif",
    fontStyle: "italic",
    margin: "0.7rem 0 0",
  },

  attentionMessage: {
    lineHeight: "1.6em",
    textAlign: "justify",
    color: "#ffb6c1",
    fontSize: "1.1rem",
    fontFamily: "Lora, serif",
    fontStyle: "italic",
    margin: "1rem 0",
    padding: "0.5rem",
  },

  dropdownContainer: {
    display: "flex",
    flexDirection: "column",
  },

  dropdownSection: {
    marginBottom: "1rem",
  },

  dropdownLabel: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "rgb(246, 151, 199)",
    margin: "1rem 0",
    display: "block",
    textAlign: "left",
  },

  select: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#2a1a1f",
    color: "#ffe4e6",
    border: "2px solid #ff69b4",
    borderRadius: "8px",
    fontFamily: "Cinzel, serif",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.3s ease",
  },

  selectFocus: {
    borderColor: "#ffb6c1",
    boxShadow: "0 0 10px rgba(255, 105, 180, 0.5)",
  },

  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },

  button: {
    padding: "0.5rem",
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
    background:
      "linear-gradient(135deg, rgb(104 22 64) 0%, rgb(221 123 173) 100%)",
    color: "#fff",
    borderColor: "#ff69b4",
    boxShadow: "0 4px 12px rgba(233, 30, 99, 0.4)",
  },

  confirmButtonHover: {
    background:
      "linear-gradient(135deg, rgb(221 123 173) 0%, rgb(104 22 64) 100%)",
    color: "#fff",
    borderColor: "#ffb6c1",
    boxShadow: "0 6px 18px rgba(233, 30, 99, 0.6)",
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
    background: "linear-gradient(135deg, #4a2c2a 0%, #2d1b1a 100%)",
    color: "#ffb6c1",
    borderColor: "#8d6e93",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  },

  backButtonHover: {
    background: "linear-gradient(135deg, #2d1b1a 0%, #1a0f0e 100%)",
    color: "#ff69b4",
    borderColor: "#ff69b4",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
    transform: "translateY(-1px)",
  },
};

export default function BaronessTargetModal({
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

  // Special case: Court Whisperer forces current player to be targeted
  const isForcedToSelf =
    isTargetingForced && forcedTargetNickname === currentPlayer;

  // Get all valid targets (excluding current player since Baroness can't target themselves)
  const validTargets = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer && !p.isOut && !protectedPlayers.includes(name)
  );

  // 🗣️ Court Whisperer: Filter targets based on gossip
  const finalValidTargets1 =
    isTargetingForced && !isForcedToSelf
      ? validTargets.filter(([name, p]) => name === forcedTargetNickname)
      : validTargets;

  // For second dropdown, exclude the first selected target
  const finalValidTargets2 = validTargets.filter(
    ([name, p]) => name !== selectedTarget1
  );

  const hasNoTargets = validTargets.length === 0;
  const hasOnlyOneTarget = validTargets.length === 1;

  // Show second dropdown only if:
  // - We have more than 1 target available
  // - AND we're not in the "forced to self" scenario
  const showSecondDropdown =
    !hasOnlyOneTarget && !hasNoTargets && !isForcedToSelf;

  const missingTarget2 =
    showSecondDropdown &&
    selectedTarget1 !== "SKIP_TURN" &&
    (!selectedTarget2 || selectedTarget2 === "");

  const sameTarget =
    selectedTarget1 !== "" && selectedTarget1 === selectedTarget2;

  const isConfirmDisabled =
    !selectedTarget1 || selectedTarget1 === "" || missingTarget2 || sameTarget;

  // Log only once when component mounts or targets change
  useEffect(() => {
    console.log(
      "💄 BaronessTargetModal opened! validTargets:",
      validTargets.length,
      "protectedPlayers:",
      protectedPlayers,
      "isTargetingForced:",
      isTargetingForced,
      "isForcedToSelf:",
      isForcedToSelf
    );
  }, [
    validTargets.length,
    protectedPlayers.length,
    isTargetingForced,
    isForcedToSelf,
  ]);

  return (
    <>
      <style>
        {`
          @keyframes baronessFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(5px);
            }
          }
          
          @keyframes baronessSlideIn {
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

      <div style={BARONESS_STYLES.content}>
        <div style={BARONESS_STYLES.dropdownContainer}>
          <div style={BARONESS_STYLES.dropdownSection}>
            <label style={BARONESS_STYLES.dropdownLabel}>
              💋 Whose secrets shall we uncover?
            </label>

            <select
              style={{
                ...BARONESS_STYLES.select,
              }}
              value={selectedTarget1}
              onChange={(e) => setSelectedTarget1(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor =
                  BARONESS_STYLES.selectFocus.borderColor;
                e.target.style.boxShadow =
                  BARONESS_STYLES.selectFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = BARONESS_STYLES.select.borderColor;
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">🌹 Choose a target...</option>
              {!hasNoTargets &&
                finalValidTargets1.map(([name, p]) => (
                  <option key={name} value={name}>
                    💕 {p.name} ({p.realName}){" "}
                    {isTargetingForced && !isForcedToSelf ? "🎯" : ""}
                  </option>
                ))}
              {hasNoTargets && (
                <option value="SKIP_TURN">
                  ⏭️ Skip turn (no available targets)
                </option>
              )}
            </select>
          </div>

          {/* 🗣️ Court Whisperer: Show attention message when forced to self */}
          {isForcedToSelf && (
            <div style={BARONESS_STYLES.attentionMessage}>
              💅✨ The cost of being the center of the Court's attention is that
              you can't ask much...
            </div>
          )}

          {/* 🗣️ Court Whisperer: Show gossip message when targeting someone else is forced */}
          {isTargetingForced && !isForcedToSelf && !hasNoTargets && (
            <p style={BARONESS_STYLES.noTargetMessage}>
              💅✨ The whole court can only talk about one name lately…
            </p>
          )}

          {hasNoTargets && (
            <div style={BARONESS_STYLES.noTargetMessage}>
              🫖 All other players are enjoying tea with the Princess' Handmaid
              and cannot be observed right now.
            </div>
          )}

          {showSecondDropdown && (
            <div
              style={{
                ...BARONESS_STYLES.dropdownSection,
                marginBottom: "0.7rem",
              }}
            >
              <label style={BARONESS_STYLES.dropdownLabel}>
                💐 And whose other secrets?
              </label>
              <select
                style={{
                  ...BARONESS_STYLES.select,
                }}
                value={selectedTarget2}
                onChange={(e) => setSelectedTarget2(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    BARONESS_STYLES.selectFocus.borderColor;
                  e.target.style.boxShadow =
                    BARONESS_STYLES.selectFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    BARONESS_STYLES.select.borderColor;
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">🌷 Choose a second romantic target...</option>
                {finalValidTargets2.map(([name, p]) => (
                  <option key={name} value={name}>
                    💕 {p.name} ({p.realName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {showSecondDropdown && sameTarget && (
            <div
              style={{
                ...BARONESS_STYLES.noTargetMessage,
                margin: "0rem 0px 1rem",
              }}
            >
              You need 2 different romantic targets!{" "}
              <span
                style={{
                  fontStyle: "normal",
                  fontSize: "1.3rem",
                }}
              >
                💕💕
              </span>
            </div>
          )}
        </div>

        <div style={BARONESS_STYLES.buttonsContainer}>
          <button
            onClick={onCancel}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              ...BARONESS_STYLES.button,
              ...(isBackHovered
                ? {
                    ...BARONESS_STYLES.backButton,
                    ...BARONESS_STYLES.backButtonHover,
                  }
                : BARONESS_STYLES.backButton),
              width: "35%",
            }}
          >
            ↩️ Back
          </button>
          <button
            onClick={() =>
              onConfirm({
                target: selectedTarget1,
                target2: selectedTarget2 || null,
              })
            }
            disabled={isConfirmDisabled}
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              ...BARONESS_STYLES.button,
              ...(!isConfirmDisabled
                ? isConfirmHovered
                  ? {
                      ...BARONESS_STYLES.confirmButton,
                      ...BARONESS_STYLES.confirmButtonHover,
                    }
                  : BARONESS_STYLES.confirmButton
                : BARONESS_STYLES.confirmButtonDisabled),
              width: "60%",
            }}
          >
            {selectedTarget1 === "SKIP_TURN"
              ? "Skip Turn"
              : "☕ Spill the Tea!"}
          </button>
        </div>
      </div>
    </>
  );
}
