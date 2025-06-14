import { ref, update, get, child } from 'firebase/database';
import { db } from './firebase';

export async function applyGuardEffect({ roomCode, attacker, target, guess }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();
  const targetPlayer = data.players[target];
  const targetCard = targetPlayer.hand[0];
  const attackerCard = data.players[attacker].hand.find(c => c !== guess); // played card is guess

  const hasAssassin = targetCard === 0;

  if (hasAssassin) {
    return {
      requiresAssassinDecision: true,
      attacker,
      target,
      attackerCard
    };
  }

  const wasCorrect = targetCard === guess;

  if (wasCorrect) {
    return {
      result: "correctGuess",
      targetCard,
      eliminatedPlayer: target
    };
  } else {
    return {
      result: "wrongGuess",
      targetCard
    };
  }
}

export async function resolveAssassinDefense({ roomCode, attacker, target }) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  const data = snapshot.val();
  const deck = data.round.deck || [];

  const draw = deck.length > 0 ? deck[0] : null;
  const newDeck = deck.length > 0 ? deck.slice(1) : [];

  const updates = {
    [`players/${attacker}/isOut`]: true,
    [`players/${target}/hand`]: draw ? [draw] : [],
    [`players/${target}/discard`]: [...(data.players[target].discard || []), 0],
    round: {
      ...data.round,
      deck: newDeck
    }
  };

  await update(roomRef, updates);

  return {
    attackerEliminated: true,
    cardDrawn: draw
  };
}

export async function applyPriestEffect({ roomCode, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}/players/${target}`));
  const targetHand = snapshot.val()?.hand;
  return {
    result: "revealCard",
    card: targetHand?.[0]
  };
}
