import React from "react";

export default function PriestTargetModal({ attacker, targetCard }) {
  return (
    <div className="modal" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <h3 style={headerStyle}>🔮 Holy Revelation! 📿</h3>
        <p style={messageStyle}>
          <strong>{attacker}</strong> has played the Priest card and is peering
          into your soul!
        </p>
        <p style={messageStyle}>
          🙈⚡ Your <strong>{targetCard?.name || "card"}</strong> (Strength{" "}
          {targetCard?.strength || "?"}) is being revealed to them through
          divine magic!
        </p>
        <p style={lastMessageStyle}>
          📜 Fear not, noble one - this mystical peek has no other effect upon
          thee... 🏰
        </p>
      </div>
    </div>
  );
}

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
  padding: "0",
  borderRadius: "20px",
  width: "90%",
  textAlign: "center",
  position: "relative",
  fontFamily: '"Cinzel", serif',
  animation: "effectModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  maxWidth: "800px",
  background:
    "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 50%, rgb(139, 0, 0) 100%)",
  border: "4px solid #9b59b6",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(155, 89, 182, 0.4)",
};

const headerStyle = {
  background: "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)",
  color: "#ffd700",
  margin: "0",
  padding: "25px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: "2px solid #9b59b6",
  borderRadius: "20px 20px 0 0",
  position: "relative",
};

const messageStyle = {
  color: "#fff",
  marginTop: "3%",
};

const lastMessageStyle = {
  fontStyle: "italic",
  marginTop: "3%",
  color: "rgb(255, 215, 0)",
};
