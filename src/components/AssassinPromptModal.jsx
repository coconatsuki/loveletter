import React from "react";

export default function AssassinPromptModal({
  mode,
  attacker,
  guess,
  card,
  onReveal,
  onIgnore,
  onAcknowledge,
}) {
  const isAssassin = card.id === 14;
  const isCorrectGuess = card.strength === guess;

  let title = "🛡️ You've been targeted!";
  let message = "";
  let buttons = null;

  if (!isAssassin && !isCorrectGuess) {
    message = `${attacker} played a Guard and guessed strength ${guess}, but you're holding ${card.name} (Strength ${card.strength}). You're safe... for now.`;
    buttons = <button onClick={onAcknowledge}>Continue</button>;
  } else if (!isAssassin && isCorrectGuess) {
    message = `${attacker} played a Guard and guessed your strength (${guess}) correctly. You've been eliminated.`;
    buttons = <button onClick={onAcknowledge}>Face your fate</button>;
  } else if (isAssassin && isCorrectGuess) {
    message = `🗡️ ${attacker} guessed your card exactly! But little did they know... you hold the Assassin! Time to stab them back!`;
    buttons = <button onClick={onReveal}>Strike with Assassin</button>;
  } else if (isAssassin && !isCorrectGuess) {
    message = `${attacker} guessed strength ${guess}, but you hold ${card.name} (Strength ${card.strength}). Reveal the Assassin anyway and smite them?`;
    buttons = (
      <>
        <button onClick={onReveal}>Reveal & Smite</button>
        <button onClick={onIgnore} style={{ marginLeft: "1rem" }}>
          Let them live
        </button>
      </>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={{ marginTop: "1rem" }}>{buttons}</div>
      </div>
    </div>
  );
}
