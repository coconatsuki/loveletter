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
        <h3 style={headerStyle}>
          {isHandmaidProtection
            ? "🛡️ Protected by the Handmaid"
            : "Effect Result"}
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
              e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
          >
            {isHandmaidProtection ? "🍃 Very Well" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced styling
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "linear-gradient(135deg, #f4f1e8 0%, #e8e0d0 100%)",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
  maxWidth: "450px",
  width: "90%",
  textAlign: "center",
  border: "3px solid #8b4513",
  position: "relative",
  fontFamily: '"Cinzel", serif',
};

const handmaidModalStyle = {
  background: "linear-gradient(135deg, #e8f5e8 0%, #d4f0d4 100%)",
  border: "3px solid #6B4423",
  boxShadow: "0 12px 40px rgba(107, 68, 35, 0.4)",
};

const headerStyle = {
  color: "#8b0000",
  marginBottom: "1.5rem",
  fontSize: "1.6rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
};

const messageStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.6",
  color: "#2c1810",
  marginBottom: "1.5rem",
  padding: "1.2rem",
  background: "linear-gradient(135deg, #fefcf8 0%, #f8f5f0 100%)",
  borderRadius: "10px",
  border: "2px solid #d4af37",
  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  fontFamily: '"Lora", serif',
  fontStyle: "italic",
};

const cardDetailsStyle = {
  marginTop: "1rem",
  padding: "1.2rem",
  background: "linear-gradient(135deg, #f8f5f0 0%, #f0ead6 100%)",
  borderRadius: "10px",
  textAlign: "left",
  border: "2px solid #d4af37",
  fontFamily: '"Lora", serif',
};

const detailRowStyle = {
  marginBottom: "0.5rem",
  color: "#2c1810",
};

const buttonContainerStyle = {
  marginTop: "1.5rem",
};

const buttonStyle = {
  padding: "1rem 2rem",
  fontSize: "1.1rem",
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
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
};
