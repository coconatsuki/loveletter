import { ref, update, get } from "firebase/database";
import { db } from "./firebase";

export function getStartingPlayer(players, roundNumber = 1) {
  if (roundNumber === 1) {
    const names = Object.keys(players);
    return names[Math.floor(Math.random() * names.length)];
  } else {
    const max = Math.max(...Object.values(players).map((p) => p.tokens));
    const topScorers = Object.entries(players)
      .filter(([_, p]) => p.tokens === max)
      .map(([name]) => name);
    return topScorers[Math.floor(Math.random() * topScorers.length)];
  }
}

export function shuffleDeck(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getCardCount(cardId, gameMode, cards) {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return 0;

  const isPremiumMode = gameMode === "premium";
  return isPremiumMode ? card.countPremium : card.countNormal;
}

/**
 * Handles card discard logic and special token management (like Chamberlain)
 * @param {Object} params - The parameters
 * @param {string} params.roomCode - The room code
 * @param {string} params.playerName - The player discarding the card
 * @param {Object} params.card - The card being discarded
 * @param {string} params.gameMode - The game mode (normal/premium)
 * @param {Object} params.existingUpdates - Existing Firebase updates to append to
 * @returns {Promise<Object>} Firebase updates including any special token logic
 */
export async function handleCardDiscard({
  roomCode,
  playerName,
  card,
  gameMode,
  existingUpdates = {},
}) {
  const updates = { ...existingUpdates };

  // In premium mode, check if this is a Chamberlain card
  if (gameMode === "premium" && card.id === 10) {
    // Set ChamberlainToken flag to false (ready to be activated on elimination)
    updates[`players/${playerName}/chamberlainToken`] = false;
    console.log(
      `🏰💰 Chamberlain token set for ${playerName} - ready for elimination bonus`
    );
  }

  // In premium mode, check if this is a Duke card
  if (gameMode === "premium" && card.id === 16) {
    // Fetch current Duke token count from Firebase
    const snapshot = await get(
      ref(db, `rooms/${roomCode}/players/${playerName}`)
    );
    const playerData = snapshot.val();
    const currentDukeToken = playerData?.dukeToken || 0;

    console.log(
      `👑🐕 Current Duke token for ${playerName}: ${currentDukeToken}`
    );

    // Increment Duke token (can stack multiple Duke discards)
    updates[`players/${playerName}/dukeToken`] = currentDukeToken + 1;
    console.log(
      `👑🐕 Duke token incremented for ${playerName} - now has ${
        currentDukeToken + 1
      } Duke favor(s)`
    );
  }

  return updates;
}

/**
 * Handles player elimination logic and special token management (like Chamberlain)
 * @param {Object} params - The parameters
 * @param {string} params.roomCode - The room code
 * @param {string} params.playerName - The player being eliminated
 * @param {string} params.gameMode - The game mode (normal/premium)
 * @param {Object} params.currentPlayerData - Current player data from Firebase
 * @param {Object} params.existingUpdates - Existing Firebase updates to append to
 * @returns {Object} Firebase updates including any special token logic
 */
export function handlePlayerElimination(
  roomCode,
  playerName,
  gameMode,
  currentPlayerData,
  existingUpdates = {},
  options = {}
) {
  const { discardRemainingHand = true } = options;

  console.log(`🚨 HANDLE PLAYER ELIMINATION CALLED:`, {
    roomCode,
    playerName,
    gameMode,
    currentPlayerData: currentPlayerData
      ? {
          name: currentPlayerData.name,
          chamberlainToken: currentPlayerData.chamberlainToken,
          isOut: currentPlayerData.isOut,
        }
      : null,
    existingUpdates,
    discardRemainingHand,
  });

  const updates = { ...existingUpdates };

  // Set player as eliminated
  updates[`players/${playerName}/isOut`] = true;

  // In premium mode, check if this player has a Chamberlain token
  if (gameMode === "premium" && currentPlayerData) {
    console.log(
      `🏰 PREMIUM MODE: Checking Chamberlain token for ${playerName}`,
      {
        hasChamberlainToken: "chamberlainToken" in currentPlayerData,
        chamberlainTokenValue: currentPlayerData.chamberlainToken,
      }
    );

    // Check if player has ChamberlainToken set to false (meaning they discarded Chamberlain)
    if (currentPlayerData.chamberlainToken === false) {
      // Activate the token for love token reward at round end
      updates[`players/${playerName}/chamberlainToken`] = true;
      console.log(
        `🏰⚔️ Chamberlain token activated for eliminated player ${playerName} - they will earn a love token!`
      );
    } else {
      console.log(
        `🏰 NO CHAMBERLAIN ACTIVATION: Token value is ${currentPlayerData.chamberlainToken} (not false)`
      );
    }
  } else {
    console.log(
      `🏰 NO CHAMBERLAIN CHECK: gameMode=${gameMode}, hasPlayerData=${!!currentPlayerData}`
    );
  }

  // Discard any remaining hand cards to player's discard pile
  if (
    discardRemainingHand &&
    currentPlayerData?.hand &&
    currentPlayerData.hand.length > 0
  ) {
    console.log(
      `🃏 Discarding ${currentPlayerData.hand.length} remaining hand cards for eliminated player ${playerName}:`,
      currentPlayerData.hand
    );

    // Move all hand cards to discard pile
    const existingDiscard = currentPlayerData.discard || [];
    const newDiscard = [...existingDiscard, ...currentPlayerData.hand];

    updates[`players/${playerName}/discard`] = newDiscard;
    updates[`players/${playerName}/hand`] = [];

    console.log(
      `🃏 Hand cleanup complete for ${playerName} - ${currentPlayerData.hand.length} cards moved to discard`
    );
  } else {
    console.log(
      `🃏 No hand cleanup needed for ${playerName} - ${
        discardRemainingHand
          ? "hand is empty or undefined"
          : "discardRemainingHand option is false"
      }`
    );
  }

  console.log(`🚨 HANDLE PLAYER ELIMINATION RETURNING:`, updates);
  return updates;
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
    const currentRoundTokens = data.players[player]?.roundTokens || 0;

    // 🕵️ Track love token origin for inquisitor correct guess
    const existingOrigin = data.players[player]?.loveTokenOrigin || {};

    await update(ref(db, `rooms/${roomCode}/players/${player}`), {
      tokens: currentTokens + 1,
      roundTokens: currentRoundTokens + 1,
      loveTokenOrigin: {
        ...existingOrigin,
        inquisitorGuess: 1,
      },
    });

    console.log(
      `💰 SUCCESS: ${player} now has ${currentTokens + 1} love tokens`
    );
    return {
      success: true,
      newTokenCount: currentTokens + 1,
      newRoundTokenCount: currentRoundTokens + 1,
    };
  } catch (error) {
    console.error("💰 LOVE TOKEN ERROR:", error);
    return { success: false, error: error.message };
  }
}
