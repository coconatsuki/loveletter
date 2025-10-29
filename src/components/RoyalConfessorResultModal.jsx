import React, { useEffect, useState } from "react";
import { getCardImage } from "../utils/cardsData";
import CardCountStars from "./CardCountStars";

// CSS styles for card effect formatting
const effectTextStyles = `
  .effect-title {
    font-weight: bold;
    font-size: 1.1em;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin: 0 0 1.5em 0;
    text-align: center;
  }

  .effect-player {
    font-weight: bold;
    color: #87ceeb;
  }

  .effect-card {
    font-weight: bold;
    color: #ffd700;
  }

  .effect-strength {
    font-weight: bold;
    color: #ff6b6b;
  }

  .effect-quote {
    font-style: italic;
    color: #daa520;
    margin: 1em 0 0;
    padding: 0.15em;
    border-left: 3px solid #daa520;
    padding-left: 1em;
  }

  .effect-signature {
    font-style: italic;
    text-align: right;
    color: #c0c0c0;
    margin-top: 0.25em;
  }

  .effect-description {
    line-height: 1.5;
    margin-bottom: 0.7em;
    font-size: 1.3rem;
  }

  .effect-description.top {
    margin-top: 0;
  }

  .effect-description.phantom-king {
    font-size: 1.2rem;
    text-align: justify;
  }

  .quotation {
    font-style: italic;
    color: rgb(213, 182, 78);
  }

  .effect-warning {
    color: #ff4444;
    font-weight: bold;
  }

  .effect-success {
    color: #44ff44;
    font-weight: bold;
  }

.effect-technical {
    border-top: 1px #dfdf73 dashed;
    padding-top: 1rem;
    margin-top: 1.2rem;
    text-align: center;
    color: #dfdf73;
}
`;

