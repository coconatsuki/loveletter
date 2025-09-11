import { ref, update, get } from "firebase/database";
import { db } from "./firebase";
import { cards } from "./cardsData";
import { logRoundEndCheck } from "./roundEndDetection";

// Turn advancement control for modal system
export const CARD_MODAL_FLOW = {
  1: { advanceOnAttacker: true, advanceOnTarget: false }, // Guard
  2: { advanceOnAttacker: true, advanceOnTarget: false }, // Priest
  3: { advanceOnAttacker: true, advanceOnTarget: false }, // Baron
  4: { advanceOnAttacker: true, advanceOnTarget: false }, // Handmaid
  5: { advanceOnAttacker: false, advanceOnTarget: true }, // Prince (special case)
  6: { advanceOnAttacker: true, advanceOnTarget: false }, // Phantom King
  7: { advanceOnAttacker: true, advanceOnTarget: false }, // Countess
  8: { advanceOnAttacker: true, advanceOnTarget: false }, // Princess
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
  13: 0, // Royal Confessor
  14: 0, // Assassin
  15: 2, // Baroness
  16: 3, // Duke
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

  // Check for round end after elimination
  logRoundEndCheck("After Assassin Defense", roomCode);

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
  const cardData = cards.find((c) => c.id === targetCard.id);
  const enrichedTargetCard = {
    ...targetCard,
    effect: cardData?.effect || "Unknown card effect",
  };

  return {
    result: "revealCard",
    attacker,
    target,
    targetCard: enrichedTargetCard,
    // Fun medieval notification messages 🏰
    attackerMessage: `🔍✨ The divine light reveals ${targetPlayer.name}'s secret! They hold: ${enrichedTargetCard.name} (Strength ${enrichedTargetCard.strength})`,
    targetMessage: `🙈⚡ A holy priest peers into your soul! Your ${
      enrichedTargetCard.name
    } has been revealed to ${data.players[attacker]?.name || attacker}!`,
    publicMessage: `🔮📿 ${
      data.players[attacker]?.name || attacker
    } plays Priest and communes with the spirits to glimpse ${
      targetPlayer.name
    }'s hand! The mystic arts are at work... 🌟`,
  };
}

