import { ref, update, get } from "firebase/database";
import { db } from "./firebase";
import { cards } from "./cardsData";
import { handleCardDiscard, handlePlayerElimination } from "./gamehelpers";

// Turn advancement control for modal system
export const CARD_MODAL_FLOW = {
  0: { advanceOnAttacker: true, advanceOnTarget: false }, // Jester
  1: { advanceOnAttacker: true, advanceOnTarget: false }, // Guard
  2: { advanceOnAttacker: true, advanceOnTarget: false }, // Priest
  3: { advanceOnAttacker: true, advanceOnTarget: false }, // Baron
  4: { advanceOnAttacker: true, advanceOnTarget: false }, // Handmaid
  5: { advanceOnAttacker: false, advanceOnTarget: true }, // Prince (special case)
  6: { advanceOnAttacker: true, advanceOnTarget: false }, // Phantom King
  7: { advanceOnAttacker: true, advanceOnTarget: false }, // Countess
  8: { advanceOnAttacker: true, advanceOnTarget: false }, // Princess
  9: { advanceOnAttacker: true, advanceOnTarget: false }, // Inquisitor (target modal controls flow)
  10: { advanceOnAttacker: true, advanceOnTarget: false }, // Chamberlain
  11: { advanceOnAttacker: true, advanceOnTarget: false }, // Regent Queen
  12: { advanceOnAttacker: true, advanceOnTarget: false }, // Court Whisperer
  14: { advanceOnAttacker: true, advanceOnTarget: false }, // Assassin
  16: { advanceOnAttacker: true, advanceOnTarget: false }, // Duke
  // Premium mode cards will be added as we implement them...
};

export function shouldAdvanceTurnOnModal(cardId, isAttacker) {
  const flow = CARD_MODAL_FLOW[cardId];
  if (!flow) return isAttacker; // Default: attacker advances

  console.log(
    "shouldAdvanceTurnOnModal / isAttacker: ",
    isAttacker,
    " / function returns: ",
    isAttacker ? flow.advanceOnAttacker : flow.advanceOnTarget
  );

  return isAttacker ? flow.advanceOnAttacker : flow.advanceOnTarget;
}

const cardStrengths = {
  0: 0, // Jester
  1: 1, // Guard
  2: 2, // Priest
  3: 3, // Baron
  4: 4, // Handmaid
  5: 5, // Prince
  6: 6, // Phantom King
  7: 7, // Countess
  8: 8, // Princess
  9: 9, // Inquisitor
  10: 6, // Chamberlain
  11: 7, // Regent Queen
  12: 4, // Court Whisperer
  13: 2, // Royal Confessor
  14: 0, // Assassin
  15: 3, // Baroness
  16: 5, // Duke
};

// 🃏✨ JESTER EFFECT ✨🃏
export async function applyJesterEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  if (!data || !data.players || !data.players[target]) {
    return {
      result: "error",
      message: "Target player not found",
    };
  }

  const attackerPlayer = data.players[attacker];
  const targetPlayer = data.players[target];

  if (!attackerPlayer || !targetPlayer) {
    return {
      result: "error",
      message: "Player not found",
    };
  }

  // Give the Jester token to the target
  const updates = {
    [`players/${target}/jesterToken`]: { giver: attacker },
  };

  await update(ref(db, `rooms/${roomCode}`), updates);

  return {
    result: "jesterToken",
    attacker,
    target,
    // 🎭 Colorful, joyful medieval narrative! 🎭
    attackerMessage: `<div class="effect-description">🎭✨ With a laugh and a bow, you hand the <span class="effect-card">Fool's Favor</span> to <span class="effect-player">${targetPlayer.name}</span>!</div><div class="effect-description">🎪💎 If they should win, this shiny charm will also bring you the Princess's affection! 👑💕</div>`,
    targetMessage: `<div class="effect-description">🃏🎪 The Jester dances before you, pressing into your hand a shiny charm:</div><div class="effect-description">✨💍 "Keep it close, my friend, and the Princess will surely smile on you!" It feels more like a joke than a gift... but you cannot refuse. 🎭😊</div>`,
    publicMessage: `<div class="effect-description">🎭🎪 <span class="effect-player">${attackerPlayer.name}</span> handed the <span class="effect-card">Fool's Favor</span> to <span class="effect-player">${targetPlayer.name}</span>!</div><div class="effect-description">🃏✨ The court laughs — is it a gift, or a trick? 😄🎪</div>`,
  };
}

// 🏰💰 CHAMBERLAIN EFFECT 💰🏰
export async function applyChamberlainEffect({ roomCode, attacker }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  if (!data || !data.players || !data.players[attacker]) {
    return {
      result: "error",
      message: "Attacker player not found",
    };
  }

  const attackerPlayer = data.players[attacker];

  return {
    result: "chamberlainInfluence",
    attacker,
    // 🏰💰 Rich, powerful, and slightly dramatic medieval narrative! 💰🏰
    attackerMessage: `<div class="effect-description">🏰✨ You have secured the loyalty of the <span class="effect-card">Royal Chamberlain</span> — keeper of golden keys, guardian of royal secrets, and master of the crown's purse!</div><div class="effect-description">💰🗝️ This shrewd ally whispers in the right ears... Should misfortune befall you this round, the Chamberlain's influence shall ensure your sacrifice earns the Princess's favor! 👑💎</div>`,
    publicMessage: `<div class="effect-description">🏰💰 <span class="effect-player">${attackerPlayer.name}</span> has gained the <span class="effect-card">Royal Chamberlain's</span> favor!</div><div class="effect-description">🗝️✨ Even in defeat, such powerful allies ensure victory... The court whispers of golden influence! 💎👑</div>`,
  };
}

export async function applyGuardEffect({ roomCode, attacker, target, guess }) {
  // Guard rule: You cannot guess Guard (strength 1)
  if (guess === 1) {
    return {
      requiresPrompt: false,
      target,
      attacker,
      hasAssassin: false,
      guessedStrength: guess,
      actualStrength: null,
      isCorrectGuess: false,
      targetCard: null,
      result: "wrongGuess",
      eliminatedPlayer: null,
      error: "Cannot guess Guard (strength 1)",
    };
  }

  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const targetPlayer = data.players[target];
  const targetCard = targetPlayer.hand[0];

  const hasAssassin = targetCard.id === 14;
  const wasCorrect = targetCard.strength === guess;

  return {
    requiresPrompt: true, // Always show prompt to maintain mystery (both normal & premium)
    target,
    attacker,
    hasAssassin,
    guessedStrength: guess,
    actualStrength: targetCard.strength,
    isCorrectGuess: wasCorrect,
    targetCard,
    result: wasCorrect ? "correctGuess" : "wrongGuess",
    eliminatedPlayer: wasCorrect ? target : null,
  };
}

