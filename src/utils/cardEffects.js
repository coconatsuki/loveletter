import { ref, update, get } from "firebase/database";
import { db } from "./firebase";
import { cards } from "./cardsData";
import {
  handleCardDiscard,
  handlePlayerElimination,
  awardLoveToken,
} from "./gamehelpers";

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

export async function applyGuard2Effect({
  roomCode,
  actionUsed,
  guardTargetPromptData,
}) {
  const {
    isCorrectGuess,
    targetCard,
    target,
    attacker,
    hasAssassin,
    guessedStrength,
    actualStrength,
    eliminatedPlayer,
  } = guardTargetPromptData;

  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const roomData = snapshot.val();

  if (!roomData || !roomData.players || !roomData.players[target]) {
    return {
      result: "error",
      message: "Target player not found",
    };
  }

  const players = roomData.players;
  const targetPlayerData = players[target];

  let attackerMessage, targetMessage, publicMessage;
  let attackerMarkedForElimination = false;
  let newCardDrawn = null;

  console.log(`🚨 applyGuard2Effect - BEGIN with:`, {
    target,
    targetPlayerData: targetPlayerData
      ? {
          name: targetPlayerData.name,
          chamberlainToken: targetPlayerData.chamberlainToken,
          isOut: targetPlayerData.isOut,
        }
      : "PLAYER NOT FOUND",
    allPlayersKeys: Object.keys(players || {}),
    guardTargetPromptData,
  });

  // AKNOWLEDGE: TARGET DIDN'T HAVE ASSASSIN
  if (actionUsed === "onAcknowledge") {
    if (isCorrectGuess) {
      // Attacker guessed correctly - eliminate target

      const eliminationUpdates = handlePlayerElimination(
        roomCode,
        target,
        roomData?.mode,
        targetPlayerData,
        {}
      );

      await update(ref(db, `rooms/${roomCode}`), eliminationUpdates);

      publicMessage = `🎯 Rumors echo through the corridors — <span class="effect-player">${attacker}</span>’s Guard burst into <span class="effect-player">${target}</span>’s chambers and exposed a treacherous ally!
        The scandal spreads like wildfire 🔥 — <span class="effect-player">${target}</span> is cast from the court in disgrace.`;

      attackerMessage = `
        <div class="effect-description top">🎯 Your instincts were flawless.</div>
        <div class="effect-description">The Guard you sent to <span class="effect-player">${target}</span>’s residence returns with a proud salute — your rival <em>was</em> conspiring with whom you suspected: the <span class="effect-card">${targetCard.name}</span>!</div>
        <div class="effect-description">Murmurs of betrayal sweep through the court like wildfire 🔥.</div>
        <div class="effect-description"><span class="effect-player">${target}</span> is disgraced, their schemes laid bare before the Princess.</div>`;
    } else {
      // Attacker guessed incorrectly - target survives

      publicMessage = `😎 The Guard returns to <span class="effect-player">${attacker}</span> empty-handed.
        <span class="effect-player">${target}</span> simply smiled behind their fan and said, “Not even close.”`;

      attackerMessage = `
        <div class="effect-description top">👮🏼 Your Guard returns at dawn, shaking his head.</div>
        <div class="effect-description"><span class="quotation">“My lord… the accusation against <span class="effect-player">${target}</span> proved unfounded,”</span> he says. <span class="quotation">“The halls were quiet, the servants loyal — no trace of conspiracy.”</span></div>
        <div class="effect-description">Your false alarm echoes through the palace corridors, earning you wary glances and polite smiles that hide their laughter.</div>`;
    }
  }

  // ASSASSIN CARD REVEALED
  if (actionUsed === "onReveal") {
    // Apply Assassin defense (eliminates attacker, target draws new card)
    const deck = roomData.round.deck || [];

    newCardDrawn =
      deck.length > 0
        ? deck[0]
        : { id: 17, name: "No Cards Left", strength: 0 }; // Fallback card if deck is empty
    const newDeck = deck.length > 0 ? deck.slice(1) : deck;

    // Get the full Assassin card object from cards data
    const assassinCard = cards.find((card) => card.id === 14);

    // Immediate effects: Discard Assassin (full card object) + Draw new card for target
    // BUT do NOT eliminate attacker yet - that happens when the ATTACKER clicks on "Continue" (EffectResultModal)
    const baseUpdates = {
      // Discard the full Assassin card object with all properties
      [`players/${target}/discard`]: [
        ...(roomData.players[target].discard || []),
        assassinCard,
      ],
      // Give target a new card from deck
      [`players/${target}/hand`]: [newCardDrawn],
      // Update deck
      [`round/deck`]: newDeck,
      // Set elimination flag for attacker - they'll be eliminated when they confirm modal
    };

    await update(ref(db, `rooms/${roomCode}`), baseUpdates);

    attackerMarkedForElimination = true;

    console.log(
      "🗡️ ASSASSIN DEFENSE: Immediate effects applied - Card discarded, new card drawn, attacker marked for elimination"
    );

    publicMessage = `🗡️💀 A silent shadow moves before dawn… <span class="effect-player">${attacker}</span>’s Guard never makes it back.
        From the darkness of <span class="effect-player">${target}</span>’s residence, the Royal Assassin has struck again ⚔️🌙`;

    attackerMessage = `<div class="effect-description top">⚔️ Your Guard approached <span class="effect-player">${target}</span>’s residence, confident in their search for traitors…</div>
        <div class="effect-description">🌙 But from the shadows, a blade flashed — silent and merciless!</div>
        <div class="effect-description">💀 <span class="effect-player">${target}</span>’s deadly ally, the <span class="effect-card">Royal Assassin</span>, cut your Guard down.</div>
        <div class="effect-description">🩸 The news reaches you at dawn; fear grips your heart. You dare not linger at court any longer…</div>
        <div class="effect-description">💔 You have been <span class="effect-card">ELIMINATED</span> from this round!</div>`;
  }

  // TARGET HAD ASSASSIN, BUT ATTACKER DID NOT REVEAL IT ("Let them go" button)
  if (actionUsed === "onIgnore") {
    publicMessage = `🕯️ ${target} denies the charge with calm poise. “I fear your Guard has wasted his time, ${attacker}.”`;

    attackerMessage = `<div class="effect-description top">👮🏼 Your Guard returns at dawn, shaking his head.</div>
        <div class="effect-description"><span class="quotation">“My lord… the accusation against <span class="effect-player">${target}</span> proved unfounded,”</span> he says. <span class="quotation">“The halls were quiet, the servants loyal — no trace of conspiracy.”</span></div>
        <div class="effect-description">Your false alarm echoes through the palace corridors, earning you wary glances and polite smiles that hide their laughter.</div>`;
  }

  const resultText =
    actionUsed === "onAcknowledge" && isCorrectGuess
      ? "correctGuess"
      : actionUsed === "onAcknowledge" && !isCorrectGuess
      ? "wrongGuess"
      : actionUsed === "onReveal"
      ? "assassinRevealed"
      : actionUsed === "onIgnore" && isCorrectGuess
      ? "assassinIgnoredElimination"
      : actionUsed === "onIgnore" && !isCorrectGuess
      ? "assassinIgnoredNoElimination"
      : "unknownAction";

  return {
    result: resultText,
    attacker,
    target,
    publicMessage,
    attackerMessage,
    targetMessage,
    attackerMarkedForElimination,
    newCardDrawn,
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
  updatePlayedCardIndex,
}) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  // Get the attacker's hand (should have 2 cards at this point)
  const attackerHand = data.players[attacker].hand;

  // The attackerCard should be the OTHER card (not the Baron being played)
  const attackerCard =
    playedCardIndex === 0 ? attackerHand[1] : attackerHand[0];
  const targetCard = data.players[target].hand[0];
  const baronCard = attackerHand[playedCardIndex];

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

  if (eliminatedPlayer === attacker) {
    // Discard second card now, and the Baron card later, in completeTurnWithCardIndex()
    const discardUpdate = {
      [`players/${attacker}/discard`]: [
        ...(data.players[attacker].discard || []),
        attackerCard,
      ],
      [`players/${attacker}/hand`]: [baronCard],
    };

    await update(ref(db, `rooms/${roomCode}`), discardUpdate);

    updatePlayedCardIndex(0); // Reset played card index after discarding

    console.log(
      "Apply Baron effect / attacker will be eliminated / updatePlayedCardIndex to 0 / second card discarded: ",
      attackerCard,
      " discardUpdates: ",
      discardUpdate
    );
  }

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
  updatePlayedCardIndex,
}) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  // Get the attacker's hand (should have 2 cards at this point)
  const attackerHand = data.players[attacker].hand;

  // The attackerCard should be the OTHER card (not the Regent Queen being played)
  const attackerCard =
    playedCardIndex === 0 ? attackerHand[1] : attackerHand[0];
  const targetCard = data.players[target].hand[0];
  const regentQueenCard = attackerHand[playedCardIndex];

  let eliminatedPlayer = null;
  let winner = null;
  let winnerCard = null;
  let loserCard = null;

  // Compare card strengths - HIGHER strength is eliminated (inverse of Baron)
  if (attackerCard.strength > targetCard.strength) {
    eliminatedPlayer = attacker; // Attacker eliminated if they have higher strength
    winner = target;
    winnerCard = targetCard;
    loserCard = attackerCard;
  } else if (targetCard.strength > attackerCard.strength) {
    eliminatedPlayer = target; // Target eliminated if they have higher strength
    winner = attacker;
    winnerCard = attackerCard;
    loserCard = targetCard;
  }
  // If strengths are equal, it's a tie - no elimination

  // NOTE: We do NOT eliminate the player here - that will be done when the modal is confirmed
  // The Regent Queen effect only compares cards and returns the result

  if (eliminatedPlayer === attacker) {
    // Discard second card now, and the Baron card later, in completeTurnWithCardIndex()
    const discardUpdate = {
      [`players/${attacker}/discard`]: [
        ...(data.players[attacker].discard || []),
        attackerCard,
      ],
      [`players/${attacker}/hand`]: [regentQueenCard],
    };

    await update(ref(db, `rooms/${roomCode}`), discardUpdate);

    updatePlayedCardIndex(0); // Reset played card index after discarding

    console.log(
      "Apply Regent Queen effect / attacker will be eliminated / updatePlayedCardIndex to 0 / second card discarded: ",
      attackerCard,
      " discardUpdates: ",
      discardUpdate
    );
  }

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
  const deck = data.round.deck || [];
  const isSelfTarget = attacker === target;

  let targetCard; // The card that will be discarded
  let wasPrincessDiscarded;
  let newHand = [];
  let drewNewCard = false;
  let newCard = null;
  let newTargetDiscard;
  let princeCard;
  let princeCardIndex;

  if (isSelfTarget) {
    // SELF-TARGET: Attacker has 2 cards: Prince + another. We should discard the other.
    const playerHand = targetPlayer.hand;

    // Find the card that is NOT the Prince (id: 5)
    const secondCard = playerHand.find((card) => card.id !== 5);
    targetCard = secondCard; // The card will be discarded

    princeCard = playerHand.find((card) => card.id === 5);
    princeCardIndex = princeCard && playerHand.indexOf(princeCard);

    // Check if the second card is a Princess
    wasPrincessDiscarded = secondCard.id === 8;
  } else {
    // EXTERNAL TARGET: Target discards their single card
    targetCard = targetPlayer.hand[0]; // Target's only card
    wasPrincessDiscarded = targetCard.id === 8;
  }

  // Discard target's card
  newTargetDiscard = [...(targetPlayer.discard || []), targetCard];

  // Draw new card if deck isn't empty and Princess wasn't discarded
  if (!wasPrincessDiscarded && deck.length > 0) {
    let selfTargetNewHand;
    newCard = deck.pop(); // Draw from top

    if (isSelfTarget) {
      selfTargetNewHand =
        princeCardIndex === 0 ? [princeCard, newCard] : [newCard, princeCard];
    }

    newHand = isSelfTarget ? selfTargetNewHand : [newCard];
    drewNewCard = true;
  } else if (wasPrincessDiscarded) {
    newHand = isSelfTarget ? [princeCard] : []; // No new card if Princess discarded
  }

  // Update Firebase
  const baseUpdates = {
    [`players/${target}/hand`]: newHand,
    [`players/${target}/discard`]: newTargetDiscard,
    [`round/deck`]: deck,
  };

  let finalUpdates;

  // If Princess was discarded, eliminate the target (if not self-target)
  // If it's self-target, we'll do it on EffectResultModal onClose.
  if (wasPrincessDiscarded && !isSelfTarget) {
    finalUpdates = handlePlayerElimination(
      roomCode,
      target,
      data?.mode,
      data.players[target],
      baseUpdates
    );
  } else {
    // Handle card discard and check for special tokens (like Chamberlain)
    finalUpdates = handleCardDiscard({
      roomCode,
      playerName: target,
      card: targetCard,
      gameMode: data?.mode,
      existingUpdates: baseUpdates,
    });
  }

  await update(ref(db, `rooms/${roomCode}`), finalUpdates);

  // Generate royal messages! 👑✨
  const attackerName = data.players[attacker]?.name || attacker;
  const targetName = data.players[target]?.name || target;
  const discardedCardName = targetCard.name;
  const newCardName = newCard?.name || "none";

  let publicMessage, attackerMessage, targetMessage;

  if (wasPrincessDiscarded) {
    if (isSelfTarget) {
      // if selfTarget, we Don't need a targetMessage
      publicMessage = `
<div class="effect-description">👑 The Prince roared at <span class="effect-player">${attackerName}</span> for courting his sister in secret. They are cast from the court!</div>
`;
      attackerMessage = `
<div class="effect-description">You thought your bond with the Princess was safe… yet her brother saw through it.</div>
<div class="effect-description">His hand cut the air: <span class="quotation">“You courted my sister behind my leave?”</span> 😠</div>
<div class="effect-description effect-warning">Guards move at once: you are cast out of court! And your love turns to whispers and shame...</div>
`;
    } else {
      // if NOT selfTarget, we ALSO need a targetMessage
      publicMessage = `
<div class="effect-description">👑 At <span class="effect-player">${attackerName}</span>’s word, the Prince banished <span class="effect-player">${targetName}</span> for having courted her sister in secret!</div>
`;
      attackerMessage = `
<div class="effect-description"> You lean close to the Prince's ear, <span class="effect-player">${attackerName}</span>, voice low with concern:</div>
<div class="effect-description"><span class="quotation">“Your Highness, rumors point to <span class="effect-player">${targetName}</span> near your sister.”</span> 🕵️</div>
<div class="effect-description">The Prince’s face darkens. <span class="quotation">“They are courting my sister? Without my leave?”</span> ⛈️</div>
<div class="effect-description effect-warning">His decree falls; <span class="effect-player">${targetName}</span> goes to the gates at once.</div>
<div class="effect-description">Bootsteps fade over marble… and your plan holds firm ❤️‍🔥.</div>
`;
      targetMessage = `
<div class="effect-description"> 🏹The Prince’s eyes pin you like arrows.</div>
<div class="effect-description"><span class="quotation">“You think to charm my sister —without my permission?”</span> 😠</div>
<div class="effect-description">Steel rings; guards close the distance before a word leaves your mouth.</div>
<div class="effect-description effect-warning">You are expelled from court in disgrace 🚪. </div>
`;
    }
  } else {
    // if !wasPrincessDiscarded
    if (isSelfTarget) {
      publicMessage = `
<div class="effect-description">🤝 The Prince favors <span class="effect-player">${attackerName}</span>: the <span class="effect-card">${discardedCardName}</span>,judged unworthy, left their side; a new contact steps in.</div>
`;
      attackerMessage = `
<div class="effect-description">The Prince clasps your shoulder. <span class="quotation">“You suit my sister better than most… yet your company falls short!”</span></div>
<div class="effect-description ">Before you can protest, he waves his hand, and your ally (the <span class="effect-card">${discardedCardName}</span>) is escorted out.</div>
<div class="effect-description"><span class="quotation">“Let me introduce you to someone of better standing,”</span> he adds, summoning a new courtier: the <span class="effect-card">${newCardName}</span>.</div>
<div class="effect-description">Will this change bring you closer to the throne ? ...or to ruin ?</div>
`;
    } else {
      // if NOT selfTarget, we ALSO need a targetMessage
      publicMessage = `
<div class="effect-description">Jealous and protective, the Prince dismissed <span class="effect-player">${targetName}</span>’ accomplice (the <span class="effect-card">${discardedCardName}</span>), after ${attackerName} whispered in his ear.</div>
`;
      attackerMessage = `
<div class="effect-description"><span class="quotation">“Your Highness,”</span> you begin softly, <span class="quotation">“some rumors say that ${targetName} has been using the <span class="effect-card">${discardedCardName}</span>'s help to get close to your sister.”</span></div>
<div class="effect-description">The Prince’s brow tightens, fury and jealousy gleaming in his eyes.</div>
<div class="effect-description effect-warning">The <span class="effect-card">${discardedCardName}</span> is cast from the court at once.</div>
<div class="effect-description quotation">“Thank you, my friend. I shall remember that.”</div>
`;
      targetMessage = `
<div class="effect-description">The Prince’s glare cools the air around you.</div>
<div class="effect-description"><span class="quotation">“You’ve been keeping curious company, <span class="effect-player">${targetName}</span>. No one courts my sister without my leave.”</span></div>
<div class="effect-description effect-warning">Your accomplice, the <span class="effect-card">${discardedCardName}</span>, is led away, eyes lowered.</div>
<div class="effect-description">A new face —the <span class="effect-card">${newCardName}</span>— appears at your side, with a careful smile.</div>
<div class="effect-description">A new connection, perhaps… or a trap..</div>
`;
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
    publicMessage: `<div class="effect-description">🫖✨ The Princess' Handmaid graciously invites <span class="effect-player">${
      data.players[player]?.name || player
    }</span> for tea and biscuits in her cozy chambers. <span class="effect-success">They are now protected until their next turn!</span> ☕🛡️</div>`,
    // Personal message for the protected player's modal
    playerMessage: `<div class="effect-description">The Princess' loyal Handmaid has taken you under her wing! She invites you for tea and biscuits in her cozy chambers.</div>
    <div class="effect-success">☕ Protection Status: ACTIVE ☕</div>
    <div class="effect-description">⏰ Duration: Until your next turn begins</div>
    <div class="effect-description">🛡️ Effect: You cannot be targeted by any cards</div>
    <div class="effect-quote">"Come, dear. Let us chat by the fireplace while the others play their games. You're safe with me!"</div>
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
      publicMessage: `<div class="effect-description">💃 The graceful <span class="effect-card">Countess</span> turns on her heel, eyes aflame. Without a word, she leaves <span class="effect-player">${
        playerData.name || player
      }</span> behind, her fan snapping shut with an icy hiss ❄️.</div>`,
      // Personal message for the player's modal (if needed)
      playerMessage: `<div class="effect-description top">The <span class="effect-card">Countess</span> gazes at you, her expression caught between hurt and outrage 🔥.</div>
<div class="effect-description"><span class="quotation countess">“I had faith in your judgment,”</span> she says, voice trembling with indignation. <span class="quotation countess">“But to seek counsel among such men?”</span> 😠</div>
<div class="effect-description">Her fan closes with a sharp crack 🪭. <span class="quotation countess">“That drunkard of a King… that possessive fool of a Prince! You would lower yourself to their level? <strong>Then you no longer need *my* counsel.</strong>”</span></div>
<div class="effect-description">She turns away, perfume and resentment trailing behind her 🥀. You just lost a precious ally whose pride burns brighter than any crown 👑.</div>`,
    };
  } catch (error) {
    console.error("🎭 COUNTESS ERROR: Royal scandal!", error);
    return {
      result: "error",
      message: "The Countess encountered a royal mishap!",
    };
  }
}

export async function applyAssassinEffect({ player }) {
  console.log("🗡️ ASSASSIN DEBUG: A shadow moves in the court...", {
    player,
  });

  try {
    return {
      result: "assassin_played",
      message: `A shadow passes through the court...`,
      // Mysterious notification for everyone in the court
      publicMessage: `<div class="effect-description">🌙🐾 A shadow glides silently through the corridors... Was it merely a cat, or something far more sinister? <span class="effect-player">${player}</span> seems to have noticed something, but speaks not a word. 🕯️✨</div>`,
      // Personal dramatic message for the player's modal
      playerMessage: `<div class="effect-description">🐾 A shadow passes through the court like a whisper of silk...</div>
      <div class="effect-description">Your lethal asset slips away unnoticed, but your opportunity for a decisive strike is now lost.</div>
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

export async function applyPhantomKingEffect({
  roomCode,
  attacker,
  target,
  selectedCardIndex,
}) {
  const gameRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(gameRef);

  if (!snapshot.exists()) {
    throw new Error("The royal chambers have vanished...");
  }

  const gameData = snapshot.val();

  const attackerData = gameData.players[attacker];
  const targetData = gameData.players[target];
  const attackerHand = attackerData.hand;
  const targetHand = targetData.hand;
  const phantomKingCard = attackerHand[selectedCardIndex];
  const attackerSecondCardIndex = selectedCardIndex === 0 ? 1 : 0;
  const attackerCard = attackerHand[attackerSecondCardIndex]; // Attacker's remaining card
  const targetCard = targetHand[0]; // Target's card

  if (
    !targetHand ||
    targetHand.length !== 1 ||
    !attackerHand ||
    attackerHand.length !== 2
  ) {
    throw new Error(
      "The Phantom King requires the target to have exactly one card and the attacker to have exactly two cards..."
    );
  }

  console.log("👻 PHANTOM KING DEBUG: Game data loaded", {
    phantomKingCard,
    targetHand,
    attackerHand,
  });

  // ----------
  try {
    // STEP 1: Apply hand swap effect
    console.log("🎭 PHANTOM KING STEP 1: Before swaping hands...");

    const newAttackerHand =
      selectedCardIndex === 0
        ? [phantomKingCard, targetCard]
        : [targetCard, phantomKingCard];
    const newTargetHand = [attackerCard];

    console.log("🎭 PHANTOM KING: Preparing mystical exchange between:", {
      attackerCard: attackerCard.name,
      targetCard: targetCard.name,
    });

    // Normal swap case - check if we have the required data
    if (!attackerCard || !targetCard) {
      console.error("👻 PHANTOM KING ERROR: Missing card data");
      setResultModalData({
        resultText:
          "❌ The Phantom King's power failed... Something went wrong with the card exchange.",
      });
      return;
    }

    // Apply the hand swap in Firebase (moved from cardEffects.js)
    console.log("👻 PHANTOM KING: Applying hand swap to Firebase");
    const updates = {
      [`players/${attacker}/hand`]: newAttackerHand, // Attacker gets target's card
      [`players/${target}/hand`]: newTargetHand, // Target gets attacker's card
    };
    await update(ref(db, `rooms/${roomCode}`), updates);
    console.log("👻 PHANTOM KING: Hand swap completed");
  } catch (error) {
    console.error("👻 PHANTOM KING ERROR: Mystical exchange failed!", error);
    throw new Error("The Phantom King's power faltered...");
  }

  // ---------------------

  const returnValue = {
    result: "success",
    newAttackerCard: targetCard,
    newTargetCard: attackerCard,

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
    const attackerSecondCard = attackerData.hand.find((card) => card.id !== 13); // The other card in attacker's hand
    const royalConfessorCard = attackerData.hand.find((card) => card.id === 13);

    const target1Card = isSelfTarget
      ? attackerSecondCard
      : gameData.players[target1].hand[0];
    const target2Card = gameData.players[target2].hand[0];

    // STEP 1: Apply hand swap effect (now both players have exactly 1 card)
    console.log("🎭 ROYAL CONFESSOR: Preparing mutual confession between:", {
      target1Card: target1Card.name,
      target2Card: target2Card.name,
    });

    // Normal swap case - check if we have the required data
    if (!target1Card || !target2Card) {
      console.error("👻 ROYAL CONFESSOR ERROR: Missing card data");
      setResultModalData({
        resultText:
          "❌ The Mutual Confession ritual failed... Something went wrong with the card exchange.",
      });
      return;
    }

    const selfTargetNewHand =
      selectedCardIndex === 0
        ? [royalConfessorCard, target2Card]
        : [target2Card, royalConfessorCard];

    const attackerNewHand = isSelfTarget ? selfTargetNewHand : [target2Card];

    // Apply the hand swap in Firebase (moved from cardEffects.js)
    console.log("ROYAL CONFESSOR: Applying hand swap to Firebase");
    const updates = {
      [`players/${target1}/hand`]: attackerNewHand, // Attacker gets target's card
      [`players/${target2}/hand`]: [target1Card], // Target gets attacker's card
    };
    await update(ref(db, `rooms/${roomCode}`), updates);

    console.log("ROYAL CONFESSOR: Hand swap completed");

    const newTarget1Card = target2Card;
    const newTarget2Card = target1Card;

    const externalAttackerMessage = `<div class="effect-description top">The Royal Confessor clasps his hands piously. <span class="quotation">“Sin festers when left alone,”</span> he declares. <span class="quotation">“Let <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span> cleanse each other's souls before the light.”</span></div>
<div class="effect-description">While they whisper, he listens — not so — discreetly, eyes twinkling through the incense 👀✨. Then he turns to you with a knowing grin:</div>
<div class="effect-description quotation">“A fine selection, my child. As reward for your pious donations, allow me to share a morsel of their wickedness...”</div>`;

    // Attacker message (when attacker = target1)

    const attackerSelfTargetMessage = `<div class="effect-description top">Seeking divine favor, you step forth before the Royal Confessor.</div>
<div class="effect-description"><span class="quotation">“Such humility warms the heavens,”</span> he proclaims. <span class="quotation">“<span class="effect-player">${target2}</span> shall join you — for nothing cleanses the soul like mutual confession.”</span></div>
<div class="effect-description">As your whispers fade, he leans closer, smirking beneath his hood:</div>
<div class="effect-description quotation">“A brave act, my child. And between us… their secret was well worth the effort, don’t you think?”</div>`;

    const target2Message = `<div class="effect-description confessor top">The Royal Confessor’s voice booms through the chapel: <span class="quotation">“By order of our devout benefactor, <span class="effect-player">${attacker}</span>, you and <span class="effect-player">${
      isSelfTarget ? "them" : target1
    }</span> shall purify your hearts before the light!”</span></div>
<div class="effect-description confessor">You kneel beside <span class="effect-player">${target1}</span>, exchanging your hidden sins as incense clouds the air.</div>
<div class="effect-description confessor">The Confessor nods gravely, though his eager eyes betray a man far too pleased to learn some delicious court's secrets 👀✨.</div>`;

    const target1Message = `<div class="effect-description confessor top">The Royal Confessor’s voice booms through the chapel: <span class="quotation">“By order of our devout benefactor, <span class="effect-player">${attacker}</span>, you and <span class="effect-player">${target2}</span> shall purify your hearts before the light!”</span></div>
<div class="effect-description confessor">You kneel beside <span class="effect-player">${target2}</span>, exchanging your hidden sins as incense clouds the air.</div>
<div class="effect-description confessor">The Confessor nods gravely, though his eager eyes betray a man far too pleased to learn some delicious court's secrets 👀✨.</div>`;

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
    console.error("ROYAL CONFESSOR EXCHANGE ERROR:", error);
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

    // Craft dramatic medieval-geek messages
    const publicMessage = `<div class="effect-title">😱 ROYAL CATASTROPHE! 😱</div>
    <div class="effect-description">In a moment of desperate love, <span class="effect-player">${playerName}</span> approached the Princess directly...</div>
    <div class="effect-description">But in all her royal dignity, she simply turned away! 💔</div>
    <div class="effect-description"><span class="quotation">"You presume too much!"</span> declared Her Highness.</div>
    <div class="effect-warning"><span class="effect-player">${playerName}</span> is banished from the royal court! 👑✨</div>`;
    const playerMessage = `<div class="effect-description top">Oh no! You've been rejected by the <span class="effect-card">PRINCESS</span>...! 🙈</div>
    <div class="effect-description">You approached Her Royal Highness directly with your letter...</div>
    <div class="effect-description">But she gave you the coldest royal stare before walking away, ignoring you. 💔</div>
    <div class="effect-warning">You are eliminated from the round, you hopeless romantic! 😘</div>
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
    const roomData = snapshot.val();

    const targetPlayer = roomData.players[target];
    const attackerPlayer = roomData.players[attacker];
    const targetCard = targetPlayer.hand[0];
    let newTargetCard;

    const wasCorrect = targetCard.strength === guess;
    const isPrincessFound = targetCard.id === 8 && wasCorrect;

    console.log(
      `🕵️ INVESTIGATION: ${wasCorrect ? "CORRECT" : "WRONG"} guess - found ${
        targetCard.name
      } (strength ${targetCard.strength})`
    );

    if (wasCorrect) {
      // Award love token to attacker first
      await awardLoveToken({
        roomCode,
        player: attacker,
      });

      if (isPrincessFound) {
        // Princess found - eliminate target (no new card draw)

        const eliminationUpdates = handlePlayerElimination(
          roomCode,
          target,
          roomData?.mode,
          targetPlayer,
          {},
          { discardRemainingHand: true }
        );

        await update(ref(db, `rooms/${roomCode}`), eliminationUpdates);

        console.log(
          "🕵️ PRINCESS ELIMINATION: Inquisitor's Target eliminated for heresy"
        );
      } else {
        // Normal discard and draw new card
        const round = roomData.round;
        newTargetCard = round.deck[0];
        const newDeck = round.deck.slice(1);

        const baseUpdates = {
          [`players/${target}/hand`]: [newTargetCard],
          [`players/${target}/discard`]: [
            ...(targetPlayer.discard || []),
            targetCard,
          ],
          [`round/deck`]: newDeck,
        };

        const finalUpdates = handleCardDiscard({
          roomCode,
          playerName: target,
          card: targetCard,
          gameMode: roomData?.mode,
          existingUpdates: baseUpdates,
        });

        await update(ref(db, `rooms/${roomCode}`), finalUpdates);

        console.log(
          "🕵️ HAND REPLACEMENT: Inquisitor's target discarded and drew new card"
        );
      }
    }

    // ----------------------------------

    let attackerMessage, targetMessage, publicMessage;

    if (!wasCorrect) {
      // Wrong guess - no effects, just messages
      attackerMessage = `<div class="effect-description top">🔍 Your Inquisitor searched for a heretic of <span class="effect-strength">strength ${guess}</span> at <span class="effect-player">${attackerPlayer.name}</span>'s place,  but didn't find the suspect.</div>
      <div class="effect-description">⚖️ The investigation yields nothing...</div>`;

      targetMessage = `<div class="effect-description top">🕵️ <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor came looking for some heretic of strength <span class="effect-strength">${guess}</span> at your place...</div>
      <div class="effect-description">🛡️ But they only found you in the company of <span class="effect-card">${
        targetCard.name
      }</span> (Strength <span class="effect-strength">${
        targetCard.strength
      }</span>).</div>
      <div class="effect-description">✨ You are safe from their investigation!</div>`;

      publicMessage = `<div class="effect-description">🔍 <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor investigated <span class="effect-player">${
        targetPlayer.name || target
      }</span> but found no evidence of wrongdoing.</div>`;
    } else if (isPrincessFound) {
      // Correct guess AND Princess found - SCANDAL!
      attackerMessage = `<div class="effect-description top">SCANDALOUS DISCOVERY! 😱 Your Inquisitor found <span class="effect-player">${
        targetPlayer.name || target
      }</span> consorting directly with the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-description">💰 Your cunning investigation earns you a <span class="effect-success">Love Token</span>!</div>
      <div class="effect-description">⚖️ Such impropriety cannot be tolerated - they are <span class="effect-elimination">ELIMINATED</span>!</div>`;

      targetMessage = `<div class="effect-description top">⛪ DIVINE JUDGMENT! 🌩️ <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor discovered your secret meetings with the <span class="effect-card">PRINCESS</span>!</div>
      <div class="effect-description">The Church declares this shocking impropriety absolutely intolerable! 🔥</div>
      <div class="effect-description">You are <span class="effect-elimination">ELIMINATED</span> for this scandalous breach of protocol!</div>`;

      publicMessage = `<div class="effect-description">⛪ SCANDAL! <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor found <span class="effect-player">${
        targetPlayer.name || target
      }</span> consorting with the <span class="effect-card">PRINCESS</span>! <span class="effect-elimination">${
        targetPlayer.name || target
      } eliminated for this shocking impropriety.</span></div>`;
    } else {
      // Correct guess but not Princess - normal investigation success
      attackerMessage = `<div class="effect-description top">🕵️ INVESTIGATION SUCCESSFUL! Your Inquisitor found the heretic they were looking for in <span class="effect-player">${
        targetPlayer.name || target
      }</span>'s company.</div>
      <div class="effect-description">Your cunning earns you a <span class="effect-success">Love Token</span>! 💰</div>
      <div class="effect-description">They must dismiss their heretic ally and seek new counsel... </div>`;

      targetMessage = `<div class="effect-description top">🔍 ROYAL INVESTIGATION! <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor suspected you of plotting with some heretic of strength <span class="effect-strength">${guess}</span>...</div>
      <div class="effect-description">They were RIGHT! 😱 They discovered your <span class="effect-card">${
        targetCard.name
      }</span> ally in your company!</div>
      <div class="effect-description">⚖️ Your treacherous alliance is exposed - dismiss your accomplice immediately!</div>`;

      publicMessage = `<div class="effect-description">🕵️ <span class="effect-player">${
        attackerPlayer.name || attacker
      }</span>'s Inquisitor exposed <span class="effect-player">${
        targetPlayer.name || target
      }</span>'s <span class="effect-card">${
        targetCard.name
      }</span>! Secrets revealed!</div>`;
    }

    return {
      result: wasCorrect ? "correctGuess" : "wrongGuess",
      princessDiscarded: isPrincessFound,
      cardDetails: newTargetCard ? { targetCard, newTargetCard } : null,
      attackerMessage,
      targetMessage,
      publicMessage,
    };
  } catch (error) {
    console.error("🕵️ INQUISITOR ERROR:", error);
    return {
      result: "error",
      error: error.message,
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
    const isSelfTarget = attacker === target;

    // DON'T set nextTarget here - it will be set in completeCourtWhispererTurn
    // when the attacker clicks "Continue" on their EffectResultModal

    // Generate gossip magazine style messages! 💅📰
    const attackerMessage = isSelfTarget
      ? `<div class="effect-description top">✨ You lean closer to the <span class="effect-card">Court Whisperer</span> and murmur secrets — about yourself. 😏</div>
<div class="effect-description">Their painted smile widens. <span class="quotation">“Oh, how daring…”</span> they purr, already savoring the story.</div>
<div class="effect-description">By nightfall, your name dances through every corridor — servants, courtiers, even the guards at the gate whisper it with delight. 🕯️</div>
<div class="effect-warning">You're the center of every conversation… and all eyes turn your way — including hers. 💖</div>
<div class="effect-technical">🎯 Next player MUST target <span style="font-weight: bold;">YOU</span> (if their card requires targeting)</div>`
      : `<div class="effect-description top">
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

    const targetMessage = `<div class="effect-description top">
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
      isSelfTarget,
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

    if (
      !data ||
      !data.players ||
      !data.players[target1] ||
      !data.players[target1].hand ||
      data.players[target1].hand.length === 0
    ) {
      return {
        result: "error",
        message: "Target1 player not found, or Target1 player has no cards",
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

    // Generate romantic narratives 💋✨
    const attackerMessage = target2
      ? `<div class="effect-description baroness top">🍷✨ At her evening soirée, the Baroness fans herself with excitement. <span class="quotation">"Ah, <span class="effect-player">${attacker}</span>, my favorite dreamer of romance,"</span> she says with a wink. 💋 <span class="quotation">"Allow me to see which rivals might stand in your way!"</span></div>
<div class="effect-description baroness">🌹 She drifts toward <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span>, filling their glasses and their hearts with confidence until they speak too freely. 🥂</div>
<div class="effect-description baroness">Later, she returns to you, eyes sparkling. ✨ <span class="quotation">"Well,"</span> she whispers, <span class="quotation">"I've uncovered the allies who guard their letters... and what a charming tangle of love it is!"</span> 💕</div>`
      : `<div class="effect-description baroness">🍷✨ At her evening soirée, the Baroness fans herself with excitement. <span class="quotation">"Ah, <span class="effect-player">${attacker}</span>, my favorite dreamer of romance,"</span> she says with a wink. 💋 <span class="quotation">"Allow me to see which rival might stand in your way!"</span></div>
<div class="effect-description baroness">🌹 She drifts toward <span class="effect-player">${target1}</span>, filling their glass and their heart with confidence until they speak too freely. 🥂</div>
<div class="effect-description baroness">Later, she returns to you, eyes sparkling. ✨ <span class="quotation">"Well,"</span> she whispers, <span class="quotation">"I've uncovered the ally who guards their letter... what a charming secret it is."</span> 💕</div>`;

    const target1Message = target2
      ? `<div class="effect-description baroness top">🎉💋 The Baroness' soirée hums with laughter when she takes your arm. <span class="quotation">"Darling <span class="effect-player">${target2}</span>, you and I need a little talk of love,"</span> she says with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself across from <span class="effect-player">${target2}</span>, your every word flowing far too freely. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`
      : `<div class="effect-description baroness">🎉💋 The Baroness' soirée hums with laughter when she takes your arm with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself speaking far too freely about your romantic intentions. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`;

    let target2Message = null;
    if (target2) {
      target2Message = `<div class="effect-description baroness top">🎉💋 The Baroness' soirée hums with laughter when she takes your arm. <span class="quotation">"Darling <span class="effect-player">${target1}</span>, you and I need a little talk of love,"</span> she says with a playful smile. 😘</div>
<div class="effect-description baroness">🍷 Moments later, you find yourself across from <span class="effect-player">${target1}</span>, your every word flowing far too freely. 💬✨</div>
<div class="effect-description baroness">😱 You realize, too late, that it was all arranged by <span class="effect-player">${attacker}</span> — the Baroness's favorite suitor — who now knows more than they should. 🕵️‍♀️💕</div>`;
    }

    const publicMessage = target2
      ? `<div class="effect-description">🍷✨ <span class="quotation">💋 At her grand soirée,</span> the Baroness — ever eager to play the royal matchmakers — drew <span class="effect-player">${target1}</span> and <span class="effect-player">${target2}</span> into a most revealing conversation. 💬🌹</div>
<div class="effect-description">Later, she obviously shared their secrets with the suitor who, in her opinion, would match the best with the princess: <span class="effect-player">${attacker}</span>! 💕👑</div>`
      : `<div class="effect-description">🍷✨ <span class="quotation">💋 At her grand soirée,</span> the Baroness — ever eager to play the royal matchmakers — drew <span class="effect-player">${target1}</span> into a most revealing conversation. 💬🌹</div>
<div class="effect-description">Later, she obviously shared their secrets with the suitor who, in her opinion, would match the best with the princess: <span class="effect-player">${attacker}</span>! 💕👑</div>`;

    return {
      result: "baronessReveal",
      attacker,
      target1,
      target2,
      target1Card,
      target2Card,
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

export async function applyDukeEffect({ player }) {
  try {
    const attackerMessage = `
<div class="effect-description top">👑 The Duke approaches you with quiet authority. His loyal little hound 🐕 trots proudly at his heels, wearing a velvet collar far too grand for its size.</div>
<div class="effect-description"><span class="quotation duke">"My dear <span class="effect-player">${player}</span>,"</span> the Duke says, <span class="quotation duke">"my niece deserves sincerity, not showmanship. And you have shown both courage and patience — virtues I hold dear."</span></div>
<div class="effect-description quotation">"Take my blessing. While I stand in your corner, your name shall carry greater weight in this court."</div>
<div class="effect-description">The tiny dog lets out a solemn <span class="quotation duke">"woof,"</span> 🐾 as if sealing the vow.</div>
<div class="effect-technical">✨ If you're still standing when the round ends, add +1 to your last card's strength!</div>`;

    const publicMessage = `
<div class="effect-description">🏛️ The Duke, uncle to the Princess, has granted his favor to <span class="effect-player">${player}</span>.</div><div class="effect-description">His word elevates their standing in the eyes of the court.</div>`;

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
