import React, { useState } from "react";

export default function TargetModal({
  players,
  currentPlayer,
  cardPlayed,
  protectedPlayers = [],
  nextTarget = null,
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

  var canTargetSelfCardsIds = [5, 12, 13]; // Handmaid, Prince, Court Whisperer and Royal Confessor can target self
  const canTargetSelf = canTargetSelfCardsIds.includes(cardPlayed);
  if (canTargetSelf) {
    validTargets.push([currentPlayer, players[currentPlayer]]);
  }

  // 🗣️ Court Whisperer: Check if targeting is forced
  const isTargetingForced = nextTarget && nextTarget.used === true;
  const forcedTargetNickname = isTargetingForced ? nextTarget.nickname : null;

  // If targeting is forced, override validTargets to only include the forced target
  const finalValidTargets = isTargetingForced
    ? validTargets.filter(([name]) => name === forcedTargetNickname)
    : validTargets;

  console.log("valid targets:", validTargets);
  console.log("Final valid targets:", finalValidTargets);

  const isGuard = cardPlayed === 1;
  const isPrince = cardPlayed === 5;
  const isPhantomKing = cardPlayed === 6;
  const isRegentQueen = cardPlayed === 11;
  const isCourtWhisperer = cardPlayed === 12;
  const hasNoTargets = finalValidTargets.length === 0;

  const isConfirmDisabled = !selectedTarget || selectedTarget === "";

  console.log("TargetModal button state:", {
    selectedTarget,
    isConfirmDisabled,
    hasNoTargets,
    isTargetingForced,
  });

  return (
    <div className="modal" style={cardOptionsContainerStyle}>
      <div className="modal-content" style={cardOptionsContentStyle}>
        {hasNoTargets && !canTargetSelf && !isTargetingForced && (
          <p style={noTargetMessageStyle}>
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
            {isPhantomKing && !isTargetingForced && (
              <option value="SKIP_TURN">👻 Nobody (skip effect)</option>
            )}
            {finalValidTargets.map(([name, p]) => (
              <option key={name} value={name}>
                {name === currentPlayer
                  ? "YOURSELF"
                  : `${p.name} (${p.realName})`}{" "}
                {isTargetingForced ? "🎯" : ""}
              </option>
            ))}
            {hasNoTargets && (
              <option value="SKIP_TURN">
                Skip turn (no available targets)
              </option>
            )}
          </select>
        </div>

        {/* 🗣️ Court Whisperer: Show gossip message when targeting is forced */}
        {isTargetingForced && !hasNoTargets && (
          <p
            style={{
              fontSize: "1.1rem",
              margin: "8px 0",
              color: "rgb(245 170 242)",
              fontStyle: "italic",
              textAlign: "left",
              fontFamily: "Lora, serif",
              lineHeight: "1.4em",
            }}
          >
            💅✨ The whole court can only talk about one name lately…
          </p>
        )}

        {isGuard && !hasNoTargets && (
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

        {isRegentQueen && !isTargetingForced && (
          <div style={specialQuoteContainerStyle}>
            <em>
              <p style={{ ...specialQuoteStyle, ...RegentQueenMessageStyle }}>
                You whisper your plea to the Regent Queen.
              </p>
              <p style={{ ...specialQuoteStyle, ...RegentQueenMessageStyle }}>
                She smiles — a cold, knowing smile. ‘If you wish to rise, my
                dear,’ she says, ‘let me remove the ones who stand too tall’.
              </p>
            </em>
          </div>
        )}

        {isPhantomKing && !isTargetingForced && (
          <div style={specialQuoteContainerStyle}>
            <em>
              <p style={{ ...specialQuoteStyle, ...phantomKingMessageStyle }}>
                Even after death (and one too many drinks), the late King still
                meddles in matters of his daughter’s heart.
              </p>
              <p style={{ ...specialQuoteStyle, ...phantomKingMessageStyle }}>
                Usually by making a glorious mess.
              </p>
            </em>
          </div>
        )}

        {isCourtWhisperer && !isTargetingForced && (
          <div style={specialQuoteContainerStyle}>
            <em>
              <p
                style={{ ...specialQuoteStyle, ...CourtWhispererMessageStyle }}
              >
                "Some sway hearts with poetry — others with rumors."
              </p>
            </em>
          </div>
        )}

        <div className="buttons-container" style={buttonsContainerStyle}>
          <button
            onClick={onCancel}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              ...getButtonsStyle(isConfirmDisabled, false),
              ...(isBackHovered ? backButtonHoverStyle : backButtonStyle),
            }}
          >
            Back
          </button>
          <button
            onClick={() => onConfirm({ target: selectedTarget, guess })}
            disabled={isConfirmDisabled}
            onMouseEnter={() => setIsConfirmHovered(true)}
            onMouseLeave={() => setIsConfirmHovered(false)}
            style={{
              ...getButtonsStyle(isConfirmDisabled, true),
              ...(isConfirmHovered
                ? confirmButtonHoverStyle
                : confirmButtonStyle),
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const dropdownSectionStyle = {
  color: "#ffd700",
};

const noTargetMessageStyle = {
  color: "rgb(136, 136, 136)",
  fontStyle: "italic",
  marginBottom: "2%",
  marginTop: 0,
  fontFamily: "Lora, serif",
  fontSize: "1.2rem",
  lineHeight: "1.5rem",
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

const specialQuoteContainerStyle = {
  marginBottom: "15px",
};

const specialQuoteStyle = {
  fontStyle: "italic",
  fontFamily: "Lora, serif",
  lineHeight: "1.4",
  fontSize: "1.1rem",
  textAlign: "justify",
};

const RegentQueenMessageStyle = {
  color: "rgb(92 246 122)",
};

const CourtWhispererMessageStyle = {
  color: "rgb(235 190 234)",
  padding: "0.15em",
  borderLeft: "3px solid rgb(235 190 234)",
  paddingLeft: "1em",
  textAlign: "left",
};

const phantomKingMessageStyle = {
  color: "rgb(188 206 249)",
};

const buttonsContainerStyle = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "space-between",
};

const getButtonsStyle = (isConfirmDisabled, isConfirmButton) => ({
  padding: "0.5rem 1rem",
  width: "45%",
  fontSize: "1.2rem",
  border: "2px solid",
  borderRadius: "8px",
  fontFamily: "Cinzel, serif",
  fontWeight: "bold",
  cursor: isConfirmDisabled && isConfirmButton ? "not-allowed" : "pointer",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

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