export async function resolveAssassinDefense({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const deck = data.round.deck || [];

  const draw = deck.length > 0 ? deck[0] : null;
  const newDeck = deck.slice(1);

  // Get the full Assassin card object from cards data
  const assassinCard = cards.find((card) => card.id === 14);

  // Immediate effects: Discard Assassin (full card object) + Draw new card for target
  // BUT do NOT eliminate attacker yet - that happens when they click "Continue"
  const baseUpdates = {
    // Discard the full Assassin card object with all properties
    [`players/${target}/discard`]: [
      ...(data.players[target].discard || []),
      assassinCard,
    ],
    // Give target a new card from deck
    [`players/${target}/hand`]: draw ? [draw] : [],
    // Update deck
    [`round/deck`]: newDeck,
    // Set elimination flag for attacker - they'll be eliminated when they confirm modal
    [`round/pendingAssassinationTarget`]: attacker,
  };

  // Handle card discard and check for special tokens (like Chamberlain)
  const finalUpdates = handleCardDiscard({
    roomCode,
    playerName: target,
    card: assassinCard,
    gameMode: data?.mode,
    existingUpdates: baseUpdates,
  });

  await update(ref(db, `rooms/${roomCode}`), finalUpdates);

  console.log(
    "🗡️ ASSASSIN DEFENSE: Immediate effects applied - Card discarded, new card drawn, attacker marked for elimination"
  );

  return {
    attackerMarkedForElimination: true,
    newCard: draw,
    // Return full card data for display
    discardedCard: assassinCard,
  };
}

export async function executeAssassinationElimination({ roomCode }) {
  console.log("🗡️ EXECUTION: Eliminating attacker marked by Assassin");

  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const targetPlayer = data.round?.pendingAssassinationTarget;

  if (!targetPlayer) {
    console.log("🗡️ EXECUTION: No pending assassination target");
    return { eliminated: false };
  }

  // Eliminate the marked attacker and clear the flag
  const baseUpdates = {
    [`round/pendingAssassinationTarget`]: null,
  };

  const finalUpdates = handlePlayerElimination(
    roomCode,
    targetPlayer,
    data?.mode,
    data.players[targetPlayer],
    baseUpdates
  );

  await update(ref(db, `rooms/${roomCode}`), finalUpdates);

  console.log(
    `🗡️ EXECUTION: ${targetPlayer} has been eliminated by the Assassin`
  );

  return {
    eliminated: true,
    eliminatedPlayer: targetPlayer,
  };
}

export async function applyPriestEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  if (!data || !data.players || !data.players[target]) {
    return {
      result: "error",
      message: "Priest Target player not found",
    };
  }

  const targetPlayer = data.players[target];

  if (!targetPlayer || !targetPlayer.hand || targetPlayer.hand.length === 0) {
    return {
      result: "error",
      message: "Priest Target has no cards",
    };
  }

  const targetCard = targetPlayer.hand[0];

  /*
  const cardData = cards.find((c) => c.id === targetCard.id);
   const enrichedTargetCard = {
    ...targetCard,
    effect: cardData?.effect || "Unknown card effect",
  }; */

  console.log("PRIEST CARD DATA - contains count & effect? => ", targetCard);

  return {
    result: "revealCard",
    attacker,
    target,
    targetCard,
    // Fun medieval notification messages 🏰
    attackerMessage: `
<div class="effect-description justify top">⛪✨ The priest lifts his eyes to the heavens, murmuring a prayer for your generous donation.</div>
<div class="effect-description justify">A halo of light swirls above his head before he gasps — <span class="quotation">“Ah! The truth is revealed!”</span></div>
<div class="effect-description justify">💫 Through divine sight, you glimpse into <span class="effect-player">${targetPlayer.name}</span>’s soul…</div>
<div class="effect-description justify">Their secret ally is <span class="effect-card">${targetCard.name}</span> (Strength <span class="effect-strength">${targetCard.strength}</span>).</div>`,
    targetMessage: `
<div class="effect-description top">🙈⚡ The Priest turns his shining gaze upon you, murmuring words too ancient to follow.</div>
<div class="effect-description"><span class="quotation">“The soul hides nothing from the light,”</span> he declares, peering straight through your composure.</div>
<div class="effect-description">You feel the chill of divine intrusion — your trusted ally, the <span class="effect-card">${targetCard.name}</span>, who could have helped you in this game of love (and throne!), has been revealed to <span class="effect-player">${attacker}</span>!</div>`,
    publicMessage: `
<div class="effect-description">🔮📿 <span class="effect-player">${attacker}</span> seeks the Priest’s divine guidance.</div>
<div class="effect-description">A blinding light flashes as he glimpses into <span class="effect-player">${targetPlayer.name}</span>’s soul — the court falls silent under heaven’s gaze. ✨</div>`,
  };
}

export async function applyBaronEffect({
  roomCode,
  attacker,
  target,
  playedCardIndex,
}) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  // Get the attacker's hand (should have 2 cards at this point)
  const attackerHand = data.players[attacker].hand;

  // The attackerCard should be the OTHER card (not the Baron being played)
  const attackerCard =
    playedCardIndex === 0 ? attackerHand[1] : attackerHand[0];
  const targetCard = data.players[target].hand[0];

  let eliminatedPlayer = null;
  let winner = null;
  let winnerCard = null;
  let loserCard = null;

  // Compare card strengths - lower strength is eliminated
  if (attackerCard.strength > targetCard.strength) {
    eliminatedPlayer = target;
    winner = attacker;
    winnerCard = attackerCard;
    loserCard = targetCard;
  } else if (targetCard.strength > attackerCard.strength) {
    eliminatedPlayer = attacker;
    winner = target;
    winnerCard = targetCard;
    loserCard = attackerCard;
  }
  // If strengths are equal, it's a tie - no elimination

  // NOTE: We do NOT eliminate the player here - that will be done when the modal is confirmed
  // The Baron effect only compares cards and returns the result
  // Elimination happens in the modal confirmation flow to maintain proper game state

  return {
    requiresPrompt: false,
    attacker,
    target,
    attackerCard,
    targetCard,
    eliminatedPlayer,
    winner,
    isTie: !eliminatedPlayer,
    result: eliminatedPlayer ? "elimination" : "tie",
    // Medieval notifications for different audiences
    attackerMessage:
      eliminatedPlayer === target
        ? `<div class="effect-description">⚔️🏆 Your Baron's duel is victorious! Your <span class="effect-card">${
            attackerCard.name
          }</span> (<span class="effect-strength">${
            attackerCard.strength
          }</span>) defeats <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            targetCard.name
          }</span> (<span class="effect-strength">${
            targetCard.strength
          }</span>). <span class="effect-warning">They are eliminated from the round!</span></div>`
        : eliminatedPlayer === attacker
        ? `<div class="effect-description">⚔️💀 Your Baron's duel ends in defeat! Your <span class="effect-card">${
            attackerCard.name
          }</span> (<span class="effect-strength">${
            attackerCard.strength
          }</span>) falls to <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            targetCard.name
          }</span> (<span class="effect-strength">${
            targetCard.strength
          }</span>). <span class="effect-warning">You are eliminated!</span></div>`
        : `<div class="effect-description">⚔️🤝 An honorable draw! Your <span class="effect-card">${
            attackerCard.name
          }</span> (<span class="effect-strength">${
            attackerCard.strength
          }</span>) matches <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            targetCard.name
          }</span> (<span class="effect-strength">${
            targetCard.strength
          }</span>). Both knights live to fight another day!</div>`,

    targetMessage:
      eliminatedPlayer === target
        ? `<div class="effect-description top">⚔️💀 A Baron challenges you to a duel and emerges victorious! Their <span class="effect-card">${attackerCard.name}</span> (<span class="effect-strength">${attackerCard.strength}</span>) defeats your <span class="effect-card">${targetCard.name}</span> (<span class="effect-strength">${targetCard.strength}</span>). <span class="effect-warning">You are eliminated from the round!</span></div>`
        : eliminatedPlayer === attacker
        ? `<div class="effect-description">⚔️🏆 A Baron challenges you to a duel but you triumph! Your <span class="effect-card">${targetCard.name}</span> (<span class="effect-strength">${targetCard.strength}</span>) defeats their <span class="effect-card">${attackerCard.name}</span> (<span class="effect-strength">${attackerCard.strength}</span>). <span class="effect-success">The challenger is eliminated!</span></div>`
        : `<div class="effect-description">⚔️🤝 A Baron challenges you to an honorable duel! Your <span class="effect-card">${targetCard.name}</span> (<span class="effect-strength">${targetCard.strength}</span>) matches their <span class="effect-card">${attackerCard.name}</span> (<span class="effect-strength">${attackerCard.strength}</span>). 'Tis a tie - both knights stand strong!</div>`,

    publicMessage: eliminatedPlayer
      ? `<div class="effect-description">⚖️💥 <span class="effect-player">${
          data.players[attacker]?.name || attacker
        }</span> plays Baron and challenges <span class="effect-player">${
          data.players[target]?.name || target
        }</span> to a duel of honor! <span class="effect-card">${
          loserCard.name
        }</span> (<span class="effect-strength">${
          loserCard.strength
        }</span>) falls to superior strength - <span class="effect-warning">${
          data.players[eliminatedPlayer]?.name || eliminatedPlayer
        } is eliminated!</span> ⚔️👑</div>`
      : `<div class="effect-description">⚖️🤝 <span class="effect-player">${
          data.players[attacker]?.name || attacker
        }</span> plays Baron and challenges <span class="effect-player">${
          data.players[target]?.name || target
        }</span> to a duel! Both cards match in strength - an honorable draw with no casualties! 🛡️✨</div>`,
  };
}

