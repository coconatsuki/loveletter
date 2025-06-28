import React, { useState } from "react";

export default function TargetModal({
  players,
  currentPlayer,
  cardPlayed,
  onConfirm,
  onCancel,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [guess, setGuess] = useState(2); // default to 2 for Guard

  const validTargets = Object.entries(players).filter(
    ([name, p]) =>
      name !== currentPlayer &&
      !p.isOut &&
      p.discard?.[p.discard.length - 1] !== 4 // not protected by Handmaid
  );

  const isGuard = cardPlayed === 1;

  console.log(
    "TargetModal has been called! / players: ",
    players,
    " / currentPlayer: ",
    currentPlayer,
    " / cardPlayed: ",
    cardPlayed
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Select a target for your card</h3>
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
