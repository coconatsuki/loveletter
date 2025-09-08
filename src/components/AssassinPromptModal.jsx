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
    buttons = (
      <button
        className="assassin-modal-btn assassin-modal-btn-acknowledge"
        onClick={onAcknowledge}
      >
        Continue
      </button>
    );
  } else if (!hasAssassin && isCorrectGuess) {
    message = `${attacker} played a Guard and guessed your strength (${guessedStrength}) correctly! You've been ELIMINATED.`;
    buttons = (
      <button
        className="assassin-modal-btn assassin-modal-btn-fate"
        onClick={onAcknowledge}
      >
        Face your fate
      </button>
    );
  } else if (hasAssassin && isCorrectGuess) {
    message = `🗡️ ${attacker} guessed your card exactly! But little did they know... you hold the Assassin! Time to stab them back!`;
    buttons = (
      <button
        className="assassin-modal-btn assassin-modal-btn-strike"
        onClick={onReveal}
      >
        ⚔️ Strike with Assassin
      </button>
    );
  } else if (hasAssassin && !isCorrectGuess) {
    message = `${attacker} guessed strength ${guessedStrength}, but you hold ${targetCard.name} (Strength ${targetCard.strength}). Reveal the Assassin anyway and smite them?`;
    buttons = (
      <div className="assassin-modal-btn-group">
        <button
          className="assassin-modal-btn assassin-modal-btn-strike"
          onClick={onReveal}
        >
          ⚔️ Reveal & Smite
        </button>
        <button
          className="assassin-modal-btn assassin-modal-btn-mercy"
          onClick={onIgnore}
        >
          🕊️ Let them live
        </button>
      </div>
    );
  }

  return (
    <div className="assassin-modal-overlay">
      <div className="assassin-modal-content">
        <div className="assassin-modal-header">
          <h3 className="assassin-modal-title">{title}</h3>
        </div>
        <div className="assassin-modal-body">
          <p className="assassin-modal-message">{message}</p>
        </div>
        <div className="assassin-modal-footer">{buttons}</div>
      </div>
    </div>
  );
}
