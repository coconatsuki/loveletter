import React from "react";

const RegentQueenResultModal = ({
  isOpen,
  onConfirm,
  userRole,
  attackerName,
  targetName,
  attackerCard,
  targetCard,
  eliminatedPlayer,
  isTie,
}) => {
  if (!isOpen) return null;

  // Determine if the current user won or lost
  const userIsEliminated =
    eliminatedPlayer === (userRole === "attacker" ? attackerName : targetName);

  return (
    <div className="regent-queen-modal-background">
      <div className="regent-queen-modal-overlay">
        <div className="regent-queen-modal-content">
          {/* Modal Header */}
          <div className="regent-queen-modal-header">
            <h2 className="regent-queen-modal-title">
              🪞 Regent Queen's Mirror of Truth 🪞
            </h2>
          </div>

          {/* Combat Arena - Where the reflection magic happens */}
          <div className="regent-queen-arena">
            <div className="regent-queen-combat-arena">
              {/* Attacker Knight */}
              <div className="regent-queen-knight">
                <div className="regent-queen-knight-name">
                  👑 {attackerName}
                </div>
                <div className="regent-queen-duel-card">
                  <div className="regent-queen-card-name">
                    {attackerCard.name}
                  </div>
                  <div className="regent-queen-card-strength">
                    Strength: {attackerCard.strength}
                  </div>
                  {attackerCard.effect && (
                    <div className="regent-queen-card-effect">
                      {attackerCard.effect}
                    </div>
                  )}
                </div>
              </div>

              {/* VS Section with Mirror Icon */}
              <div className="regent-queen-vs-section">
                <div className="regent-queen-mirror-reflection">🪞</div>
              </div>

              {/* Target Knight */}
              <div className="regent-queen-knight">
                <div className="regent-queen-knight-name">🏰 {targetName}</div>
                <div className="regent-queen-duel-card">
                  <div className="regent-queen-card-name">
                    {targetCard.name}
                  </div>
                  <div className="regent-queen-card-strength">
                    Strength: {targetCard.strength}
                  </div>
                  {targetCard.effect && (
                    <div className="regent-queen-card-effect">
                      {targetCard.effect}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="regent-queen-result-section">
            {isTie ? (
              <>
                <div className="regent-queen-result-icon">⚖️</div>
                <div>
                  <div
                    className="regent-queen-result-title"
                    style={{ color: "#C39BD3" }}
                  >
                    Mirror Shows Equality
                  </div>
                  <div
                    className="regent-queen-result-subtitle"
                    style={{ color: "#D7BDE2" }}
                  >
                    The reflection reveals equal power - both remain
                  </div>
                </div>
              </>
            ) : userIsEliminated ? (
              <>
                <div className="regent-queen-result-icon">💀</div>
                <div>
                  <div
                    className="regent-queen-result-title"
                    style={{ color: "#8E44AD" }}
                  >
                    The Mirror's Cruel Truth
                  </div>
                  <div
                    className="regent-queen-result-subtitle"
                    style={{ color: "#BB8FCE" }}
                  >
                    You have been vanquished by superior power
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="regent-queen-result-icon">👑</div>
                <div>
                  <div
                    className="regent-queen-result-title"
                    style={{ color: "#9B59B6" }}
                  >
                    Mirror Reveals Victory
                  </div>
                  <div
                    className="regent-queen-result-subtitle"
                    style={{ color: "#D2B4DE" }}
                  >
                    Your reflection shows greater strength
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Message Section */}
          <div className="regent-queen-message-section">
            <p className="regent-queen-message-text">
              {isTie
                ? "The Regent Queen's enchanted mirror reveals that both nobles possess equal power. The magic reflects their parity, and neither shall fall this day."
                : eliminatedPlayer
                ? `The cursed mirror shows ${eliminatedPlayer}'s reflection cracking as their weaker power is consumed by the stronger force. The Regent Queen's dark magic has chosen its victim.`
                : "The mirror's dark surface shimmers, revealing the true hierarchy of power in this twisted court."}
            </p>
          </div>

          {/* Action Section */}
          <div className="regent-queen-action-section">
            {userRole === "attacker" ? (
              <button
                className="regent-queen-continue-button"
                onClick={onConfirm}
              >
                Continue
              </button>
            ) : (
              <div className="regent-queen-waiting-text">
                Waiting for {attackerName} to continue...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegentQueenResultModal;
