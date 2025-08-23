import { ref, get, update } from "firebase/database";
import { db } from "./firebase";

/**
 * Checks if the current round should end and returns round end information
 * @param {string} roomCode - The room code
 * @returns {Promise<{isRoundEnd: boolean, type?: string, winner?: string, finalStandings?: Array}>}
 */
export async function checkRoundEndConditions(roomCode) {
  try {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return { isRoundEnd: false, error: "Room not found" };
    }

    const roomData = snapshot.val();
    const { players, round } = roomData;

    if (!players || !round) {
      return { isRoundEnd: false };
    }

    // Case 1: Check if only one player remains (others eliminated)
    const activePlayers = Object.keys(players).filter(
      (player) => !players[player].isOut
    );
    const eliminatedPlayers = Object.keys(players).filter(
      (player) => players[player].isOut
    );

    if (activePlayers.length === 1) {
      console.log("🏆 ROUND END DETECTED: Last player standing!", {
        winner: activePlayers[0],
        type: "lastPlayerStanding",
      });

      return {
        isRoundEnd: true,
        type: "lastPlayerStanding",
        winner: activePlayers[0],
        winnerName: players[activePlayers[0]]?.name || activePlayers[0],
        activePlayers,
        eliminatedPlayers,
      };
    }

    // Case 2: Check if deck is empty and current player has finished their turn
    if (round.deck && round.deck.length === 0) {
      console.log(
        "🏆 ROUND END DETECTED: Deck empty - checking strength comparison",
        {
          activePlayers,
          type: "deckEmpty",
        }
      );

      // Get the highest card strength among remaining players
      const playerStrengths = activePlayers.map((player) => {
        const playerHand = players[player].hand;
        const highestCard =
          playerHand && playerHand.length > 0 ? playerHand[0] : null;
        return {
          player,
          hand: playerHand || [],
          strength: highestCard?.strength || 0,
        };
      });

      // Sort by strength (highest first)
      playerStrengths.sort((a, b) => b.strength - a.strength);

      const highestStrength = playerStrengths[0].strength;
      const winners = playerStrengths.filter(
        (p) => p.strength === highestStrength
      );

      console.log("🏆 STRENGTH COMPARISON RESULTS:", {
        playerStrengths,
        highestStrength,
        winners: winners.map((w) => w.player),
      });

      return {
        isRoundEnd: true,
        type: "deckEmpty",
        winners: winners.map((w) => w.player),
        winnerNames: winners.map((w) => players[w.player]?.name || w.player),
        finalStandings: playerStrengths,
      };
    }

    // No round end conditions met
    return {
      isRoundEnd: false,
      activePlayers,
      eliminatedPlayers,
    };
  } catch (error) {
    console.error("🚨 Error checking round end conditions:", error);
    return { isRoundEnd: false };
  }
}

/**
 * Triggers round end - updates Firebase with round results and changes game state
 * @param {string} roomCode - The room code
 * @returns {Promise<{success: boolean, roundResult?: object}>}
 */
export async function triggerRoundEnd(roomCode) {
  try {
    const roundEndResult = await checkRoundEndConditions(roomCode);

    if (!roundEndResult.isRoundEnd) {
      return { success: false, message: "Round has not ended yet" };
    }

    console.log("🎯 TRIGGERING ROUND END:", roundEndResult);

    // Get current room data to build round result
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();

    // Award love token to winner(s)
    const updates = {};

    if (roundEndResult.type === "lastPlayerStanding") {
      // Single winner gets 1 love token
      const currentTokens =
        roomData.players[roundEndResult.winner]?.tokens || 0;
      updates[`players/${roundEndResult.winner}/tokens`] = currentTokens + 1;
    } else if (roundEndResult.type === "deckEmpty") {
      // Multiple winners possible (tie for highest strength)
      roundEndResult.winners.forEach((winner) => {
        const currentTokens = roomData.players[winner]?.tokens || 0;
        updates[`players/${winner}/tokens`] = currentTokens + 1;
      });
    }

    // Build round result data
    const roundResult = {
      roundNumber: roomData.gameStats?.currentRound || 1,
      type: roundEndResult.type,
      winner: roundEndResult.winner || roundEndResult.winners?.[0],
      winners: roundEndResult.winners || [roundEndResult.winner],
      winnerNames: roundEndResult.winnerNames || [roundEndResult.winnerName],
      hiddenCard: roomData.round?.hiddenCard || null,
      finalStandings: roundEndResult.finalStandings || [],
      timestamp: Date.now(),
    };

    // Update game state to roundScoring and store round result
    updates.gameState = "roundScoring";
    updates.roundResult = roundResult;

    // Update game stats
    updates["gameStats/lastRoundWinner"] = roundResult.winner;
    updates["gameStats/totalRoundsPlayed"] =
      (roomData.gameStats?.totalRoundsPlayed || 0) + 1;

    await update(roomRef, updates);

    console.log("✅ ROUND END TRIGGERED SUCCESSFULLY:", {
      updates,
      roundResult,
    });

    return { success: true, roundResult };
  } catch (error) {
    console.error("🚨 Error triggering round end:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Logs round end detection for debugging and triggers round end if detected
 * @param {string} context - Where this check was called from
 * @param {string} roomCode - The room code
 */
export async function logRoundEndCheck(context, roomCode) {
  console.log(`🔍 ROUND END CHECK: ${context}`, { roomCode });
  const result = await checkRoundEndConditions(roomCode);
  console.log(`🔍 ROUND END RESULT: ${context}`, result);

  // If round end is detected, trigger the actual round end
  if (result.isRoundEnd) {
    console.log(`🎯 ROUND END DETECTED - TRIGGERING: ${context}`);
    const triggerResult = await triggerRoundEnd(roomCode);
    console.log(`🎯 ROUND END TRIGGER RESULT: ${context}`, triggerResult);
  }

  return result;
}
