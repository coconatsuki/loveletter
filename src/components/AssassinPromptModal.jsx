export default function AssassinPromptModal({
  promptData,
  onReveal,
  onIgnore,
  onAcknowledge,
}) {
  const { attacker, guessedStrength, targetCard } = promptData;
  const hasAssassin = targetCard?.id === 14;
  const isCorrectGuess = promptData?.isCorrectGuess;

  let title = "🛡️ You've been targeted!";
  let message = "";
  let buttons = null;

  if (!hasAssassin && !isCorrectGuess) {
    message = `${attacker} played a Guard and guessed strength ${guessedStrength}, but you're holding ${targetCard.name} (Strength ${targetCard.strength}). You're safe... for now.`;
    buttons = <button onClick={onAcknowledge}>Continue</button>;
  } else if (!hasAssassin && isCorrectGuess) {
    message = `${attacker} played a Guard and guessed your strength (${guessedStrength}) correctly! You've been ELIMINATED.`;
    buttons = <button onClick={onAcknowledge}>Face your fate</button>;
  } else if (hasAssassin && isCorrectGuess) {
    message = `🗡️ ${attacker} guessed your card exactly! But little did they know... you hold the Assassin! Time to stab them back!`;
    buttons = <button onClick={onReveal}>Strike with Assassin</button>;
  } else if (hasAssassin && !isCorrectGuess) {
    message = `${attacker} guessed strength ${guessedStrength}, but you hold ${targetCard.name} (Strength ${targetCard.strength}). Reveal the Assassin anyway and smite them?`;
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
