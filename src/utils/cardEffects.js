import { ref, update, get } from "firebase/database";
import { db } from "./firebase";
import { cards } from "./cardsData";

const cardStrengths = {
  0: 0, // Jester
  1: 1, // Guard
  2: 2, // Priest
  3: 3, // Baron
  4: 4, // Handmaid
  5: 5, // Prince
  6: 6, // King
  7: 7, // Countess
  8: 8, // Princess
  9: 9, // Bishop
  10: 6, // Constable
  11: 7, // Dowager Queen
  12: 4, // Sycophant
  13: 0, // Cardinal
  14: 0, // Assassin
  15: 2, // Baroness
  16: 3, // Count
};

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

  const isPremium = data.mode === "premium";
  const hasAssassin = targetCard.id === 14;
  const wasCorrect = targetCard.strength === guess;

  return {
    requiresPrompt: isPremium,
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

  /*
  if (hasAssassin) {
    return {
      requiresAssassinDecision: true,
      attacker,
      target,
    };
  }
 
  return {
    result: wasCorrect ? "correctGuess" : "wrongGuess",
    targetCard,
    eliminatedPlayer: wasCorrect ? target : null,
  };
  */
}

export async function resolveAssassinDefense({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const deck = data.round.deck || [];

  const draw = deck.length > 0 ? deck[0] : null;
  const newDeck = deck.slice(1);

  const updates = {
    [`players/${attacker}/isOut`]: true,
    [`players/${target}/discard`]: [...(data.players[target].discard || []), 0],
    [`players/${target}/hand`]: draw ? [draw] : [],
    round: {
      ...data.round,
      deck: newDeck,
    },
  };

  await update(ref(db, `rooms/${roomCode}`), updates);

  return {
    attackerEliminated: true,
    newCard: draw,
  };
}

export async function applyPriestEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  
  if (!data || !data.players || !data.players[target]) {
    return {
      result: "error",
      message: "Target player not found",
    };
  }

  const targetPlayer = data.players[target];
  
  if (!targetPlayer || !targetPlayer.hand || targetPlayer.hand.length === 0) {
    return {
      result: "error",
      message: "Target has no cards",
    };
  }

  const targetCard = targetPlayer.hand[0];
  
  if (!targetCard) {
    return {
      result: "error", 
      message: "Target has no cards",
    };
  }

  // Enrich target card with effect description from cards data
  const cardData = cards.find(c => c.id === targetCard.id);
  const enrichedTargetCard = {
    ...targetCard,
    effect: cardData?.effect || "Unknown card effect"
  };

  return {
    result: "revealCard",
    attacker,
    target,
    targetCard: enrichedTargetCard,
    // Fun medieval notification messages 🏰
    attackerMessage: `🔍✨ The divine light reveals ${targetPlayer.name}'s secret! They hold: ${enrichedTargetCard.name} (Strength ${enrichedTargetCard.strength})`,
    targetMessage: `🙈⚡ A holy priest peers into your soul! Your ${enrichedTargetCard.name} has been revealed to ${data.players[attacker]?.name || attacker}!`,
    publicMessage: `🔮📿 ${data.players[attacker]?.name || attacker} plays Priest and communes with the spirits to glimpse ${targetPlayer.name}'s hand! The mystic arts are at work... 🌟`,
  };
}

export async function applyBaronEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  const attackerCard = data.players[attacker].hand[0];
  const targetCard = data.players[target].hand[0];
  
  // Enrich card data with names and effects from cardsData
  const enrichedAttackerCard = cards.find(c => c.id === attackerCard.id) || attackerCard;
  const enrichedTargetCard = cards.find(c => c.id === targetCard.id) || targetCard;

  let eliminatedPlayer = null;
  let winner = null;
  let winnerCard = null;
  let loserCard = null;

  // Compare card strengths - lower strength is eliminated
  if (attackerCard.strength > targetCard.strength) {
    eliminatedPlayer = target;
    winner = attacker;
    winnerCard = enrichedAttackerCard;
    loserCard = enrichedTargetCard;
  } else if (targetCard.strength > attackerCard.strength) {
    eliminatedPlayer = attacker;
    winner = target;
    winnerCard = enrichedTargetCard;
    loserCard = enrichedAttackerCard;
  }
  // If strengths are equal, it's a tie - no elimination

  // Eliminate the loser if there is one
  if (eliminatedPlayer) {
    await update(ref(db, `rooms/${roomCode}/players/${eliminatedPlayer}`), {
      isOut: true,
    });
  }

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
    // Medieval notifications for different audiences
    attackerMessage: eliminatedPlayer === target
      ? `⚔️🏆 Your Baron's duel is victorious! Your ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}) defeats ${data.players[target]?.name || target}'s ${enrichedTargetCard.name} (${enrichedTargetCard.strength}). They are eliminated from the round!`
      : eliminatedPlayer === attacker
      ? `⚔️💀 Your Baron's duel ends in defeat! Your ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}) falls to ${data.players[target]?.name || target}'s ${enrichedTargetCard.name} (${enrichedTargetCard.strength}). You are eliminated!`
      : `⚔️🤝 An honorable draw! Your ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}) matches ${data.players[target]?.name || target}'s ${enrichedTargetCard.name} (${enrichedTargetCard.strength}). Both knights live to fight another day!`,
    
    targetMessage: eliminatedPlayer === target
      ? `⚔️💀 A Baron challenges you to a duel and emerges victorious! Their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}) defeats your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}). You are eliminated from the round!`
      : eliminatedPlayer === attacker
      ? `⚔️🏆 A Baron challenges you to a duel but you triumph! Your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}) defeats their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}). The challenger is eliminated!`
      : `⚔️🤝 A Baron challenges you to an honorable duel! Your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}) matches their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}). 'Tis a tie - both knights stand strong!`,

    publicMessage: eliminatedPlayer
      ? `⚖️💥 ${data.players[attacker]?.name || attacker} plays Baron and challenges ${data.players[target]?.name || target} to a duel of honor! ${loserCard.name} (${loserCard.strength}) falls to superior strength - ${data.players[eliminatedPlayer]?.name || eliminatedPlayer} is eliminated! ⚔️👑`
      : `⚖️🤝 ${data.players[attacker]?.name || attacker} plays Baron and challenges ${data.players[target]?.name || target} to a duel! Both cards match in strength - an honorable draw with no casualties! 🛡️✨`
  };
}

export async function applyPrinceEffect({ roomCode, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const targetCard = data.players[target].hand[0];
  const deck = data.round.deck || [];
  const draw = deck.length > 0 ? deck[0] : null;
  const newDeck = deck.slice(1);

  const isEliminated = targetCard === 8;

  const updates = {
    [`players/${target}/discard`]: [
      ...(data.players[target].discard || []),
      targetCard,
    ],
    [`players/${target}/hand`]: isEliminated ? [] : draw ? [draw] : [],
    round: { ...data.round, deck: newDeck },
  };
  if (isEliminated) {
    updates[`players/${target}/isOut`] = true;
  }

  await update(ref(db, `rooms/${roomCode}`), updates);

  return {
    discardedCard: targetCard,
    isEliminated,
    newCard: draw,
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
