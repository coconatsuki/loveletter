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
      name !== currentPlayer &&
      !p.isOut &&
      !protectedPlayers.includes(name) // Use new protectedPlayers array
  );

  const isGuard = cardPlayed === 1;
  const hasNoTargets = validTargets.length === 0;

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
        {hasNoTargets && (
          <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '10px' }}>
            🫖 All other players are enjoying tea with the Princess' Handmaid and cannot be targeted.
          </p>
        )}
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
        >
          <option value="">-- Choose a player --</option>
          {validTargets.map(([name, p]) => (
            <option key={name} value={name}>
              {p.name} ({p.realName})
            </option>
          ))}
          {hasNoTargets && (
            <option value="SKIP_TURN">Skip turn (no available targets)</option>
          )}
        </select>

        {isGuard && (
          <>
            <h4>Guess a strength (≠ 1)</h4>
            <select
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
