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

  .effect-description.top {
    margin-top: 0;
  }

  .effect-description.phantom-king {
    font-size: 1.2rem;
    text-align: justify;
  }

  .quotation {
    font-style: italic;
    color: rgb(247, 105, 166);
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
  }, [
    selectedCardId,
    target1Name,
    resultText,
    target2Name,
    isSelfTarget,
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

  const revealedCard = isSelfTarget ? swappedCards.attackerReceived : null;

  //reminder of swappedCards structure:
  // swappedCards = {
  //   attackerReceived: { name, strength, effect },
  //   targetReceived: { name, strength, effect }
  // }

  // TO DO ARCHIE:
  // 1. IF self-targeting, show the revealed card on the left side (like the Priest card effect modal)
  // 2. IF the 2 targets are different players, show a div of the same size as the revealed card div, but that would contain both a dropdown (with target1Name and target2Name as options) with a "Which of these sinners' secrets do you want to know?" label above, and below the dropdown, add a "revealed card" button.
  // Make sure that the button is disabled until the player selects a target in the dropdown.
  // Once a target is selected and the button clicked, replace the dropdown and button with the revealed card of the selected target (like the Priest card effect modal).
  // Restyle the entire modal below to correspond to the character of the Royal Confessor (colors, decorations, the "Continue" button style & text, etc...)
  // Note: I just copy-pasted the PriestStyles & PriestLayout & HTML structure, so please feel free to modify anything you want to make it fit the Royal Confessor character b etter.
  // Think Christianity, religion, piety, confession, etc...

  return (
    <>
      <style>{effectTextStyles}</style>
      <div className="modal" style={modalOverlayStyle}>
        <div
          className="modal-content"
          style={{
            ...modalContentStyle,
            ...priestModalStyle,
          }}
        >
          {/* Crown decoration */}
          <div style={crownDecorationStyle}>🙏🏼</div>
          <h3 style={headerStyle}>The Mutual Confession ritual</h3>
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
  background: "#6a4c93",
  border: `3px solid #9b59b6$`,
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
  color: "#ffd700",
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
