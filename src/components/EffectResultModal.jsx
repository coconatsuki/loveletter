import React, { useEffect } from "react";
import { getCardImage } from "../utils/cardsData";

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

  .effect-warning {
    color: #ff4444;
    font-weight: bold;
  }

  .effect-success {
    color: #44ff44;
    font-weight: bold;
  }

  .effect-technical {
    border-top: 1px dashed;
    padding-top: 1rem;
    margin-top: 1.2rem;
    text-align: center;
  }
`;

export default function EffectResultModal({
  resultText,
  cardDetails = null,
  selectedCardId = -1, // Should never be -1 if properly called - will help us catch bugs
  role = "unknown", // Should never be "unknown" if properly called - will help us catch bugs
  onClose,
}) {
  // 🐛 DEBUG: Log props to ensure we never get invalid values
  useEffect(() => {
    console.log("🎭 EffectResultModal mounted with props:", {
      selectedCardId,
      role,
      resultText: resultText?.substring(0, 100) + "...", // Truncate for readability
      hasCardDetails: !!cardDetails,
    });

    // 🚨 Alert us if we get invalid values
    if (
      selectedCardId === -1 ||
      selectedCardId === null ||
      selectedCardId === undefined
    ) {
      console.error(
        "🚨 EffectResultModal: selectedCardId is invalid!",
        selectedCardId
      );
    }
    if (role === "unknown" || role === null || role === undefined) {
      console.error("🚨 EffectResultModal: role is invalid!", role);
    }
  }, [selectedCardId, role, resultText, cardDetails]);
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

  // Effect detection based on selectedCardId (more reliable than text parsing)
  const isHandmaidProtection = selectedCardId === 4;
  const isJesterEffect = selectedCardId === 0;
  const isPriestEffect =
    selectedCardId === 2 && cardDetails && cardDetails["Revealed Card"];
  const isCourtWhispererEffect = selectedCardId === 12;
  const isInquisitorEffect = selectedCardId === 9;
  const isChamberlainEffect = selectedCardId === 10;

  // Court Whisperer: distinguish between attacker and target
  const isCourtWhispererAttacker =
    isCourtWhispererEffect && role === "attacker";
  const isCourtWhispererTarget = isCourtWhispererEffect && role === "target";

  // Extract card information for Priest effect
  let revealedCard = null;
  if (isPriestEffect && cardDetails) {
    const revealedCardText = cardDetails["Revealed Card"];
    const cardEffect = cardDetails["Card Effect"];

    if (revealedCardText) {
      // Parse "Prince (Strength 5)" format
      const match = revealedCardText.match(/^(.+?)\s*\(Strength\s*(\d+)\)$/);
      if (match) {
        revealedCard = {
          name: match[1].trim(),
          strength: parseInt(match[2]),
          effect: cardEffect || "No effect description available",
        };
      }
    }
  }

  return (
    <>
      <style>{effectTextStyles}</style>
      <div className="modal" style={modalOverlayStyle}>
        <div
          className="modal-content"
          style={{
            ...modalContentStyle,
            ...(isHandmaidProtection ? handmaidModalStyle : {}),
            ...(isPriestEffect ? priestModalStyle : {}),
            ...(isJesterEffect ? jesterModalStyle : {}),
            ...(isCourtWhispererEffect ? courtWhispererModalStyle : {}),
          }}
        >
          {/* Crown decoration */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              background: isPriestEffect
                ? "#6a4c93"
                : isJesterEffect
                ? "rgb(22 3 3)"
                : isCourtWhispererEffect
                ? "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)"
                : isHandmaidProtection
                ? "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)"
                : "#8b0000",
              border: `3px solid ${
                isPriestEffect
                  ? "#9b59b6"
                  : isJesterEffect
                  ? "#ff6b35"
                  : isCourtWhispererEffect
                  ? "#FF1493"
                  : isHandmaidProtection
                  ? "#8bc34a"
                  : "#ffd700"
              }`,
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
              zIndex: 1001,
            }}
          >
            {isPriestEffect
              ? "🔍"
              : isInquisitorEffect
              ? "🕵️"
              : isJesterEffect
              ? "🎭"
              : isCourtWhispererEffect
              ? "💅"
              : isChamberlainEffect
              ? "💰"
              : isHandmaidProtection
              ? "🛡️"
              : "📜"}
          </div>
          <h3
            style={getHeaderStyle(
              isHandmaidProtection,
              isPriestEffect,
              isInquisitorEffect,
              isJesterEffect,
              isCourtWhispererEffect
            )}
          >
            {isPriestEffect
              ? "Priest's Divine Revelation"
              : isInquisitorEffect
              ? "Inquisitor's Investigation"
              : isJesterEffect
              ? "🎪 Jester's Fool's Favor 🎭"
              : isCourtWhispererAttacker
              ? "🪄 A Little Word in the Right Ear…"
              : isCourtWhispererTarget
              ? "📜 Your Name's on Every Scroll!"
              : isCourtWhispererEffect
              ? "💅 Court Whisperer Effect 💅"
              : isHandmaidProtection
              ? "Protected by the Handmaid"
              : "Effect Result"}
          </h3>
          {/* Special Priest Layout with Card Display */}
          {isPriestEffect && revealedCard ? (
            <div style={priestLayoutStyle}>
              {/* Left side - The revealed card */}
              <div style={priestCardContainerStyle}>
                <div style={priestCardStyle}>
                  <div style={priestCardStrengthStyle}>
                    {revealedCard.strength}
                  </div>
                  <div
                    style={{
                      ...priestCardImageStyle,
                      backgroundImage: `url('/src/img/${getCardImage(
                        revealedCard.name
                      )}')`,
                    }}
                  ></div>
                  <div style={priestCardContentStyle}>
                    <div style={priestCardNameStyle}>{revealedCard.name}</div>
                    <div style={priestCardEffectStyle}>
                      {revealedCard.effect}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - The spying message */}
              <div style={priestMessageContainerStyle}>
                <div style={priestMessageIconStyle}>
                  <div style={priestSpyIconStyle}>👁️‍🗨️</div>
                  <div style={priestMessageStyle}>{formatText(resultText)}</div>
                </div>
                <div
                  style={{
                    ...buttonContainerStyle,
                    ...priestButtonContainerStyle,
                  }}
                >
                  <button
                    onClick={onClose}
                    style={{
                      ...buttonStyle,
                      ...priestButtonStyle,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#8b0000";
                      e.target.style.background =
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#ffd700";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)";
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={messageStyle}>
              {formatText(resultText)}
              <div
                style={{
                  ...buttonContainerStyle,
                  ...(isHandmaidProtection ? handmaidButtonContainerStyle : {}),
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    ...buttonStyle,
                    ...(isHandmaidProtection ? handmaidButtonStyle : {}),
                    ...(isJesterEffect ? jesterButtonStyle : {}),
                    ...(isCourtWhispererEffect
                      ? courtWhispererButtonStyle
                      : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (isJesterEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #0017a2 0%, #c24e16 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 107, 53, 0.6)";
                      e.target.style.border = "2px solid rgb(45, 27, 27)";
                    } else if (isCourtWhispererEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 20, 147, 0.6)";
                      e.target.style.border = "2px solid #FF69B4";
                    } else if (isHandmaidProtection) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(76, 175, 80, 0.5)";
                    } else {
                      e.target.style.background =
                        "linear-gradient(135deg, #fff 0%, #ffd700 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isJesterEffect) {
                      e.target.style.background = "rgb(22 3 3)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(255, 107, 53, 0.4)";
                      e.target.style.color = "rgb(255, 215, 0)";
                      e.target.style.border = "2px solid rgb(106 92 48)";
                    } else if (isCourtWhispererEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(255, 20, 147, 0.4)";
                      e.target.style.color = "#8B0000";
                      e.target.style.border = "2px solid #FF1493";
                    } else if (isHandmaidProtection) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.4)";
                    } else {
                      e.target.style.background =
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.4)";
                    }
                  }}
                >
                  {isJesterEffect
                    ? "🎪✨ Marvelous! ✨🎭"
                    : isCourtWhispererEffect
                    ? "💅✨ Fabulous Gossip! ✨💋"
                    : isHandmaidProtection
                    ? "🍰✨ Very Well ✨🫖"
                    : "Continue"}
                </button>
              </div>
            </div>
          )}
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

