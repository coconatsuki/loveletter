import React from "react";

// Helper function to get the correct card image
const getCardImage = (cardName) => {
  const imageMap = {
    Guard: "guard1.jpeg",
    Priest: "priest1.jpeg",
    Baron: "baron1.jpeg",
    Handmaid: "handmaid1.jpeg",
    Prince: "prince1.jpeg",
    "Phantom King": "phantom-king1.jpeg",
    Countess: "countess1.jpeg",
    Princess: "princess-portrait1.jpeg",
    // Premium cards that don't have images yet
    Jester: "countess1.jpeg",
    Inquisitor: "countess1.jpeg",
    Chamberlain: "countess1.jpeg",
    "Regent Queen": "countess1.jpeg",
    "Court Whisperer": "countess1.jpeg",
    "Royal Confessor": "countess1.jpeg",
    Assassin: "countess1.jpeg",
    Baroness: "countess1.jpeg",
    Duke: "countess1.jpeg",
  };

  return imageMap[cardName] || "countess1.jpeg";
};

export default function EffectResultModal({
  resultText,
  cardDetails = null,
  onClose,
}) {
  console.log("EffectResultModal has been called! / resultText: ", resultText);

  // Helper function to format text with markdown-like syntax
  const formatText = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => {
      // Handle bold text (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Handle italic text (*text*)
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");

      return (
        <React.Fragment key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {index < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Check if this is a Handmaid protection message
  const isHandmaidProtection =
    resultText?.includes("tea and biscuits") ||
    resultText?.includes("protected from courtly intrigue");

  // Check if this is a Priest effect (looking at someone's card)
  const isPriestEffect =
    cardDetails &&
    (resultText?.includes("divine light reveals") ||
      cardDetails["Revealed Card"] ||
      cardDetails["Target Player"]);

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
    <div className="modal" style={modalOverlayStyle}>
      <div
        className="modal-content"
        style={{
          ...modalContentStyle,
          ...(isHandmaidProtection ? handmaidModalStyle : {}),
          ...(isPriestEffect ? priestModalStyle : {}),
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
              : isHandmaidProtection
              ? "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)"
              : "#8b0000",
            border: `3px solid ${
              isPriestEffect
                ? "#9b59b6"
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
          {isPriestEffect ? "🔍" : isHandmaidProtection ? "🛡️" : "📜"}
        </div>

        <h3 style={getHeaderStyle(isHandmaidProtection, isPriestEffect)}>
          {isPriestEffect
            ? "Priest's Divine Revelation"
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
                  <div style={priestCardEffectStyle}>{revealedCard.effect}</div>
                </div>
              </div>
            </div>

            {/* Right side - The spying message */}
            <div style={priestMessageContainerStyle}>
              <div style={priestSpyIconStyle}>👁️‍🗨️</div>
              <div style={priestMessageStyle}>{formatText(resultText)}</div>
            </div>
          </div>
        ) : (
          /* Standard layout for non-Priest effects */
          <>
            <div style={messageStyle}>{formatText(resultText)}</div>

            {cardDetails && !isPriestEffect && (
              <div style={cardDetailsStyle}>
                {Object.entries(cardDetails).map(([label, value]) => (
                  <div key={label} style={detailRowStyle}>
                    <strong>{label}:</strong> {value}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div
          style={{
            ...buttonContainerStyle,
            ...(isHandmaidProtection ? handmaidButtonContainerStyle : {}),
            ...(isPriestEffect ? priestButtonContainerStyle : {}),
          }}
        >
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              ...(isHandmaidProtection ? handmaidButtonStyle : {}),
              ...(isPriestEffect ? priestButtonStyle : {}),
            }}
            onMouseEnter={(e) => {
              if (isHandmaidProtection) {
                e.target.style.background =
                  "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 25px rgba(76, 175, 80, 0.5)";
              } else if (isPriestEffect) {
                e.target.style.color = "#8b0000";
                e.target.style.background =
                  "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 25px rgba(255, 215, 0, 0.5)";
              } else {
                e.target.style.background =
                  "linear-gradient(135deg, #fff 0%, #ffd700 100%)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 25px rgba(255, 215, 0, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (isHandmaidProtection) {
                e.target.style.background =
                  "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
              } else if (isPriestEffect) {
                e.target.style.color = "#ffd700";
                e.target.style.background =
                  "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)";
              } else {
                e.target.style.background =
                  "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
              }
            }}
          >
            {isHandmaidProtection ? "🍰✨ Very Well ✨🫖" : "Continue"}
          </button>
        </div>
      </div>
    </div>
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
  maxWidth: "500px",
  width: "90%",
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

// Define headerStyle as a function that takes parameters
const getHeaderStyle = (isHandmaidProtection, isPriestEffect) => ({
  background: isPriestEffect
    ? "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)"
    : isHandmaidProtection
    ? "linear-gradient(135deg, rgb(15 44 15) 0%, rgb(46, 125, 50) 100%);"
    : "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
  color: "#ffd700",
  margin: "0",
  padding: "35px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: `2px solid ${
    isPriestEffect
      ? "#9b59b6"
      : isHandmaidProtection
      ? "rgb(139, 195, 74)"
      : "#ffd700"
  }`,
  borderRadius: "20px 20px 0 0",
  position: "relative",
});

const messageStyle = {
  fontSize: "1.2rem",
  textAlign: "justify",
  lineHeight: "1.6",
  color: "white",
  margin: "0",
  padding: "25px",
  background: "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)",
  fontFamily: '"Lora", serif',
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

const detailRowStyle = {
  marginBottom: "0.5rem",
  color: "#2c1810",
  fontSize: "1rem",
};

const buttonContainerStyle = {
  padding: "15px 25px 20px",
  background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 100%)",
  borderRadius: "0 0 20px 20px",
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
};

const priestCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "30%",
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
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const priestSpyIconStyle = {
  fontSize: "4rem",
  marginBottom: "20px",
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
};

const priestButtonStyle = {
  background:
    "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)",
  color: "#ffd700",
  transition: "all 0.3s ease",
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