export async function applyRegentQueenEffect({
  roomCode,
  attacker,
  target,
  playedCardIndex,
}) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  // Get the attacker's hand (should have 2 cards at this point)
  const attackerHand = data.players[attacker].hand;

  // The attackerCard should be the OTHER card (not the Regent Queen being played)
  const attackerCard =
    playedCardIndex === 0 ? attackerHand[1] : attackerHand[0];
  const targetCard = data.players[target].hand[0];

  // Enrich card data with names and effects from cardsData
  const enrichedAttackerCard =
    cards.find((c) => c.id === attackerCard.id) || attackerCard;
  const enrichedTargetCard =
    cards.find((c) => c.id === targetCard.id) || targetCard;

  let eliminatedPlayer = null;
  let winner = null;
  let winnerCard = null;
  let loserCard = null;

  // Compare card strengths - HIGHER strength is eliminated (inverse of Baron)
  if (attackerCard.strength > targetCard.strength) {
    eliminatedPlayer = attacker; // Attacker eliminated if they have higher strength
    winner = target;
    winnerCard = enrichedTargetCard;
    loserCard = enrichedAttackerCard;
  } else if (targetCard.strength > attackerCard.strength) {
    eliminatedPlayer = target; // Target eliminated if they have higher strength
    winner = attacker;
    winnerCard = enrichedAttackerCard;
    loserCard = enrichedTargetCard;
  }
  // If strengths are equal, it's a tie - no elimination

  // NOTE: We do NOT eliminate the player here - that will be done when the modal is confirmed
  // The Regent Queen effect only compares cards and returns the result
  // Elimination happens in the modal confirmation flow to maintain proper game state

  return {
    requiresPrompt: false,
    attacker,
    target,
    attackerCard: enrichedAttackerCard,
    targetCard: enrichedTargetCard,
    eliminatedPlayer,
    winner,
    isTie: !eliminatedPlayer,
    result: eliminatedPlayer ? "elimination" : "tie",

    // Dark magical notifications for different audiences
    attackerMessage:
      eliminatedPlayer === target
        ? `<div class="effect-description">🪞👑 The Regent Queen's mirror reveals your victory! Your <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>) reflects weakly while <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>) shatters under its own power. <span class="effect-warning">They are consumed by their strength!</span></div>`
        : eliminatedPlayer === attacker
        ? `<div class="effect-description">🪞💀 The mirror's cruel truth condemns you! Your <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>) proves too powerful and turns against you, while <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>) survives the reflection. <span class="effect-warning">You are eliminated by your own might!</span></div>`
        : `<div class="effect-description">🪞⚖️ The mirror shows perfect balance! Your <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>) reflects equally with <span class="effect-player">${
            data.players[target]?.name || target
          }</span>'s <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>). The dark magic spares both souls this day!</div>`,

    targetMessage:
      eliminatedPlayer === target
        ? `<div class="effect-description">🪞💀 The Regent Queen's mirror turns against you! Your <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>) proves too mighty and consumes you, while <span class="effect-player">${
            data.players[attacker]?.name || attacker
          }</span>'s <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>) survives through weakness. <span class="effect-warning">You are eliminated by your own power!</span></div>`
        : eliminatedPlayer === attacker
        ? `<div class="effect-description">🪞🏆 The dark mirror favors you! <span class="effect-player">${
            data.players[attacker]?.name || attacker
          }</span>'s <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>) shatters under its own reflection while your <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>) remains whole. <span class="effect-success">The challenger falls to their own strength!</span></div>`
        : `<div class="effect-description">🪞⚖️ The Regent Queen's mirror shows equality! Your <span class="effect-card">${
            enrichedTargetCard.name
          }</span> (<span class="effect-strength">${
            enrichedTargetCard.strength
          }</span>) reflects perfectly with <span class="effect-player">${
            data.players[attacker]?.name || attacker
          }</span>'s <span class="effect-card">${
            enrichedAttackerCard.name
          }</span> (<span class="effect-strength">${
            enrichedAttackerCard.strength
          }</span>). The cursed magic finds no victim this turn!</div>`,

    publicMessage: eliminatedPlayer
      ? `The Regent Queen, ever protective of her influence, took an interest in the suitor ${
          data.players[attacker]?.name || attacker
        }. Not long after, ${
          data.players[eliminatedPlayer]?.name || eliminatedPlayer
        } vanished from the court. The Queen's idea of 'help,' it seems, is a dangerous blessing. 👑💀`
      : `The Regent Queen studied both suitors carefully. '${
          data.players[attacker]?.name || attacker
        }' and '${
          data.players[target]?.name || target
        }' - both show promise,' she mused. 'You may both remain... for now.' 👑⚖️`,
  };
}

