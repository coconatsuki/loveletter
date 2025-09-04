import React from "react";
import "./ActionModal.css";

const ActionModal = ({
  isMyTurn,
  player,
  onDrawCard,
  onPlayCard,
  isPlaying,
  countessForce,
  onClose,
}) => {
  if (!isMyTurn) return null;

  return (
    <div className="action-modal-overlay">
      <div className="action-modal">
        <div className="action-modal-header">
          <h2>👑 Your Royal Turn 👑</h2>
          <button className="action-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="action-modal-content">
          {player?.hand?.length === 1 && (
            <div className="draw-card-section">
              <p>🃏 You have 1 card. Draw another to begin your turn.</p>
              <button
                className="royal-button draw-button"
                onClick={onDrawCard}
                disabled={isPlaying}
              >
                {isPlaying ? "⏳ Drawing..." : "🃏 Draw Card"}
              </button>
            </div>
          )}

          {player?.hand?.length === 2 && (
            <div className="play-card-section">
              <div className="section-header">
                <h3>🎴 Choose a card to play:</h3>
                {countessForce?.forced && (
                  <div className="countess-warning">
                    <strong>🎭 Royal Protocol Alert:</strong>
                    <br />
                    {countessForce.reason}
                  </div>
                )}
              </div>

              <div className="cards-grid">
                {player.hand.map((card, index) => {
                  const isBlocked =
                    countessForce?.forced &&
                    ((card.id === 5 &&
                      countessForce.blockedCard === "Prince") ||
                      (card.id === 6 &&
                        countessForce.blockedCard === "Phantom King"));

                  return (
                    <div
                      key={index}
                      className={`action-card ${isBlocked ? "blocked" : ""}`}
                      onClick={() =>
                        !isPlaying && !isBlocked && onPlayCard(index)
                      }
                      title={
                        isBlocked
                          ? `Cannot play ${card.name} - Countess demands precedence!`
                          : ""
                      }
                    >
                      <div className="card-portrait">
                        {/* This will be the card portrait in Phase 2 */}
                        <div className="card-strength">{card.strength}</div>
                      </div>

                      <div className="card-info">
                        <div className="card-name">{card.name}</div>
                        <div className="card-effect">{card.effect}</div>

                        {isBlocked && (
                          <div className="card-blocked-indicator">
                            🎭 Blocked by Countess
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
