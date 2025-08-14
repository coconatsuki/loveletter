import React from "react";

export default function EffectResultModal({
  resultText,
  cardDetails = null,
  onClose,
}) {
  console.log("EffectResultModal has been called! / resultText: ", resultText);

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Effect Result</h3>
        <p>{resultText}</p>

        {cardDetails && (
          <div style={{ marginTop: "1rem" }}>
            {Object.entries(cardDetails).map(([label, value]) => (
              <div key={label}>
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <button onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
}