export async function applyPrinceEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  if (!data || !data.players[target]) {
    return {
      requiresPrompt: false,
      result: "error",
      error: "Invalid target player",
    };
  }

  const targetPlayer = data.players[target];
  const targetCard = targetPlayer.hand[0]; // Target's current card
  const deck = data.round.deck || [];
  const isSelfTarget = attacker === target;

  // Discard target's card
  const newTargetDiscard = [...(targetPlayer.discard || []), targetCard];

  // Check if Princess was discarded (instant elimination!)
  const wasPrincessDiscarded = targetCard.id === 8;

  let newHand = [];
  let deckAfterDraw = [...deck];
  let drewNewCard = false;
  let newCard = null;

  // Draw new card if deck isn't empty and Princess wasn't discarded
  if (!wasPrincessDiscarded && deckAfterDraw.length > 0) {
    newCard = deckAfterDraw.pop(); // Draw from top
    newHand = [newCard];
    drewNewCard = true;
  }

  // Update Firebase
  const baseUpdates = {
    [`players/${target}/hand`]: newHand,
    [`players/${target}/discard`]: newTargetDiscard,
    [`round/deck`]: deckAfterDraw,
  };

  // Handle card discard and check for special tokens (like Chamberlain)
  let finalUpdates = handleCardDiscard({
    roomCode,
    playerName: target,
    card: targetCard,
    gameMode: data?.mode,
    existingUpdates: baseUpdates,
  });

  // If Princess was discarded, eliminate the target
  if (wasPrincessDiscarded) {
    finalUpdates = handlePlayerElimination(
      roomCode,
      target,
      data?.mode,
      data.players[target],
      finalUpdates
    );
  }

  await update(ref(db, `rooms/${roomCode}`), finalUpdates);

  // Generate royal messages! 👑✨
  const attackerName = data.players[attacker]?.name || attacker;
  const targetName = data.players[target]?.name || target;
  const discardedCardName = targetCard.name;
  const newCardName = newCard?.name || "none";

  let publicMessage, attackerMessage, targetMessage;

  if (wasPrincessDiscarded) {
    // Princess elimination scenario! 😱💀
    if (isSelfTarget) {
      publicMessage = `<div class="effect-description">👑💀 OH NO! <span class="effect-player">${attackerName}</span> commanded themselves to discard... and revealed the <span class="effect-card">PRINCESS</span>! <span class="effect-warning">They are eliminated from the royal court!</span> The Princess cannot be discarded! 💀👑</div>`;
      attackerMessage = `<div class="effect-title">👑💀 ROYAL TRAGEDY! 💀👑</div>
      <div class="effect-description">By your own royal decree, you commanded yourself to discard your hand...</div>
      <div class="effect-description">But alas! You held the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-warning">💀 The Princess cannot be discarded for any reason!</div>
      <div class="effect-warning">💀 You are eliminated from the round!</div>
      <div class="effect-quote">"Even royalty must follow the rules of love..."</div>
      <div class="effect-signature">- The Court</div>`;
    } else {
      publicMessage = `<div class="effect-description">👑💀 ROYAL CATASTROPHE! <span class="effect-player">${attackerName}</span> commanded <span class="effect-player">${targetName}</span> to discard their hand... revealing the <span class="effect-card">PRINCESS</span>! <span class="effect-warning">${targetName} is eliminated!</span> The Princess's beauty cannot be discarded! 💀👑</div>`;
      attackerMessage = `<div class="effect-title">👑💀 ROYAL CATASTROPHE! 💀👑</div>
      <div class="effect-description">Your royal decree was followed...</div>
      <div class="effect-description">But <span class="effect-player">${targetName}</span> held the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-description">Discarded Card: <span class="effect-card">${discardedCardName}</span> (Strength: <span class="effect-strength">${targetCard.strength}</span>)</div>
      <div class="effect-warning">💀 The Princess cannot be discarded!</div>
      <div class="effect-warning">💀 ${targetName} is eliminated!</div>
      <div class="effect-quote">"Love's greatest treasure cannot be cast aside..."</div>
      <div class="effect-signature">- The Royal Court</div>`;
      targetMessage = `<div class="effect-title">👑💀 ROYAL DOOM! 💀👑</div>

      <div class="effect-description"><span class="effect-player">${attackerName}</span> commanded you with the Prince's authority to discard your hand...</div>

      <div class="effect-description">Your card was: <span class="effect-card">${discardedCardName}</span> (Strength: <span class="effect-strength">${targetCard.strength}</span>)</div>

      <div class="effect-description">But... it was the <span class="effect-card">PRINCESS</span>! 💀</div>

      <div class="effect-warning">The Princess cannot be discarded for any reason!</div>
      <div class="effect-warning">You are eliminated from the round!</div>

      <div class="effect-quote">"Even under royal command, love cannot be discarded..."</div>
      <div class="effect-signature">- The Princess</div>`;
    }
  } else {
    // Normal Prince effect
    if (isSelfTarget) {
      publicMessage = `<div class="effect-description">👑✨ <span class="effect-player">${attackerName}</span> uses the Prince's wisdom on themselves! They discard <span class="effect-card">${discardedCardName}</span> and ${
        drewNewCard
          ? `draw <span class="effect-card">${newCardName}</span>`
          : "find no cards left in the royal deck"
      }! A fresh start from the royal court! ✨👑</div>`;
      attackerMessage = `<div class="effect-title">👑✨ ROYAL SELF-REFLECTION! ✨👑</div>

      <div class="effect-description">By your own royal decree, you have renewed your hand!</div>

      <div class="effect-description">Discarded: <span class="effect-card">${discardedCardName}</span> (Strength: <span class="effect-strength">${
        targetCard.strength
      }</span>)</div>
      ${
        drewNewCard
          ? `<div class="effect-description">New Card: <span class="effect-card">${newCardName}</span> (Strength: <span class="effect-strength">${newCard.strength}</span>)</div>`
          : `<div class="effect-warning">No cards remain in the royal deck!</div>`
      }

      <div class="effect-quote">"Wisdom lies in knowing when to start anew..."</div>
      <div class="effect-signature">- His Royal Highness, The Prince</div>`;
    } else {
      publicMessage = `<div class="effect-description">👑✨ <span class="effect-player">${attackerName}</span> commands <span class="effect-player">${targetName}</span> with the Prince's authority! <span class="effect-player">${targetName}</span> discards <span class="effect-card">${discardedCardName}</span> and ${
        drewNewCard ? `draws a fresh card` : "finds the royal deck empty"
      }! By royal decree! ✨👑</div>`;
      attackerMessage = `<div class="effect-title">👑✨ ROYAL DECREE EXECUTED! ✨👑</div>

      <div class="effect-description">Your command has been followed!</div>
      <div class="effect-description"><span class="effect-player">${targetName}</span> discarded: <span class="effect-card">${discardedCardName}</span> (Strength: <span class="effect-strength">${
        targetCard.strength
      }</span>)</div>
      ${
        drewNewCard
          ? `<div class="effect-success">They drew a new card from the royal deck!</div>`
          : `<div class="effect-warning">The royal deck was empty - no new card drawn!</div>`
      }

      <div class="effect-quote">"The Prince's wisdom guides the court..."</div>
      <div class="effect-signature">- The Royal Court</div>`;
      targetMessage = `<div class="effect-title">👑✨ ROYAL COMMAND! ✨👑</div>

      <div class="effect-description"><span class="effect-player">${attackerName}</span> has commanded you with the Prince's authority!</div>

      <div class="effect-description">Your discarded card: <span class="effect-card">${discardedCardName}</span> (Strength: <span class="effect-strength">${
        targetCard.strength
      }</span>)</div>
      ${
        targetCard.effect
          ? `<div class="effect-description">Effect: ${targetCard.effect}</div>`
          : ""
      }

      ${
        drewNewCard
          ? `<div class="effect-description">Your new card: <span class="effect-card">${newCardName}</span> (Strength: <span class="effect-strength">${
              newCard.strength
            }</span>)</div>
            ${
              newCard.effect
                ? `<div class="effect-description">Effect: ${newCard.effect}</div>`
                : ""
            }`
          : `<div class="effect-warning">The royal deck was empty - you draw no new card!</div>`
      }

      <div class="effect-quote">"By royal decree, a fresh beginning awaits..."</div>
      <div class="effect-signature">- His Royal Highness, The Prince</div>`;
    }
  }

  return {
    requiresPrompt: false,
    result: wasPrincessDiscarded ? "princessEliminated" : "cardSwapped",
    attacker,
    target,
    isSelfTarget,
    discardedCard: targetCard,
    newCard: drewNewCard ? newCard : null,
    wasPrincessDiscarded,
    eliminatedPlayer: wasPrincessDiscarded ? target : null,
    publicMessage,
    attackerMessage,
    targetMessage: isSelfTarget ? null : targetMessage, // No separate target message if self-targeting
  };
}

export async function applyKingEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  const attackerCard = data.players[attacker].hand[0];
  const targetCard = data.players[target].hand[0];

  const updates = {
    [`players/${attacker}/hand`]: [targetCard],
    [`players/${target}/hand`]: [attackerCard],
  };

  await update(ref(db, `rooms/${roomCode}`), updates);

  return {
    attackerCard,
    targetCard,
  };
}

export async function applyHandmaidEffect({ roomCode, player }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  // Get current protected players array (or initialize if doesn't exist)
  const currentProtected = data.protectedPlayers || [];

  // Add this player to protected players if not already there
  const updatedProtected = currentProtected.includes(player)
    ? currentProtected
    : [...currentProtected, player];

  // Update Firebase with new protected players list
  await update(ref(db, `rooms/${roomCode}`), {
    protectedPlayers: updatedProtected,
  });

  return {
    requiresPrompt: false,
    result: "protection",
    protectedPlayer: player,
    // Cozy medieval notification for everyone
    publicMessage: `<div class="effect-description">🫖✨ <span class="effect-player">${
      data.players[player]?.name || player
    }</span> calls upon the Princess' Handmaid! She graciously invites them for tea and biscuits in her cozy chambers. <span class="effect-success">They are now protected until their next turn!</span> ☕🛡️</div>`,
    // Personal message for the protected player's modal
    playerMessage: `<div class="effect-description">The Princess' loyal Handmaid has taken you under her wing! She invites you for tea and biscuits in her cozy chambers.</div>
    <div class="effect-success">☕ Protection Status: ACTIVE ☕</div>
    <div class="effect-description">⏰ Duration: Until your next turn begins</div>
    <div class="effect-description">🛡️ Effect: You cannot be targeted by any cards</div>
    <div class="effect-quote">"Come, dear guest, let us chat by the fireplace while the others play their games. You're safe with me!"</div>
    <div class="effect-signature">- The Princess' Handmaid</div>`,
  };
}