export default function RoyalConfessorResultModal({
  resultText,
  selectedCardId,
  target1Name,
  target2Name,
  isSelfTarget,
  cardPlayed,
  swappedCards,
  onClose,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [revealedCard, setRevealedCard] = useState(null);
  const [showDropdown, setShowDropdown] = useState(!isSelfTarget);
  const newTarget1Card = swappedCards?.target1Received;
  const newTarget2Card = swappedCards?.target2Received;

  // 🐛 DEBUG: Log props to ensure we never get invalid values
  useEffect(() => {
    console.log("🎭 RoyalConfessorResultModal mounted with props:", {
      selectedCardId,
      resultText: resultText?.substring(0, 100) + "...", // Truncate for readability
      target1Name,
      target2Name,
      isSelfTarget,
      cardPlayed,
      swappedCards,
    });

    // For self-targeting, show the card immediately
    if (isSelfTarget) {
      setRevealedCard(newTarget1Card);
      setShowDropdown(false);
    }
  }, [
    selectedCardId,
    target1Name,
    resultText,
    target2Name,
    isSelfTarget,
    cardPlayed,
    swappedCards,
  ]);

  // Helper function to render HTML text directly (no more markdown conversion needed)
  const formatText = (text) => {
    if (!text) return "";

    // If the text contains HTML tags, render it directly
    if (text.includes("<")) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Fallback for plain text (legacy support during transition)
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleRevealCard = () => {
    if (selectedTarget === target1Name) {
      setRevealedCard(newTarget1Card);
    } else if (selectedTarget === target2Name) {
      setRevealedCard(newTarget2Card);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <style>{effectTextStyles}</style>
      <style>{confessorGlowAnimation}</style>
      <div className="modal" style={modalOverlayStyle}>
        <div
          className="modal-content"
          style={{
            ...modalContentStyle,
            ...confessorModalStyle,
          }}
        >
          {/* Crown decoration */}
          <div style={crownDecorationStyle}>✝️</div>
          <h3 style={headerStyle}>Sacred Confession</h3>
          <div style={confessorLayoutStyle}>
            {/* Left side - The revealed card or dropdown selection */}
            <div style={confessorCardContainerStyle}>
              {showDropdown ? (
                // Show dropdown for external attacker to choose which target's card to reveal
                <div style={confessorDropdownContainerStyle}>
                  <div style={confessorDropdownContainerStyle2}>
                    <div style={confessorDropdownLabelStyle}>
                      Which of these sinners' secrets do you want to know?
                    </div>
                    <select
                      value={selectedTarget}
                      onChange={(e) => setSelectedTarget(e.target.value)}
                      style={confessorDropdownStyle}
                      onMouseEnter={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #fff 0%, #f0e68c 100%)";
                        e.target.style.boxShadow =
                          "inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 6px 18px rgba(139, 69, 19, 0.4)";
                        e.target.style.border = "3px solid #daa520";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #fff 0%, #f8f5e4 100%)";
                        e.target.style.boxShadow =
                          "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(139, 69, 19, 0.3)";
                        e.target.style.border = "3px solid #8b4513";
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "3px solid #ffd700";
                        e.target.style.outline = "none";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "3px solid #8b4513";
                      }}
                    >
                      <option
                        value=""
                        style={{ fontStyle: "italic", color: "#666" }}
                      >
                        Choose a confessor...
                      </option>
                      <option value={target1Name}>{target1Name}</option>
                      <option value={target2Name}>{target2Name}</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRevealCard}
                    disabled={!selectedTarget}
                    style={{
                      ...confessorRevealButtonStyle,
                      opacity: selectedTarget ? 1 : 0.5,
                      cursor: selectedTarget ? "pointer" : "not-allowed",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTarget) {
                        e.target.style.background =
                          "linear-gradient(135deg, #6a4c93 0%, #4a0028 100%)";
                        e.target.style.boxShadow =
                          "0 8px 25px rgba(218, 165, 32, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
                        e.target.style.border = "3px inset #daa520";
                        e.target.style.textShadow =
                          "1px 1px 2px rgba(0, 0, 0, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTarget) {
                        e.target.style.background =
                          "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)";
                        e.target.style.border = "3px outset #daa520";
                        e.target.style.textShadow = "none";
                      }
                    }}
                  >
                    ✨ Reveal ✨
                  </button>
                </div>
              ) : (
                // Show the revealed card
                revealedCard && (
                  <div style={confessorCardStyle}>
                    <div style={confessorCardStrengthStyle}>
                      {revealedCard.strength}
                    </div>
                    <div
                      style={{
                        ...confessorCardImageStyle,
                        backgroundImage: `url('/src/img/${getCardImage(
                          revealedCard.name
                        )}')`,
                      }}
                    ></div>
                    <div style={confessorCardContentStyle}>
                      <div style={confessorCardNameStyle}>
                        {revealedCard.name}
                      </div>
                      <div style={confessorCardEffectStyle}>
                        {revealedCard.effect}
                      </div>
                      <CardCountStars count={revealedCard.count} />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Right side - The confession message */}
            <div style={confessorMessageContainerStyle}>
              <div style={confessorMessageIconStyle}>
                <div style={confessorMessageStyle}>
                  {formatText(resultText)}
                </div>
              </div>
              <div
                style={{
                  ...buttonContainerStyle,
                  ...confessorButtonContainerStyle,
                }}
              >
                <button
                  onClick={onClose}
                  disabled={!isSelfTarget && !revealedCard}
                  style={{
                    ...buttonStyle,
                    ...confessorButtonStyle,
                    opacity: !isSelfTarget && !revealedCard ? 0.5 : 1,
                    cursor:
                      !isSelfTarget && !revealedCard
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!(!isSelfTarget && !revealedCard)) {
                      e.target.style.color = "#2d1b1b";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(141 90 0) 0%, rgb(247 225 114) 100%)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                      e.target.style.border = "2px outset #4b032b";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!isSelfTarget && !revealedCard)) {
                      e.target.style.color = "#ffd700";
                      e.target.style.background =
                        "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)";
                    }
                  }}
                >
                  {isSelfTarget
                    ? "Amen"
                    : revealedCard
                    ? "Thanks, Father!"
                    : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced royal styling
const modalOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(8px) brightness(0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  animation: "effectModalFadeIn 0.3s ease-out",
};

const crownDecorationStyle = {
  position: "absolute",
  top: "-30px",
  left: "50%",
  transform: "translateX(-50%)",
  background:
    "linear-gradient(135deg, rgb(141 90 0) 0%, rgb(247 225 114) 100%)",
  border: "2px solid #4b032b",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
  zIndex: 1001,
};

const modalContentStyle = {
  background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 50%, #8b0000 100%)",
  padding: "0",
  borderRadius: "20px",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
  maxWidth: "900px",
  width: "75%",
  textAlign: "center",
  border: "4px solid #ffd700",
  position: "relative",
  fontFamily: '"Cinzel", serif',
  animation: "effectModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

// Define headerStyle as a function that takes parameters
const headerStyle = {
  background: "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)",
  color: "rgb(216, 166, 18)",
  margin: "0",
  padding: "35px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: `2px solid "#9b59b6"`,
  borderRadius: "20px 20px 0 0",
  position: "relative",
};

const getMessageStyle = (isCourtWhispererEffect) => ({
  fontSize: "1.3rem",
  textAlign: "justify",
  lineHeight: "1.6",
  color: isCourtWhispererEffect ? "#faebd7" : "white",
  margin: "0",
  padding: "25px",
  background: "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)",
  fontFamily: '"Lora", serif',
});

const buttonContainerStyle = {
  display: "flex",
  padding: "15px 25px 0",
  marginTop: "1rem",
  borderRadius: "0 0 20px 20px",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "1.2rem",
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  color: "#8b0000",
  border: "2px solid #8b4513",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
  minWidth: "140px",
  width: "55%",
};

// Royal Confessor-specific modal styles
const confessorModalStyle = {
  width: "75%",
  maxWidth: "90%",
  background: "linear-gradient(135deg, #2d1b1b 0%, #4a0028 50%, #6a4c93 100%)",
  border: "4px solid #daa520",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(218, 165, 32, 0.4)",
};

const confessorLayoutStyle = {
  padding: "0 1.7rem",
  display: "flex",
  alignItems: "flex-start",
  margin: "2% 0px",
  justifyContent: "space-between",
  height: "100%",
  gap: "1.5rem",
};

const confessorCardContainerStyle = {
  width: "30%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "100%",
  minHeight: "330px",
  justifyContent: "center",
};

const confessorDropdownContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  width: "200px",
  height: "330px",
  background:
    "linear-gradient(135deg, rgb(141 90 0) 0%, rgb(247 225 114) 100%)",
  borderRadius: "12px",
  padding: "20px",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  border: "3px solid #8b4513",
  animation: "confessorContainerGlow 3s ease-in-out infinite alternate",
};

const confessorDropdownContainerStyle2 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

const confessorDropdownLabelStyle = {
  color: "#2d1b1b",
  fontWeight: "bold",
  fontSize: "1.4rem",
  textAlign: "center",
  marginBottom: "2rem",
  lineHeight: "1.3",
  fontFamily: '"Lora", serif',
};

const confessorDropdownStyle = {
  width: "100%",
  padding: "0.7rem",
  fontSize: "1rem",
  borderRadius: "10px",
  border: "3px solid #8b4513",
  background: "linear-gradient(135deg, #fff 0%, #f8f5e4 100%)",
  color: "#2d1b1b",
  fontFamily: '"Lora", serif',
  fontWeight: "600",
  marginBottom: "15px",
  cursor: "pointer",
  boxShadow:
    "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(139, 69, 19, 0.3)",
  transition: "all 0.3s ease",
  textAlign: "left",
  textTransform: "capitalize",
  letterSpacing: "0.5px",
};

const confessorRevealButtonStyle = {
  padding: "12px 24px",
  fontSize: "1.1rem",
  background: "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)",
  color: "#ffd700",
  border: "3px outset #daa520",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  boxShadow:
    "0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
  position: "relative",
  overflow: "hidden",
};

const confessorCardStyle = {
  position: "relative",
  backgroundColor: "white",
  borderRadius: "8px",
  width: "200px",
  height: "330px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(218, 165, 32, 0.4)",
  transition: "all 0.2s ease",
  transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
  border: "3px solid #8b4513",
};

const confessorCardStrengthStyle = {
  position: "absolute",
  top: "-10px",
  left: "-10px",
  background: "linear-gradient(135deg, #ffd700 0%, #daa520 100%)",
  color: "#2d1b1b",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "1.1rem",
  fontFamily: '"Cinzel", serif',
  border: "3px solid #8b4513",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  zIndex: 10,
  margin: "0",
};

const confessorCardImageStyle = {
  boxSizing: "border-box",
  width: "100%",
  height: "60%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  margin: "0",
  border: "2px solid #daa520",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
};

const confessorCardContentStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  height: "40%",
};

const confessorCardNameStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "#4a0028",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  fontFamily: '"Cinzel", serif',
  margin: "3% 0",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const confessorCardEffectStyle = {
  padding: "0 4%",
  fontWeight: "300",
  fontSize: "1rem",
  lineHeight: "1.3",
  color: "#2d1b1b",
  textAlign: "justify",
  fontFamily: '"Lora", serif',
  fontStyle: "italic",
};

const confessorMessageContainerStyle = {
  width: "70%",
  height: "-webkit-fill-available",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "justify",
};

const confessorMessageIconStyle = {
  display: "flex",
  flexDirection: "column",
};

const confessorMessageStyle = {
  fontSize: "1.2rem",
  color: "#e6d7b0",
  lineHeight: "1.6",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontFamily: '"Lora", serif',
};

const confessorButtonContainerStyle = {
  background: "initial",
  width: "100%",
  padding: "0",
};

const confessorButtonStyle = {
  background: "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)",
  color: "rgb(216, 166, 18)",
  transition: "all 0.3s ease",
  width: "70%",
  border: "none",
};

// Add the animation CSS for Royal Confessor
const confessorGlowAnimation = `
@keyframes confessorGlow {
  0% {
    filter: drop-shadow(0 4px 8px rgba(218, 165, 32, 0.6));
  }
  100% {
    filter: drop-shadow(0 6px 15px rgba(218, 165, 32, 0.9));
  }
}

@keyframes confessorContainerGlow {
  0% {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 8px 25px rgba(218, 165, 32, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
}
`;

// Inject the animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = confessorGlowAnimation;
  document.head.appendChild(style);
}
