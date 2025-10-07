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
    padding: "30px",
    width: "85%",
    maxWidth: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 215, 0, 0.3), inset 0 -2px 0 rgba(139, 0, 0, 0.8)",
    animation: "baronModalSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    fontFamily: '"Cinzel", serif',
  },

  // Additional styles will be added below...
};

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
    <div className="baron-modal-background">
      <div className="baron-modal-overlay">
        <div className="baron-modal-content">
          {/* Modal Header */}
          <div className="baron-modal-header">
            <h2 className="baron-modal-title">⚔️ Baron's Duel ⚔️</h2>
          </div>

          {/* Combat Arena - The Duel */}
          <div className="baron-arena">
            <div className="baron-combat-arena">
              {/* Attacker Knight */}
              <div
                className={`baron-knight ${
                  eliminatedPlayer === attackerName
                    ? "baron-knight-loser"
                    : eliminatedPlayer === targetName
                    ? "baron-knight-winner"
                    : ""
                }`}
              >
                <div
                  className={`baron-knight-name ${
                    eliminatedPlayer === attackerName
                      ? "baron-name-loser"
                      : eliminatedPlayer === targetName
                      ? "baron-name-winner"
                      : ""
                  }`}
                >
                  🏰 {attackerName}
                </div>
                <div
                  className={`baron-duel-card ${
                    eliminatedPlayer === attackerName
                      ? "baron-card-loser"
                      : eliminatedPlayer === targetName
                      ? "baron-card-winner"
                      : ""
                  }`}
                >
                  <div className="baron-card-name">{attackerCard.name}</div>
                  <div className="baron-card-strength">
                    Strength: {attackerCard.strength}
                  </div>
                  {attackerCard.effect && (
                    <div className="baron-card-effect">
                      "{attackerCard.effect}"
                    </div>
                  )}
                </div>
              </div>

              {/* VS Section - Combat Clash */}
              <div className="baron-vs-section">
                <div className="baron-crossed-swords">⚔️</div>
              </div>

              {/* Target Knight */}
              <div
                className={`baron-knight ${
                  eliminatedPlayer === targetName
                    ? "baron-knight-loser"
                    : eliminatedPlayer === attackerName
                    ? "baron-knight-winner"
                    : ""
                }`}
              >
                <div
                  className={`baron-knight-name ${
                    eliminatedPlayer === targetName
                      ? "baron-name-loser"
                      : eliminatedPlayer === attackerName
                      ? "baron-name-winner"
                      : ""
                  }`}
                >
                  🏰 {targetName}
                </div>
                <div
                  className={`baron-duel-card ${
                    eliminatedPlayer === targetName
                      ? "baron-card-loser"
                      : eliminatedPlayer === attackerName
                      ? "baron-card-winner"
                      : ""
                  }`}
                >
                  <div className="baron-card-name">{targetCard.name}</div>
                  <div className="baron-card-strength">
                    Strength: {targetCard.strength}
                  </div>
                  {targetCard.effect && (
                    <div className="baron-card-effect">
                      "{targetCard.effect}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Result Section - Victory or Defeat */}
            <div
              className={`baron-result-section ${
                isTie
                  ? "baron-result-tie"
                  : wasEliminated
                  ? "baron-result-defeat"
                  : "baron-result-victory"
              }`}
            >
              {isTie ? (
                <>
                  <span className="baron-result-icon">🤝</span>
                  <div className="baron-result-message">
                    <div
                      className="baron-result-title"
                      style={{ color: "#87ceeb" }}
                    >
                      Honorable Draw!
                    </div>
                    <div
                      className="baron-result-subtitle"
                      style={{ color: "#b0c4de" }}
                    >
                      Both knights live to fight another day
                    </div>
                  </div>
                  <span className="baron-result-icon">🤝</span>
                </>
              ) : (
                <>
                  <span className="baron-result-icon">
                    {wasEliminated ? "💀" : "🏆"}
                  </span>
                  <div className="baron-result-message">
                    <div
                      className="baron-result-title"
                      style={{
                        color: wasEliminated ? "#ff6b6b" : "#90ee90",
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
                      className="baron-result-subtitle"
                      style={{
                        color: wasEliminated ? "#ffcccb" : "#b8ffb8",
                      }}
                    >
                      {eliminatedPlayer === nickname
                        ? "You are"
                        : eliminatedPlayer + " is"}{" "}
                      eliminated from the round
                    </div>
                  </div>
                  <span className="baron-result-icon">
                    {wasEliminated ? "💀" : "🏆"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="baron-action-section">
            {/* Only show confirm button to attacker (to control game flow) */}
            {userRole === "attacker" && (
              <button onClick={onConfirm} className="baron-continue-button">
                Continue
              </button>
            )}
            {userRole === "target" && (
              <div className="baron-waiting-text">
                ⏳ Awaiting {attackerName}'s command to continue...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaronResultModal;