export async function applyBaronEffect({ roomCode, attacker, target }) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  const data = snapshot.val();

  const attackerCard = data.players[attacker].hand[0];
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

  // NOTE: We do NOT eliminate the player here - that will be done when the modal is confirmed
  // The Baron effect only compares cards and returns the result
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
    // Medieval notifications for different audiences
    attackerMessage:
      eliminatedPlayer === target
        ? `⚔️🏆 Your Baron's duel is victorious! Your ${
            enrichedAttackerCard.name
          } (${enrichedAttackerCard.strength}) defeats ${
            data.players[target]?.name || target
          }'s ${enrichedTargetCard.name} (${
            enrichedTargetCard.strength
          }). They are eliminated from the round!`
        : eliminatedPlayer === attacker
        ? `⚔️💀 Your Baron's duel ends in defeat! Your ${
            enrichedAttackerCard.name
          } (${enrichedAttackerCard.strength}) falls to ${
            data.players[target]?.name || target
          }'s ${enrichedTargetCard.name} (${
            enrichedTargetCard.strength
          }). You are eliminated!`
        : `⚔️🤝 An honorable draw! Your ${enrichedAttackerCard.name} (${
            enrichedAttackerCard.strength
          }) matches ${data.players[target]?.name || target}'s ${
            enrichedTargetCard.name
          } (${
            enrichedTargetCard.strength
          }). Both knights live to fight another day!`,

    targetMessage:
      eliminatedPlayer === target
        ? `⚔️💀 A Baron challenges you to a duel and emerges victorious! Their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}) defeats your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}). You are eliminated from the round!`
        : eliminatedPlayer === attacker
        ? `⚔️🏆 A Baron challenges you to a duel but you triumph! Your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}) defeats their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}). The challenger is eliminated!`
        : `⚔️🤝 A Baron challenges you to an honorable duel! Your ${enrichedTargetCard.name} (${enrichedTargetCard.strength}) matches their ${enrichedAttackerCard.name} (${enrichedAttackerCard.strength}). 'Tis a tie - both knights stand strong!`,

    publicMessage: eliminatedPlayer
      ? `⚖️💥 ${
          data.players[attacker]?.name || attacker
        } plays Baron and challenges ${
          data.players[target]?.name || target
        } to a duel of honor! ${loserCard.name} (${
          loserCard.strength
        }) falls to superior strength - ${
          data.players[eliminatedPlayer]?.name || eliminatedPlayer
        } is eliminated! ⚔️👑`
      : `⚖️🤝 ${
          data.players[attacker]?.name || attacker
        } plays Baron and challenges ${
          data.players[target]?.name || target
        } to a duel! Both cards match in strength - an honorable draw with no casualties! 🛡️✨`,
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
  const updates = {
    [`players/${target}/hand`]: newHand,
    [`players/${target}/discard`]: newTargetDiscard,
    [`round/deck`]: deckAfterDraw,
  };

  // If Princess was discarded, eliminate the target
  if (wasPrincessDiscarded) {
    updates[`players/${target}/isOut`] = true;
  }

  await update(ref(db, `rooms/${roomCode}`), updates);

  // Generate royal messages! 👑✨
  const attackerName = data.players[attacker]?.name || attacker;
  const targetName = data.players[target]?.name || target;
  const discardedCardName = targetCard.name;
  const newCardName = newCard?.name || "none";

  let publicMessage, attackerMessage, targetMessage;

  if (wasPrincessDiscarded) {
    // Princess elimination scenario! 😱💀
    if (isSelfTarget) {
      publicMessage = `👑💀 OH NO! ${attackerName} commanded themselves to discard... and revealed the PRINCESS! They are eliminated from the royal court! The Princess cannot be discarded! 💀👑`;
      attackerMessage = `👑💀 ROYAL TRAGEDY! 💀👑\n\nBy your own royal decree, you commanded yourself to discard your hand...\nBut alas! You held the PRINCESS!\n\n💀 The Princess cannot be discarded for any reason!\n💀 You are eliminated from the round!\n\n"Even royalty must follow the rules of love..."\n- The Court`;
    } else {
      publicMessage = `👑💀 ROYAL CATASTROPHE! ${attackerName} commanded ${targetName} to discard their hand... revealing the PRINCESS! ${targetName} is eliminated! The Princess's beauty cannot be discarded! 💀👑`;
      attackerMessage = `👑💀 ROYAL CATASTROPHE! 💀👑\n\nYour royal decree was followed...\nBut ${targetName} held the PRINCESS!\n\nDiscarded Card: ${discardedCardName} (Strength: ${targetCard.strength})\n\n💀 The Princess cannot be discarded!\n💀 ${targetName} is eliminated!\n\n"Love's greatest treasure cannot be cast aside..."\n- The Royal Court`;
      targetMessage = `👑💀 ROYAL DOOM! 💀👑\n\n${attackerName} commanded you with the Prince's authority to discard your hand...\n\nYour card was: ${discardedCardName} (Strength: ${targetCard.strength})\n\nBut... it was the PRINCESS! 💀\n\nThe Princess cannot be discarded for any reason!\nYou are eliminated from the round!\n\n"Even under royal command, love cannot be discarded..."\n- The Princess`;
    }
  } else {
    // Normal Prince effect
    if (isSelfTarget) {
      publicMessage = `👑✨ ${attackerName} uses the Prince's wisdom on themselves! They discard ${discardedCardName} and ${
        drewNewCard
          ? `draw ${newCardName}`
          : "find no cards left in the royal deck"
      }! A fresh start from the royal court! ✨👑`;
      attackerMessage = `👑✨ ROYAL SELF-REFLECTION! ✨👑\n\nBy your own royal decree, you have renewed your hand!\n\nDiscarded: ${discardedCardName} (Strength: ${
        targetCard.strength
      })\n${
        drewNewCard
          ? `New Card: ${newCardName} (Strength: ${newCard.strength})`
          : "No cards remain in the royal deck!"
      }\n\n"Wisdom lies in knowing when to start anew..."\n- His Royal Highness, The Prince`;
    } else {
      publicMessage = `👑✨ ${attackerName} commands ${targetName} with the Prince's authority! ${targetName} discards ${discardedCardName} and ${
        drewNewCard ? `draws a fresh card` : "finds the royal deck empty"
      }! By royal decree! ✨👑`;
      attackerMessage = `👑✨ ROYAL DECREE EXECUTED! ✨👑\n\nYour command has been followed!\n${targetName} discarded: ${discardedCardName} (Strength: ${
        targetCard.strength
      })\n${
        drewNewCard
          ? `They drew a new card from the royal deck!`
          : "The royal deck was empty - no new card drawn!"
      }\n\n"The Prince's wisdom guides the court..."\n- The Royal Court`;
      targetMessage = `👑✨ ROYAL COMMAND! ✨👑\n\n${attackerName} has commanded you with the Prince's authority!\n\nYour discarded card: ${discardedCardName} (Strength: ${
        targetCard.strength
      })\n${targetCard.effect ? `Effect: ${targetCard.effect}` : ""}\n\n${
        drewNewCard
          ? `Your new card: ${newCardName} (Strength: ${newCard.strength})\n${
              newCard.effect ? `Effect: ${newCard.effect}` : ""
            }`
          : "The royal deck was empty - you draw no new card!"
      }\n\n"By royal decree, a fresh beginning awaits..."\n- His Royal Highness, The Prince`;
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
    publicMessage: `🫖✨ ${
      data.players[player]?.name || player
    } calls upon the Princess' Handmaid! She graciously invites them for tea and biscuits in her cozy chambers. They are now protected until their next turn! ☕🛡️`,
    // Personal message for the protected player's modal
    playerMessage: `🫖✨ THE PRINCESS' HANDMAID ✨🫖\n\nThe Princess' loyal Handmaid has taken you under her wing! She invites you for tea and biscuits in her cozy chambers.\n\n☕ Protection Status: ACTIVE ☕\n⏰ Duration: Until your next turn begins\n🛡️ Effect: You cannot be targeted by any cards\n\n"Come, dear guest, let us chat by the fireplace while the others play their games. You're safe with me!"\n- The Princess' Handmaid`,
  };
}