const handmaidModalStyle = {
  background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
  border: "4px solid #8bc34a",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(139, 195, 74, 0.4), inset 0 1px 0 rgba(139, 195, 74, 0.3)",
};

// 🎭 Jester Modal Style - Colorful and joyful! 🎪
const jesterModalStyle = {
  background:
    "linear-gradient(135deg, #ff6b35 0%, #ffa500 30%, #ffcc00 70%, #ff6b35 100%)",
  border: "4px solid #ff6b35",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 107, 53, 0.6), inset 0 1px 0 rgba(255, 204, 0, 0.4)",
};

// Define headerStyle as a function that takes parameters
const getHeaderStyle = (
  isHandmaidProtection,
  isPriestEffect,
  isInquisitorEffect,
  isJesterEffect,
  isCourtWhispererEffect
) => ({
  background: isPriestEffect
    ? "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)"
    : isJesterEffect
    ? "linear-gradient(135deg, #0017a2 0%, #c24e16 100%)"
    : isCourtWhispererEffect
    ? "linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)"
    : isHandmaidProtection
    ? "linear-gradient(135deg, rgb(15 44 15) 0%, rgb(46, 125, 50) 100%)"
    : isInquisitorEffect
    ? "linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)"
    : "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
  color: isCourtWhispererEffect ? "#8B0000" : "#ffd700",
  margin: "0",
  padding: "35px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: isCourtWhispererEffect
    ? "2px 2px 4px rgba(139, 0, 0, 0.8)"
    : "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: `2px solid ${
    isPriestEffect
      ? "#9b59b6"
      : isCourtWhispererEffect
      ? "#FF1493"
      : isHandmaidProtection
      ? "rgb(139, 195, 74)"
      : "#ffd700"
  }`,
  borderRadius: "20px 20px 0 0",
  position: "relative",
});

const messageStyle = {
  fontSize: "1.3rem",
  textAlign: "justify",
  lineHeight: "1.6",
  color: "white",
  margin: "0",
  padding: "25px",
  background: "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)",
  fontFamily: '"Lora", serif',
};

const classicResultTextContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
};

const cardDetailsStyle = {
  margin: "0",
  padding: "20px 25px",
  background: "linear-gradient(135deg, #f0ead6 0%, #e8dcc0 100%)",
  textAlign: "left",
  borderTop: "2px solid #d4af37",
  borderBottom: "2px solid #d4af37",
  fontFamily: '"Lora", serif',
};

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

// Handmaid-specific button styles
const handmaidButtonContainerStyle = {
  background:
    "linear-gradient(135deg, rgb(26, 77, 26) 0%, rgb(46, 125, 50) 50%, rgb(76, 175, 80) 100%)",
};

const handmaidButtonStyle = {
  width: "70%",
  background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
  color: "rgb(255, 215, 0)",
  border: "2px solid #8bc34a",
};

const jesterButtonStyle = {
  width: "55%",
  background: "rgb(22 3 3)",
  color: "rgb(255, 215, 0)",
  border: "2px solid rgb(106 92 48)",
  fontWeight: "700",
};

const courtWhispererButtonStyle = {
  width: "60%",
  background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)",
  color: "#8B0000",
  border: "2px solid #FF1493",
  fontWeight: "700",
  textShadow: "1px 1px 2px rgba(139, 0, 0, 0.8)",
};

// 🗣️ Court Whisperer Modal Style - Gossip magazine theme! 💅📰
const courtWhispererModalStyle = {
  background:
    "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 25%, #FFC0CB 50%, #FFEFD5 75%, #FF69B4 100%)",
  border: "4px solid #FF1493",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 20, 147, 0.6), inset 0 1px 0 rgba(255, 105, 180, 0.4)",
};

// Priest-specific modal styles
const priestModalStyle = {
  width: "90%",
  maxWidth: "800px",
  background:
    "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 50%, rgb(139, 0, 0) 100%)",
  border: "4px solid #9b59b6",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(155, 89, 182, 0.4)",
};

const priestLayoutStyle = {
  display: "flex",
  gap: "30px",
  alignItems: "flex-start",
  margin: "3% 0",
  justifyContent: "space-around",
  height: "100%",
};

const priestCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "30%",
  height: "100%",
};

const priestCardStyle = {
  position: "relative",
  backgroundColor: "white",
  borderRadius: "8px",
  width: "200px",
  height: "330px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(255, 215, 0, 0.4)",
  transition: "all 0.2s ease",
  transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
};

const priestCardStrengthStyle = {
  position: "absolute",
  top: "-10px",
  left: "-10px",
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  color: "#007bff",
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

const priestCardImageStyle = {
  width: "initial%",
  height: "60%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  margin: "0",
  border: "2px solid #d4af37",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
};

const priestCardContentStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
};

const priestCardNameStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "#8b0000",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  fontFamily: '"Cinzel", serif',
  margin: "3% 0",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const priestCardEffectStyle = {
  padding: "0 4%",
  fontWeight: "300",
  fontSize: "1rem",
  lineHeight: "1.3",
  color: "#3a2a1a",
  textAlign: "justify",
  fontFamily: '"Lora", serif',
  fontStyle: "italic",
};

const priestMessageContainerStyle = {
  width: "55%",
  height: "-webkit-fill-available",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "center",
};

const priestMessageIconStyle = {
  display: "flex",
  flexDirection: "column",
};

const priestSpyIconStyle = {
  fontSize: "4rem",
  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))",
  animation: "priestGlow 2s ease-in-out infinite alternate",
};

const priestMessageStyle = {
  fontSize: "1.2rem",
  color: "#e6d7b0",
  lineHeight: "1.6",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontFamily: '"Lora", serif',
};

const priestButtonContainerStyle = {
  background: "initial",
  width: "100%",
  padding: "0",
};

const priestButtonStyle = {
  background:
    "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)",
  color: "#ffd700",
  transition: "all 0.3s ease",
  width: "70%",
};

// Add the animation CSS (this would normally be in a CSS file)
const priestGlowAnimation = `
@keyframes priestGlow {
  0% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(155, 89, 182, 0.3));
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(155, 89, 182, 0.6));
  }
}
`;

// Inject the animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = priestGlowAnimation;
  document.head.appendChild(style);
}
