import React from "react";

const BaronResultModal = ({
  isOpen,
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
              <div className="baron-knight">
                <div className="baron-knight-name">🏰 {attackerName}</div>
                <div className="baron-duel-card">
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
              <div className="baron-knight">
                <div className="baron-knight-name">🏰 {targetName}</div>
                <div className="baron-duel-card">
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
                        ? `${targetName} Wins!`
                        : `${attackerName} Wins!`}
                    </div>
                    <div
                      className="baron-result-subtitle"
                      style={{
                        color: wasEliminated ? "#ffcccb" : "#b8ffb8",
                      }}
                    >
                      {eliminatedPlayer} is eliminated from the round
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
