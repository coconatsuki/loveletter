import React from "react";

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

  return (
    <div className="modal" style={modalOverlayStyle}>
      <div
        className="modal-content"
        style={{
          ...modalContentStyle,
          ...(isHandmaidProtection ? handmaidModalStyle : {}),
        }}
      >
        {/* Crown decoration */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: isHandmaidProtection ? "#4caf50" : "#8b0000",
            border: `3px solid ${isHandmaidProtection ? "#8bc34a" : "#ffd700"}`,
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
          {isHandmaidProtection ? "🛡️" : "📜"}
        </div>

        <h3 style={headerStyle}>
          {isHandmaidProtection ? "Protected by the Handmaid" : "Effect Result"}
        </h3>

        <div style={messageStyle}>{formatText(resultText)}</div>

        {cardDetails && (
          <div style={cardDetailsStyle}>
            {Object.entries(cardDetails).map(([label, value]) => (
              <div key={label} style={detailRowStyle}>
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button
            onClick={onClose}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #fff 0%, #ffd700 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 25px rgba(255, 215, 0, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
            }}
          >
            {isHandmaidProtection ? "🍃 Very Well" : "Continue"}
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
  background: "linear-gradient(135deg, #1a4d1a 0%, #2e7d32 50%, #4caf50 100%)",
  border: "4px solid #8bc34a",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(139, 195, 74, 0.4), inset 0 1px 0 rgba(139, 195, 74, 0.3)",
};

const headerStyle = {
  background: "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
  color: "#ffd700",
  margin: "0",
  padding: "35px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: "2px solid #ffd700",
  borderRadius: "20px 20px 0 0",
  position: "relative",
};

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