export async function applyCountessEffect({ roomCode, player }) {
  console.log("🎭 COUNTESS DEBUG: The royal matriarch takes the stage...", {
    player,
  });

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
      publicMessage: `🎭✨ The Countess herself has appeared in court with ${
        playerData.name || player
      }! Her regal presence commands attention as she whispers secrets of court intrigue. What royal machinations are afoot? 👑💫`,
      // Personal message for the player's modal (if needed)
      playerMessage: `🎭✨ THE COUNTESS ✨🎭\n\nYou have played the Countess!\n\n👑 Royal Effect: None.\n🎪 Protocol: Always takes precedence over the Prince or the King, for matters related to the Princess.\n\n"My dear, no one knows the Princess as I do. Let me handle that."\n- The Countess`,
    };
  } catch (error) {
    console.error("🎭 COUNTESS ERROR: Royal scandal!", error);
    return {
      result: "error",
      message: "The Countess encountered a royal mishap!",
    };
  }
}

export async function applyPhantomKingEffect({ roomCode, attacker, target }) {
  console.log("🎭 PHANTOM KING DEBUG: The ethereal sovereign awakens...", {
    attacker,
    target,
  });

  try {
    const gameRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error(
        "The royal chambers have vanished into the ethereal void..."
      );
    }

    const gameData = snapshot.val();
    const attackerData = gameData.players[attacker];

    // Handle "Nobody" selection (skip effect)
    if (target === "Nobody") {
      console.log("🎭 PHANTOM KING: The king chooses discretion over action");

      return {
        result: "skipped",
        message: `👻 ${attacker} gazed into the shadows and chose to keep their royal secrets... The Phantom King's power remains dormant.`,
        resultText: `🎭 ROYAL DISCRETION! 👑

You chose not to trade hands with anyone.

"Sometimes the greatest power is knowing when not to use it..."
- The Phantom King

*The shadows whisper of wisdom in restraint*`,
        attackerMessage: null, // No additional modal needed
        targetMessage: null,
      };
    }

    const targetData = gameData.players[target];

    if (!targetData || targetData.isOut) {
      throw new Error(
        "The chosen soul has already departed from this realm..."
      );
    }

    // Get the cards to trade - at this point Phantom King should already be discarded
    if (!attackerData.hand || attackerData.hand.length !== 1) {
      throw new Error(
        "The phantom requires exactly one card remaining after playing the Phantom King..."
      );
    }

    if (!targetData.hand || targetData.hand.length !== 1) {
      throw new Error("The target must have exactly one card to exchange...");
    }

    // Get the remaining cards
    const attackerCard = attackerData.hand[0]; // Attacker's remaining card
    const targetCard = targetData.hand[0]; // Target's card

    console.log("🎭 PHANTOM KING: Weaving mystical exchange between:", {
      attackerCard: attackerCard.name,
      targetCard: targetCard.name,
    });

    // Prepare the ethereal hand swap:
    // Attacker gets target's card, target gets attacker's card
    const updatedAttackerHand = [targetCard];
    const updatedTargetHand = [attackerCard];

    // Update Firebase with the spectral exchange
    const updates = {
      [`players/${attacker}/hand`]: updatedAttackerHand,
      [`players/${target}/hand`]: updatedTargetHand,
    };

    await update(gameRef, updates);

    console.log(
      "🎭 PHANTOM KING: The mystical exchange is complete! Cards have crossed realms"
    );

    // Create atmospheric result messages
    const attackerResultText = `🎭 PHANTOM KING'S MYSTICAL EXCHANGE! 👑

Your royal decree has bound fates together!

**You surrendered:**
${attackerCard.name} (Strength: ${attackerCard.strength})
*"${attackerCard.effect || "A card of mysterious power"}"*

**You received in return:**
${targetCard.name} (Strength: ${targetCard.strength})  
*"${targetCard.effect || "A card of mysterious power"}"*

"Through shadow and mist, the cards have found new masters..."
- His Phantom Majesty`;

    const targetResultText = `👻 SUMMONED BY THE PHANTOM KING! 🎭

The ethereal sovereign has commanded an exchange of fates!

**Taken from your grasp:**
${targetCard.name} (Strength: ${targetCard.strength})
*"${targetCard.effect || "A card of mysterious power"}"*

**Bestowed upon you:**
${attackerCard.name} (Strength: ${attackerCard.strength})
*"${attackerCard.effect || "A card of mysterious power"}"*

"Your destiny intertwines with royal mystery... Accept this gift from beyond the veil."
- By Royal Phantom Decree`;

    return {
      result: "success",
      message: `👻 ${attacker} channeled the Phantom King's otherworldly power and exchanged destinies with ${target}! The cards have crossed between realms in a dance of shadows...`,
      resultText: attackerResultText,
      attackerMessage: {
        cardName: "Phantom King",
        from: attacker,
        message: attackerResultText,
        selectedCardIndex: 0, // Not used for Phantom King, but keep consistent
        shouldAdvanceTurn: true,
        visibleTo: attacker,
      },
      targetMessage: {
        cardName: "Phantom King",
        from: attacker,
        message: targetResultText,
        selectedCardIndex: 0,
        shouldAdvanceTurn: false, // Target modal just closes
        visibleTo: target,
      },
    };
  } catch (error) {
    console.error(
      "🎭 PHANTOM KING ERROR: The shadows reject this exchange:",
      error
    );
    return {
      result: "error",
      message: `💀 The Phantom King's power falters... ${error.message}`,
    };
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

    // Mark player as eliminated
    const updates = {
      [`rooms/${roomCode}/players/${player}/isOut`]: true,
    };

    await update(ref(db), updates);

    // Check for round end after Princess elimination
    logRoundEndCheck("After Princess Elimination", roomCode);

    console.log("👑 PRINCESS: Player eliminated by royal decree", {
      player,
      eliminated: true,
    });

    // Craft dramatic medieval-geek messages
    const publicMessage = `👑💀 ROYAL CATASTROPHE! ${playerName} has played the PRINCESS herself! 💀👑\n\n💔 In a moment of desperate love, they approached the Princess directly...\n💔 But the Princess, in all her royal dignity, simply turned away!\n💔 "${playerName}, you presume too much!" declared Her Highness.\n💔 They are banished from the royal court! 👑✨💀`;
    const playerMessage = `👑💀 ULTIMATE ROYAL BLUNDER! 💀👑\n\nOh no! You played the PRINCESS! 🙈\n\n💔 You approached Her Royal Highness directly with your letter...\n💔 But she gave you the coldest royal stare before walking away, ignoring you.\n\n💀 You are eliminated from the round, you hopeless romantic! 💀\n\n"Next time, try working your way up the social ladder first..."\n- The Princess (rolling her eyes) 🙄`;

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
