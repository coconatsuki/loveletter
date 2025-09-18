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
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

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
    <div className="modal" style={cardOptionsContainerStyle}>
      <div className="modal-content" style={cardOptionsContentStyle}>
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
        <div className="dropdown-section-container">
          <div className="dropdown-section-label" style={dropdownSectionStyle}>
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
              <option value="SKIP_TURN">
                Skip turn (no available targets)
              </option>
            )}
          </select>
        </div>

        {isGuard && (
          <div className="dropdown-section-container">
            <div
              className="dropdown-section-label"
              style={dropdownSectionStyle}
            >
              Guess a strength (≠ 1)
            </div>
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
          </div>
        )}

        <div className="buttons-container" style={buttonsContainerStyle}>
          <button
            onClick={() => onConfirm({ target: selectedTarget, guess })}
            disabled={!selectedTarget}
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              ...buttonsStyle,
              ...(isConfirmHovered
                ? confirmButtonHoverStyle
                : confirmButtonStyle),
            }}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              ...buttonsStyle,
              ...(isBackHovered ? backButtonHoverStyle : backButtonStyle),
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const dropdownSectionStyle = {
  color: "#ffd700",
};

const cardOptionsContainerStyle = {
  display: "flex",
  flexGrow: 1,
};

const cardOptionsContentStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "inherit",
  borderRadius: "15px",
  color: "#2c1810",
  fontFamily: "Cinzel, serif",
  maxWidth: "none",
};

const buttonsContainerStyle = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "space-between",
};

const buttonsStyle = {
  padding: "0.5rem 1rem",
  width: "45%",
  fontSize: "1.2rem",
  border: "2px solid",
  borderRadius: "8px",
  fontFamily: "Cinzel, serif",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const confirmButtonStyle = {
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  color: "#8b0000",
  borderColor: "#8b4513",
  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
};

const confirmButtonHoverStyle = {
  background: "linear-gradient(135deg, #fff 0%, #ffd700 100%)",
  color: "#8b0000",
  borderColor: "#ffd700",
  boxShadow: "0 6px 18px rgba(255, 215, 0, 0.6)",
  transform: "translateY(-2px)",
};

const backButtonStyle = {
  background: "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
  color: "#f8f9fa",
  borderColor: "#6c757d",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
};

const backButtonHoverStyle = {
  background: "linear-gradient(135deg, #495057 0%, #343a40 100%)",
  color: "#fff",
  borderColor: "#495057",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  transform: "translateY(-1px)",
};
