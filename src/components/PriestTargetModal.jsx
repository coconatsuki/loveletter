import React from "react";

export default function PriestTargetModal({ attacker, targetCard }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>🔮 Holy Revelation! 📿</h3>
        <p>
          <strong>{attacker}</strong> has played the Priest card and is peering into your soul! 
        </p>
        <p>
          🙈⚡ Your <strong>{targetCard?.name || "card"}</strong> (Strength {targetCard?.strength || "?"}) 
          is being revealed to them through divine magic!
        </p>
        <p style={{ fontStyle: "italic", color: "#666", marginTop: "1rem" }}>
          📜 Fear not, noble one - this mystical peek has no other effect upon thee... 🏰
        </p>
      </div>
    </div>
  );
}
