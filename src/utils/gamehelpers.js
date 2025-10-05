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
 * @returns {Object} Firebase updates including any special token logic
 */
export function handleCardDiscard({
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
  existingUpdates = {}
) {
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

  console.log(`🚨 HANDLE PLAYER ELIMINATION RETURNING:`, updates);
  return updates;
}
