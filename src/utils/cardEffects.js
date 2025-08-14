import { ref, update, get } from "firebase/database";
import { db } from "./firebase";

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

export async function applyPriestEffect({ roomCode, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}/players/${target}`));
  return {
    result: "revealCard",
    card: snapshot.val()?.hand?.[0],
  };
}

export async function applyBaronEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  const aCard = data.players[attacker].hand[0];
  const tCard = data.players[target].hand[0];

  let eliminatedPlayer = null;
  if (aCard > tCard) eliminatedPlayer = target;
  else if (tCard > aCard) eliminatedPlayer = attacker;

  if (eliminatedPlayer) {
    await update(ref(db, `rooms/${roomCode}/players/${eliminatedPlayer}`), {
      isOut: true,
    });
  }

  return {
    attackerCard: aCard,
    targetCard: tCard,
    eliminatedPlayer,
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