export async function applyCountessEffect({ roomCode, player }) {
  try {
    const gameRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error("The royal chambers have vanished...");
    }

    const gameData = snapshot.val();
    const playerData = gameData.players[player];

    console.log("🎭 COUNTESS: Royal presence confirmed", {
      player,
      hand: playerData.hand,
    });

    return {
      result: "countess_played",
      message: `The Countess has graced the court with her presence!`,
      // Royal notification for everyone in the court
      publicMessage: `<div class="effect-description">🎭✨ The Countess herself has appeared in court with <span class="effect-player">${
        playerData.name || player
      }</span>! Her regal presence commands attention as she whispers secrets of court intrigue. What royal machinations are afoot? 👑💫</div>`,
      // Personal message for the player's modal (if needed)
      playerMessage: `<div class="effect-title">🎭✨ THE COUNTESS ✨🎭</div>

      <div class="effect-description">You have played the Countess!</div>

      <div class="effect-description">👑 Royal Effect: None.</div>
      <div class="effect-description">🎪 Protocol: Always takes precedence over the Prince or the King, for matters related to the Princess.</div>

      <div class="effect-quote">"My dear, no one knows the Princess as I do. Let me handle that."</div>
      <div class="effect-signature">- The Countess</div>`,
    };
  } catch (error) {
    console.error("🎭 COUNTESS ERROR: Royal scandal!", error);
    return {
      result: "error",
      message: "The Countess encountered a royal mishap!",
    };
  }
}

export async function applyAssassinEffect({ roomCode, player }) {
  console.log("🗡️ ASSASSIN DEBUG: A shadow moves in the court...", {
    player,
  });

  try {
    const gameRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error("The shadows have consumed the royal chambers...");
    }

    const gameData = snapshot.val();
    const playerData = gameData.players[player];

    console.log("🗡️ ASSASSIN: Shadow confirmed", {
      player,
      hand: playerData.hand,
    });

    return {
      result: "assassin_played",
      message: `A shadow passes through the court...`,
      // Mysterious notification for everyone in the court
      publicMessage: `<div class="effect-description">🌙🐾 A shadow glides silently through the corridors... Was it merely a cat, or something far more sinister? <span class="effect-player">${
        playerData.name || player
      }</span> seems to have noticed something, but speaks not a word. The court remains unaware of the deadly grace that moves among them... 🕯️✨</div>`,
      // Personal dramatic message for the player's modal
      playerMessage: `<div class="effect-title">🗡️🌙 THE ROYAL ASSASSIN 🌙🗡️</div>

      <div class="effect-description">You have played the Assassin!</div>

      <div class="effect-description">🐾 A shadow passes through the court like a whisper of silk...</div>
      <div class="effect-description">🌙 Your lethal asset slips away unnoticed, but your opportunity for a decisive strike is now lost.</div>

      <div class="effect-quote">"The darkness is patient. It waits for the perfect moment to strike."</div>
      <div class="effect-signature">- A Voice from the Shadows</div>`,
    };
  } catch (error) {
    console.error("🗡️ ASSASSIN ERROR: Shadow compromised!", error);
    return {
      result: "error",
      message: "The shadows encountered an unexpected obstacle!",
    };
  }
}

export async function applyPhantomKingEffect({ attacker, target }) {
  const returnValue = {
    result: "success",

    // New formatted messages
    attackerMessage: `<div class="effect-description phantom-king top">From nowhere, you hear a loud hiccup. The ghost of the King floats in, crown crooked, wine cup in hand. 👻🍷</div>
      <div class="effect-description phantom-king"><span class="quotation">'Ah! My favorite suitor!'</span> he says. <span class="quotation">'Let me fix this little love mess for you!'</span></div>
      <div class="effect-description phantom-king">He waves his cup, spilling ghost-wine everywhere — and suddenly, your standing in the court… changes.</div>
      <div class="effect-description phantom-king">Whether that's good or bad, only the future will tell.</div>`,

    targetMessage: `<div class="effect-description phantom-king top">✨ A ghostly burp echoes through the hall. The Phantom King wobbles before you, trying to pat your shoulder but missing by several inches.</div>
      <div class="effect-description phantom-king"><span class="quotation">'Ha! I'd rather have ${attacker} sit on my throne than you!'</span> he declares, then spins in a dramatic swirl that somehow changes your fate.</div>
      <div class="effect-description phantom-king">When the ghost fades, the only thing left is confusion… and the faint sound of laughter. 👻</div>`,

    publicMessage: `<div class="effect-description">👻🍷 The Phantom King showed up again, 'helping' one suitor at the expense of another. No one's quite sure what changed — but the throne room smells faintly of brandy and regret. 🏰💀</div>`,
  };

  console.log(
    "🎭 PHANTOM KING DEBUG (from applyPhantomKingEffect): Returning result:",
    returnValue
  );

  return returnValue;
}

