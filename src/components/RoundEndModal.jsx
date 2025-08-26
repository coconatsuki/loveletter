import React, { useState, useEffect } from "react";
import "./RoundEndModal.css";

export default function RoundEndModal({ roundResult, players, onContinue }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue(); // Auto-redirect when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [onContinue]);

  const handleManualContinue = () => {
    onContinue();
  };

  // Case 1: Last Player Standing
  if (roundResult.type === "lastPlayerStanding") {
    const winner = roundResult.winner;
    const winnerData = players[winner];
    const winnerCard = winnerData?.hand?.[0];
    const eliminatedPlayers = Object.keys(players).filter(
      (p) => players[p].isOut
    );

    return (
      <div className="modal-overlay">
        <div className="modal-content round-end-modal">
          <div className="modal-header">
            <h2>🏆 Victory in the Royal Court! 🏆</h2>
          </div>

          <div className="modal-body">
            <div className="victory-announcement">
              <p className="victory-text">
                ⚔️{" "}
                <strong>
                  The battle for the Princess's heart has concluded!
                </strong>{" "}
                ⚔️
              </p>

              <div className="winner-showcase">
                <h3>👑 Last Noble Standing 👑</h3>
                <div className="winner-card">
                  <p className="winner-name">
                    <strong>{winnerData?.realName || winner}</strong>
                    <span className="nickname">
                      ({winnerData?.name || winner})
                    </span>
                  </p>
                  <p className="winner-hand">
                    Holding:{" "}
                    <strong>{winnerCard?.name || "Unknown Card"}</strong>
                    <span className="card-strength">
                      (Strength: {winnerCard?.strength || "?"})
                    </span>
                  </p>
                </div>
              </div>

              {eliminatedPlayers.length > 0 && (
                <div className="eliminated-section">
                  <h4>⚰️ Fallen in Battle ⚰️</h4>
                  <div className="eliminated-list">
                    {eliminatedPlayers.map((playerKey) => (
                      <span key={playerKey} className="eliminated-player">
                        {players[playerKey]?.realName || playerKey}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="flavor-text">
                🌹 With cunning and fortune,{" "}
                <strong>{winnerData?.realName || winner}</strong> emerges
                victorious! Their love letter shall reach the Princess, earning
                them a precious Love Token! 💕
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary continue-btn"
              onClick={handleManualContinue}
            >
              ⚡ View Round Scoring Board ⚡
            </button>
            <p className="auto-redirect-text">
              Auto-redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
              ...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Deck Empty - Strength Battle
  if (roundResult.type === "deckEmpty") {
    const winners = roundResult.winners || [];
    const finalStandings = roundResult.finalStandings || [];

    return (
      <div className="modal-overlay">
        <div className="modal-content round-end-modal">
          <div className="modal-header">
            <h2>⚔️ The Grand Battle of Hearts! ⚔️</h2>
          </div>

          <div className="modal-body">
            <div className="victory-announcement">
              <p className="victory-text">
                📜{" "}
                <strong>
                  The last turn has been played and the deck lies empty!
                </strong>{" "}
                📜
              </p>

              <p className="battle-intro">
                🏰 Now comes the grand battle among the Princess's suitors!
                Whose love letter bears the strongest seal? 💌
              </p>

              <div className="strength-battle">
                <h3>🗡️ Final Standings 🗡️</h3>
                <div className="players-showcase">
                  {finalStandings.map((standing, index) => {
                    const playerData = players[standing.player];
                    const card = standing.hand?.[0];
                    const isWinner = winners.includes(standing.player);

                    return (
                      <div
                        key={standing.player}
                        className={`player-standing ${
                          isWinner ? "winner" : ""
                        }`}
                      >
                        <div className="standing-rank">
                          {isWinner ? "👑" : `#${index + 1}`}
                        </div>
                        <div className="player-info">
                          <strong>
                            {playerData?.realName || standing.player}
                          </strong>
                          <br />
                          <span className="nickname">
                            ({playerData?.name || standing.player})
                          </span>
                        </div>
                        <div className="card-info">
                          <div className="card-name">
                            {card?.name || "Unknown"}
                          </div>
                          <div className="card-strength">
                            Strength: {standing.strength}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="winner-announcement">
                {winners.length === 1 ? (
                  <p className="flavor-text">
                    🌹{" "}
                    <strong>
                      {players[winners[0]]?.realName || winners[0]}
                    </strong>{" "}
                    triumphs! Their letter bears the mightiest seal and wins the
                    Princess's favor! 💕
                  </p>
                ) : (
                  <p className="flavor-text">
                    ⚖️ A noble tie!{" "}
                    <strong>
                      {winners
                        .map((w) => players[w]?.realName || w)
                        .join(" and ")}
                    </strong>
                    share equal strength! Both earn the Princess's admiration!
                    💕
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary continue-btn"
              onClick={handleManualContinue}
            >
              ⚡ View Round Scoring Board ⚡
            </button>
            <p className="auto-redirect-text">
              Auto-redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
              ...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
