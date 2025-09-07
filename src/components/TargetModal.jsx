import React, { useState } from "react";

export default function TargetModal({
  players,
  currentPlayer,
  cardPlayed,
  protectedPlayers = [],
  onConfirm,
  onCancel,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [guess, setGuess] = useState(2); // default to 2 for Guard

  const validTargets = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer && !p.isOut && !protectedPlayers.includes(name) // Use new protectedPlayers array
  );

  const isGuard = cardPlayed === 1;
  const isPrince = cardPlayed === 5;
  const isPhantomKing = cardPlayed === 6;
  const hasNoTargets = validTargets.length === 0 && !isPrince; // Prince can always target self

  console.log(
    "TargetModal has been called! / players: ",
    players,
    " / currentPlayer: ",
    currentPlayer,
    " / cardPlayed: ",
    cardPlayed,
    " / protectedPlayers: ",
    protectedPlayers,
    " / hasNoTargets: ",
    hasNoTargets
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Select a target for your card</h3>
        {hasNoTargets && !isPrince && (
          <p
            style={{ color: "#888", fontStyle: "italic", marginBottom: "10px" }}
          >
            🫖 All other players are enjoying tea with the Princess' Handmaid
            and cannot be targeted.
          </p>
        )}
        {isPrince && validTargets.length === 0 && (
          <p
            style={{
              color: "#D4AF37",
              fontStyle: "italic",
              marginBottom: "10px",
            }}
          >
            👑 All other players are protected, but as royalty, you may always
            command yourself!
          </p>
        )}
        {isPhantomKing && (
          <p
            style={{
              color: "#8A2BE2",
              fontStyle: "italic",
              marginBottom: "10px",
            }}
          >
            👻 The Phantom King may choose to trade hands with someone... or
            remain in the shadows.
          </p>
        )}
        <div className="dropdown-section-label">
          Select a target for your card
        </div>
        <select
          className="royal-select"
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
        >
          <option value="">-- Choose a player --</option>
          {isPhantomKing && (
            <option value="Nobody">👻 Nobody (skip effect)</option>
          )}
          {validTargets.map(([name, p]) => (
            <option key={name} value={name}>
              {p.name} ({p.realName})
            </option>
          ))}
          {isPrince && (
            <option value={currentPlayer}>
              👑 Yourself ({players[currentPlayer]?.name || currentPlayer})
            </option>
          )}
          {hasNoTargets && !isPrince && (
            <option value="SKIP_TURN">Skip turn (no available targets)</option>
          )}
        </select>

        {isGuard && (
          <>
            <div className="dropdown-section-label">Guess a strength (≠ 1)</div>
            <select
              className="royal-select"
              value={guess}
              onChange={(e) => setGuess(Number(e.target.value))}
            >
              {[0, 2, 3, 4, 5, 6, 7, 8, 9].map((str) => (
                <option key={str} value={str}>
                  {str}
                </option>
              ))}
            </select>
          </>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => onConfirm({ target: selectedTarget, guess })}
            disabled={!selectedTarget}
          >
            Confirm
          </button>
          <button onClick={onCancel} style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