// Royal Confessor Card (ID: 13, Strength: 2)
// Effect: If 2 valid targets are provided, their hands are switched.
export async function applyRoyalConfessorEffect({
  roomCode,
  target1,
  target2,
  attacker,
  selectedCardIndex,
  cardPlayed,
}) {
  const isSelfTarget = target1 === attacker;

  console.log(
    "ROYAL CONFESSOR: GOING TO applyRoyalConfessorEffect. Target1: ",
    target1,
    " / Target2: ",
    target2,
    " / attacker: ",
    attacker,
    "isSelfTarget: ",
    isSelfTarget
  );

  try {
    // STEP 1: Discard Royal Confessor FIRST, before any effect processing
    console.log(
      "🎭 ROYAL CONFESSOR STEP 1: Discarding the confessor... Player name: ",
      attacker
    );

    const gameRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error(
        "The royal chambers have vanished into the ethereal void..."
      );
    }

    const gameData = snapshot.val();
    const attackerData = gameData.players[attacker];

    const newHand = attackerData.hand.filter(
      (_, index) => index !== selectedCardIndex
    );
    const newDiscard = [...(attackerData.discard || []), cardPlayed];

    console.log(
      "ROYAL CONFESSOR STEP 1.5: newHand: ",
      newHand[0],
      " / newDiscard: ",
      newDiscard[-1]
    );

    // Apply the discard immediately to Firebase
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${attacker}/hand`]: newHand,
      [`players/${attacker}/discard`]: newDiscard,
    });

    console.log(
      "🎭 ROYAL CONFESSOR STEP 1 COMPLETE: Royal Confessor card banished to",
      attacker,
      "'s discard pile"
    );

    // STEP 2: Apply hand swap effect (now both players have exactly 1 card)
    console.log(
      "🎭 ROYAL CONFESSOR STEP 2: Before confession (cards swapping)..."
    );

    const target1Hand = isSelfTarget ? newHand : gameData.players[target1].hand;
    const target2Hand = gameData.players[target2].hand;

    console.log("🎭 ROYAL CONFESSOR DEBUG: Game data loaded", {
      hasGameData: !!gameData,
      hasAttackerData: !!attackerData,
      attackerHand: newHand,
      target1Hand,
      target2Hand,
    });

    // Get the remaining cards
    const target1Card = target1Hand[0]; // external target1 or attacker's new hand
    const target2Card = target2Hand[0]; // Target's card

    // Get the cards to trade - at this point Phantom King should already be discarded
    if (
      !target1Card ||
      target1Hand.length !== 1 ||
      !target2Card ||
      target2Hand.length !== 1
    ) {
      throw new Error(
        "The royal confessor requires sinners to have exactly one card remaining, in order to proceed with the confession...",
        target1Card,
        target2Card
      );
    }

    console.log("🎭 ROYAL CONFESSOR: Preparing mutual confession between:", {
      target1Card: target1Card.name,
      target2Card: target2Card.name,
    });

    // Normal swap case - check if we have the required data
    if (!target1Card || !target2Card) {
      console.error("👻 ROYAL CONFESSOR ERROR: Missing card data");
      setResultModalData({
        selectedCardId: 6,
        resultText:
          "❌ The Mutual Confession ritual failed... Something went wrong with the card exchange.",
      });
      return;
    }

    // Apply the hand swap in Firebase (moved from cardEffects.js)
    console.log("👻 ROYAL CONFESSOR: Applying hand swap to Firebase");
    const updates = {
      [`players/${target1}/hand`]: [target2Card], // Attacker gets target's card
      [`players/${target2}/hand`]: [target1Card], // Target gets attacker's card
    };
    await update(ref(db, `rooms/${roomCode}`), updates);
    console.log("👻 ROYAL CONFESSOR: Hand swap completed");

    const newTarget1Card = target2Card;
    const newTarget2Card = target1Card;

    const externalAttackerMessage = `<div class="effect-description">The Royal Confessor clasps his hands piously. <span class="quotation">“Sin festers when left alone,”</span> he declares. <span class="quotation">“Let <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span> cleanse each other's souls before the light.”</span></div>
<div class="effect-description">While they whisper, he listens — not so — discreetly, eyes twinkling through the incense. Then he turns to you with a knowing grin:</div>
<div class="effect-description quotation">“A fine selection, my child. As reward for your pious donations, allow me to share a morsel of their wickedness...”</div>`;

    // Attacker message (when attacker = target1)

    const attackerSelfTargetMessage = `<div class="effect-description">Seeking divine favor, you step forth before the Royal Confessor.</div>
<div class="effect-description"><span class="quotation">“Such humility warms the heavens,”</span> he proclaims. <span class="quotation">“<span class="effect-player">${target2}</span> shall join you — for nothing cleanses the soul like mutual confession.”</span></div>
<div class="effect-description">As your whispers fade, he leans closer, smirking beneath his hood:</div>
<div class="effect-description quotation">“A brave act, my child. And between us… their secret was well worth the effort, don’t you think?”</div>`;

    const target2Message = `<div class="effect-description confessor top">The Royal Confessor’s voice booms through the chapel: <span class="quotation">“By order of our devout benefactor, <span class="effect-player">${attacker}</span>, you and <span class="effect-player">${
      isSelfTarget ? "them" : target1
    }</span> shall purify your hearts before the light!”</span></div>
<div class="effect-description confessor">You kneel beside <span class="effect-player">${target1}</span>, exchanging your hidden sins as incense clouds the air.</div>
<div class="effect-description confessor">The Confessor nods gravely, though his eager eyes betray a man far too pleased to learn some delicious court's secrets.</div>`;

    const target1Message = `<div class="effect-description confessor top">The Royal Confessor’s voice booms through the chapel: <span class="quotation">“By order of our devout benefactor, <span class="effect-player">${attacker}</span>, you and <span class="effect-player">${target2}</span> shall purify your hearts before the light!”</span></div>
<div class="effect-description confessor">You kneel beside <span class="effect-player">${target2}</span>, exchanging your hidden sins as incense clouds the air.</div>
<div class="effect-description confessor">The Confessor nods gravely, though his eager eyes betray a man far too pleased to learn some delicious court's secrets.</div>`;

    const publicMessage = `<div class="effect-description">✝️ The Royal Confessor summoned <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span> to share their sins in a holy rite. The court applauded the piety — though few missed the sparkle of curiosity in the Confessor’s eyes.</div>`;

    return {
      result: "confession",
      isSelfTarget,
      publicMessage,
      externalAttackerMessage,
      attackerSelfTargetMessage,
      target2Message,
      target1Message,
      newTarget1Card,
      newTarget2Card,
    };
  } catch (error) {
    console.error("👻 ROYAL CONFESSOR EXCHANGE ERROR:", error);
    return;
  }
}

// 👑 Princess Card (ID: 8, Strength: 8)
// Effect: If the player plays or discards this card for any reason, they are eliminated from the round.
export async function applyPrincessEffect({ roomCode, player }) {
  console.log("👑 PRINCESS DEBUG: The ultimate tragedy unfolds...", {
    player,
  });

  try {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("The royal court has vanished...");
    }

    const roomData = snapshot.val();
    const playerData = roomData.players[player];

    if (!playerData) {
      throw new Error("The player has disappeared from court...");
    }

    console.log("👑 PRINCESS: The ultimate sacrifice begins", {
      player,
      hand: playerData.hand,
    });

    // Player name for messages
    const playerName = playerData.name || player;

    // DON'T eliminate the player here - wait for modal confirmation!
    // Elimination will happen in completePrincessTurn() after player reads the modal

    console.log(
      "👑 PRINCESS: Prepared tragic messages, elimination pending modal confirmation",
      {
        player,
        eliminationPending: true,
      }
    );

    // Craft dramatic medieval-geek messages
    const publicMessage = `<div class="effect-title">👑💀 ROYAL CATASTROPHE! 💀👑</div>
    <div class="effect-description"><span class="effect-player">${playerName}</span> has played the <span class="effect-card">PRINCESS</span> herself!</div>
    <div class="effect-description">💔 In a moment of desperate love, they approached the Princess directly...</div>
    <div class="effect-description">💔 But the Princess, in all her royal dignity, simply turned away!</div>
    <div class="effect-description">💔 "<span class="effect-player">${playerName}</span>, you presume too much!" declared Her Highness.</div>
    <div class="effect-warning">💔 They are banished from the royal court! 👑✨💀</div>`;
    const playerMessage = `<div class="effect-title">👑💀 ULTIMATE ROYAL BLUNDER! 💀👑</div>
    <div class="effect-description">Oh no! You played the <span class="effect-card">PRINCESS</span>! 🙈</div>
    <div class="effect-description">💔 You approached Her Royal Highness directly with your letter...</div>
    <div class="effect-description">💔 But she gave you the coldest royal stare before walking away, ignoring you.</div>
    <div class="effect-warning">💀 You are eliminated from the round, you hopeless romantic! 💀</div>
    <div class="effect-quote">"Next time, try working your way up the social ladder first..."</div>
    <div class="effect-signature">- The Princess (rolling her eyes) 🙄</div>`;

    return {
      result: "princess_played",
      message: "The Princess has spoken! You are eliminated!",
      publicMessage,
      playerMessage,
      eliminatedPlayer: player,
      // Princess modal flow: player confirms → turn advances
      attackerMessage: {
        cardName: "Princess",
        from: player,
        message: playerMessage,
        selectedCardIndex: 0,
        shouldAdvanceTurn: true, // Playing Princess advances turn after modal
        visibleTo: player,
      },
    };
  } catch (error) {
    console.error("👑 PRINCESS ERROR: Royal scandal!", error);
    return {
      result: "error",
      message: `👑 The Princess encountered a royal mishap! ${error.message}`,
    };
  }
}

/**
 * Awards a single love token to a player (used by Inquisitor)
 * Does NOT trigger round end - only for mid-round rewards
 */
export async function awardLoveToken({ roomCode, player }) {
  console.log(`💰 LOVE TOKEN AWARD: Awarding token to ${player}`);

  try {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));
    const data = snapshot.val();
    const currentTokens = data.players[player]?.tokens || 0;

    // 🕵️ Track love token origin for inquisitor correct guess
    const existingOrigin = data.players[player]?.loveTokenOrigin || {};

    await update(ref(db, `rooms/${roomCode}/players/${player}`), {
      tokens: currentTokens + 1,
      loveTokenOrigin: {
        ...existingOrigin,
        inquisitorGuess: 1,
      },
    });

    console.log(
      `💰 SUCCESS: ${player} now has ${currentTokens + 1} love tokens`
    );
    return { success: true, newTokenCount: currentTokens + 1 };
  } catch (error) {
    console.error("💰 LOVE TOKEN ERROR:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Applies the Inquisitor card effect
 * Investigates target's hand and potentially awards love token + forces discard
 */
export async function applyInquisitorEffect({
  roomCode,
  attacker,
  target,
  guess,
}) {
  console.log(
    `🕵️ INQUISITOR DEBUG: ${attacker} investigates ${target} for strength ${guess}`
  );

  // Inquisitor cannot guess strength 1 (same rule as Guard)
  if (guess === 1) {
    return {
      result: "invalidGuess",
      error: "Inquisitor cannot guess strength 1",
      isCorrectGuess: false,
      targetCard: null,
    };
  }

  try {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));
    const data = snapshot.val();
    const targetPlayer = data.players[target];
    const attackerPlayer = data.players[attacker];
    const targetCard = targetPlayer.hand[0];

    const wasCorrect = targetCard.strength === guess;
    const isPrincessFound = targetCard.id === 8 && wasCorrect;

    console.log(
      `🕵️ INVESTIGATION: ${wasCorrect ? "CORRECT" : "WRONG"} guess - found ${
        targetCard.name
      } (strength ${targetCard.strength})`
    );

    // Create enriched card object for display
    const enrichedTargetCard =
      cards.find((c) => c.id === targetCard.id) || targetCard;

    let attackerMessage, targetMessage, publicMessage;

    if (!wasCorrect) {
      // Wrong guess - no effects, just messages
      attackerMessage = `<div class="effect-description">🔍 Your Inquisitor searched for a heretic of <span class="effect-strength">strength ${guess}</span> at <span class="effect-player">${attackerPlayer.name}</span>'s place,  but didn't find the suspect.</div>
      <div class="effect-description">⚖️ The investigation yields nothing...</div>`;

      targetMessage = `<div class="effect-description">🕵️ <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor came looking for some heretic of strength <span class="effect-strength">${guess}</span> at your place...</div>
      <div class="effect-description">🛡️ But they only found you in the company of <span class="effect-card">${
        enrichedTargetCard.name
      }</span> (Strength <span class="effect-strength">${
        enrichedTargetCard.strength
      }</span>).</div>
      <div class="effect-description">✨ You are safe from their investigation!</div>`;

      publicMessage = `<div class="effect-description">🔍 <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor investigated <span class="effect-player">${
        targetPlayer.name || target
      }</span> but found no evidence of wrongdoing.</div>`;
    } else if (isPrincessFound) {
      // Correct guess AND Princess found - SCANDAL!
      attackerMessage = `<div class="effect-description">⛪💀 SCANDALOUS DISCOVERY! Your Inquisitor found <span class="effect-player">${
        targetPlayer.name || target
      }</span> consorting directly with the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-description">💰 Your cunning investigation earns you a <span class="effect-success">Love Token</span>!</div>
      <div class="effect-description">⚖️ Such impropriety cannot be tolerated - they are <span class="effect-elimination">ELIMINATED</span>!</div>`;

      targetMessage = `<div class="effect-description">⛪💀 DIVINE JUDGMENT! <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor discovered your secret meetings with the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-description">🔥 The Church declares this shocking impropriety absolutely intolerable!</div>
      <div class="effect-description">💀 You are <span class="effect-elimination">ELIMINATED</span> for this scandalous breach of protocol!</div>`;

      publicMessage = `<div class="effect-description">⛪💀 SCANDAL! <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor found <span class="effect-player">${
        targetPlayer.name || target
      }</span> consorting with the <span class="effect-card">PRINCESS</span>! <span class="effect-elimination">${
        targetPlayer.name || target
      } eliminated for this shocking impropriety.</span></div>`;
    } else {
      // Correct guess but not Princess - normal investigation success
      attackerMessage = `<div class="effect-description">🕵️ INVESTIGATION SUCCESSFUL! Your Inquisitor found the heretic they were looking for in <span class="effect-player">${
        targetPlayer.name || target
      }</span>'s company.</div>
      <div class="effect-description">💰 Your cunning earns you a <span class="effect-success">Love Token</span>!</div>
      <div class="effect-description">⚖️ They must dismiss their heretic ally and seek new counsel...</div>`;

      targetMessage = `<div class="effect-description">🔍 ROYAL INVESTIGATION! <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor suspected you of plotting with some heretic of strength <span class="effect-strength">${guess}</span>...</div>
      <div class="effect-description">💀 They were RIGHT! They discovered your <span class="effect-card">${
        enrichedTargetCard.name
      }</span> ally in your company!</div>
      <div class="effect-description">⚖️ Your treacherous alliance is exposed - dismiss your accomplice immediately!</div>`;

      publicMessage = `<div class="effect-description">🕵️ <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor exposed <span class="effect-player">${
        targetPlayer.name || target
      }</span>'s <span class="effect-card">${
        enrichedTargetCard.name
      }</span>! Secrets revealed!</div>`;
    }

    return {
      result: wasCorrect ? "correctGuess" : "wrongGuess",
      isCorrectGuess: wasCorrect,
      isPrincessFound,
      targetCard: enrichedTargetCard,
      guessedStrength: guess,
      actualStrength: targetCard.strength,
      attacker,
      target,
      attackerMessage,
      targetMessage,
      publicMessage,
      // Modal control - target modal will handle the effects
      attackerModalData: {
        resultText: attackerMessage,
        isInfoOnly: true, // Attacker modal is informational only
      },
      targetModalData: {
        resultText: targetMessage,
        isInfoOnly: false, // Target modal controls turn advancement and effects
        isInquisitorResult: true,
        originalAttacker: attacker,
        originalTarget: target,
        wasCorrectGuess: wasCorrect,
        foundPrincess: isPrincessFound,
        discardedCard: wasCorrect ? enrichedTargetCard : null,
      },
    };
  } catch (error) {
    console.error("🕵️ INQUISITOR ERROR:", error);
    return {
      result: "error",
      error: error.message,
      isCorrectGuess: false,
    };
  }
}

// 🗣️💅 COURT WHISPERER EFFECT 💅🗣️
export async function applyCourtWhispererEffect({
  roomCode,
  attacker,
  target,
}) {
  console.log(
    "🗣️ COURT WHISPERER EFFECT: Spreading delicious gossip!",
    attacker,
    "targeting",
    target
  );

  try {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));
    const data = snapshot.val();

    if (!data || !data.players[target]) {
      return {
        result: "error",
        error: "Invalid target player",
      };
    }

    const attackerPlayer = data.players[attacker];
    const targetPlayer = data.players[target];

    // DON'T set nextTarget here - it will be set in completeCourtWhispererTurn
    // when the attacker clicks "Continue" on their EffectResultModal

    // Generate gossip magazine style messages! 💅📰
    const attackerMessage = `<div class="effect-description">
        You lean toward the infamous Court Whisperer and drop a few well-placed words about <span style="color: #FF1493; font-weight: bold;">${targetPlayer.name}</span>.
      </div>
      <div class="effect-description">
        A knowing smile spreads across their painted face. Within hours, every servant, scribe, and stable boy is whispering that name.
      </div>
      <div class="effect-description">
        Your rival now glitters at the center of every scandal — a royal disaster in progress. ✨�
      </div>
      <div class="effect-technical">
        🎯 Next player MUST target <span style="font-weight: bold;">${targetPlayer.name}</span> (if their card requires targeting)
      </div>`;

    const targetMessage = `<div class="effect-description">
        You arrive at court and the air changes.
      </div>
      <div class="effect-description">
        Eyes follow you, fans flutter, and every laugh seems to end in your name.
      </div>
      <div class="effect-description">
        The Court Whisperer has clearly been busy — your reputation is now the court's favorite entertainment. 🎭✨
      </div>
      <div class="effect-technical">
        🎯 Next player MUST target <span style="font-weight: bold;">YOU</span> (if their card requires targeting)
      </div>`;

    const publicMessage = `<div class="effect-description">🗣️👂🏼 <span class="effect-player">${attackerPlayer.name}</span> whispers into the right ear...</div><div class="effect-description"> giving the ever-talkative Court Whisperer a new subject: <span class="effect-player">${targetPlayer.name}</span>. 📣 Rumors spread faster than perfume in the throne room, and no one dares speak of anything — or anyone — else. 👄</div>`;

    return {
      result: "success",
      attacker,
      target,
      targetPlayer,
      attackerMessage,
      targetMessage,
      publicMessage,
    };
  } catch (error) {
    console.error("🗣️ COURT WHISPERER ERROR:", error);
    return {
      result: "error",
      error: error.message,
    };
  }
}

// 💄💋 BARONESS EFFECT 💋💄
export async function applyBaronessEffect({
  roomCode,
  attacker,
  target1,
  target2 = null,
}) {
  try {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));
    const data = snapshot.val();

    if (!data || !data.players || !data.players[target1]) {
      return {
        result: "error",
        message: "Target player not found",
      };
    }

    const target1Player = data.players[target1];
    let target2Player = null;

    if (target2) {
      target2Player = data.players[target2];
      if (!target2Player) {
        return {
          result: "error",
          message: "Second target player not found",
        };
      }
    }

    if (!target1Player.hand || target1Player.hand.length === 0) {
      return {
        result: "error",
        message: "Target has no cards",
      };
    }

    const target1Card = target1Player.hand[0];
    let target2Card = null;

    if (target2Player) {
      if (!target2Player.hand || target2Player.hand.length === 0) {
        return {
          result: "error",
          message: "Second target has no cards",
        };
      }
      target2Card = target2Player.hand[0];
    }

    // Enrich cards with effect descriptions
    const cards = (await import("./cardsData.js")).cards;

    const enrichedTarget1Card = {
      ...target1Card,
      effect:
        cards.find((c) => c.id === target1Card.id)?.effect ||
        "Unknown card effect",
    };

    let enrichedTarget2Card = null;
    if (target2Card) {
      enrichedTarget2Card = {
        ...target2Card,
        effect:
          cards.find((c) => c.id === target2Card.id)?.effect ||
          "Unknown card effect",
      };
    }

    // Generate romantic narratives 💋✨
    const attackerMessage = target2
      ? `<div class="effect-description baroness">🍷✨ At her evening soirée, the Baroness fans herself with excitement. <span class="quotation">"Ah, <span class="effect-player">${attacker}</span>, my favorite dreamer of romance,"</span> she says with a wink. 💋 <span class="quotation">"Allow me to see which rivals might stand in your way!"</span></div>
<div class="effect-description baroness">🌹 She drifts toward <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span>, filling their glasses and their hearts with confidence until they speak too freely. 🥂</div>
<div class="effect-description baroness">Later, she returns to you, eyes sparkling. ✨ <span class="quotation">"Well,"</span> she whispers, <span class="quotation">"I've uncovered the allies who guard their letters... and what a charming tangle of love it is!"</span> 💕</div>`
      : `<div class="effect-description baroness">🍷✨ At her evening soirée, the Baroness fans herself with excitement. <span class="quotation">"Ah, <span class="effect-player">${attacker}</span>, my favorite dreamer of romance,"</span> she says with a wink. 💋 <span class="quotation">"Allow me to see which rival might stand in your way!"</span></div>
<div class="effect-description baroness">🌹 She drifts toward <span class="effect-player">${target1}</span>, filling their glass and their heart with confidence until they speak too freely. 🥂</div>
<div class="effect-description baroness">Later, she returns to you, eyes sparkling. ✨ <span class="quotation">"Well,"</span> she whispers, <span class="quotation">"I've uncovered the ally who guards their letter... what a charming secret it is."</span> 💕</div>`;

    const target1Message = target2
      ? `<div class="effect-description baroness">🎉💋 The Baroness' soirée hums with laughter when she takes your arm. <span class="quotation">"Darling <span class="effect-player">${target2}</span>, you and I need a little talk of love,"</span> she says with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself across from <span class="effect-player">${target2}</span>, your every word flowing far too freely. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`
      : `<div class="effect-description baroness">🎉💋 The Baroness' soirée hums with laughter when she takes your arm with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself speaking far too freely about your romantic intentions. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`;

    let target2Message = null;
    if (target2) {
      target2Message = `<div class="effect-description baroness">🎉💋 The Baroness' soirée hums with laughter when she takes your arm. <span class="quotation">"Darling <span class="effect-player">${target1}</span>, you and I need a little talk of love,"</span> she says with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself across from <span class="effect-player">${target1}</span>, your every word flowing far too freely. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`;
    }

    const publicMessage = target2
      ? `<div class="effect-description">🍷✨ <span class="quotation">💋 At her grand soirée,</span> the Baroness — ever eager to play the royal matchmakers — drew <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span> into a most revealing conversation. 💬🌹</div>
<div class="effect-description">By dawn, secrets of the heart were spilled, and she obviously shared them with the suitor who, in her opinion, would match the best with the princess: <span class="effect-player">${attacker}</span>! 💕👑</div>`
      : `<div class="effect-description">🍷✨ <span class="quotation">💋 At her grand soirée,</span> the Baroness — ever eager to play the royal matchmakers — drew <span class="effect-player">${target1}</span> into a most revealing conversation. 💬🌹</div>
<div class="effect-description">By dawn, secrets of the heart were spilled, and she obviously shared them with the suitor who, in her opinion, would match the best with the princess: <span class="effect-player">${attacker}</span>! 💕👑</div>`;

    return {
      result: "baronessReveal",
      attacker,
      target1,
      target2,
      target1Card: enrichedTarget1Card,
      target2Card: enrichedTarget2Card,
      attackerMessage,
      target1Message,
      target2Message,
      publicMessage,
    };
  } catch (error) {
    console.error("👻 BARONESS EFFECT ERROR:", error);
    return {
      result: "error",
      error: error.message,
    };
  }
}

export async function applyDukeEffect({ roomCode, player }) {
  try {
    const gameRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error("The royal court has disappeared...");
    }

    const gameData = snapshot.val();
    const playerData = gameData.players[player];

    console.log("👑🐕 DUKE: Noble favor granted", {
      player,
      hand: playerData.hand,
    });

    const attackerMessage = `
<div class="effect-description top">👑 The Duke approaches you with quiet authority. His loyal little hound 🐕 trots proudly at his heels, wearing a velvet collar far too grand for its size.</div>
<div class="effect-description"><span class="quotation duke">"My dear <span class="effect-player">${
      playerData.name || player
    }</span>,"</span> the Duke says, <span class="quotation duke">"my niece deserves sincerity, not showmanship. You have shown both courage and patience — virtues I hold dear."</span></div>
<div class="effect-description">He rests a gloved hand 🤝 on your shoulder. <span class="quotation duke">"Take my blessing. While I stand in your corner, your name shall carry greater weight in this court."</span></div>
<div class="effect-description">The tiny dog lets out a solemn <span class="quotation duke">"woof,"</span> 🐾 as if sealing the vow.</div>
<div class="effect-technical">✨ If you're still standing when the round ends, add +1 to your last card's strength!</div>`;

    const publicMessage = `
<div class="effect-description">🏛️ The Duke, uncle to the Princess and guardian of her honor, has granted his favor to <span class="effect-player">${
      playerData.name || player
    }</span>.</div>
<div class="effect-description">His word alone elevates their standing in the eyes of the court — and even his tiny hound 🐶 seems to approve, tail held high with royal pride 👑.</div>`;

    return {
      result: "duke_favor",
      requiresPrompt: false,
      attackerMessage,
      publicMessage,
    };
  } catch (error) {
    console.error("👑🐕 DUKE EFFECT ERROR:", error);
    return {
      result: "error",
      error: error.message,
    };
  }
}
