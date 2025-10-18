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

    // Case 2: Check if deck is empty
    if (!round.deck || round.deck.length === 0) {
      console.log(
        "🏆 ROUND END DETECTED: Deck empty - checking strength comparison",
        {
          activePlayers,
          type: "deckEmpty",
          deckExists: !!round.deck,
          deckLength: round.deck?.length || 0,
        }
      );

      // Get the highest card strength among remaining players
      const playerStrengths = activePlayers.map((player) => {
        const playerHand = players[player].hand;
        const highestCard =
          playerHand && playerHand.length > 0 ? playerHand[0] : null;
        const baseStrength = highestCard?.strength || 0;

        // 👑🐕 Check for Duke token bonus (premium mode only)
        const dukeToken = players[player]?.dukeToken || 0;
        const dukeBonus = dukeToken; // Each Duke token adds +1 to strength
        const finalStrength = baseStrength + dukeBonus;

        if (dukeBonus > 0) {
          console.log(
            `👑🐕 DUKE BONUS: ${player} has ${dukeToken} Duke favor(s), adding +${dukeBonus} to strength (${baseStrength} → ${finalStrength})`
          );
        }

        return {
          player,
          hand: playerHand || [],
          strength: finalStrength,
          baseStrength,
          dukeBonus,
        };
      });

      // Sort by strength (highest first)
      playerStrengths.sort((a, b) => b.strength - a.strength);

      const highestStrength = playerStrengths[0].strength;
      const initialWinners = playerStrengths.filter(
        (p) => p.strength === highestStrength
      );

      console.log("🏆 INITIAL STRENGTH COMPARISON RESULTS:", {
        playerStrengths,
        highestStrength,
        initialWinners: initialWinners.map((w) => w.player),
      });

      // ⚖️ TIEBREAKER LOGIC: Only run if there's actually a tie
      let finalWinners = initialWinners;
      let tiebreakerUsed = false;
      let tiebreakerDetails = null;

      // Only proceed with tiebreaker if we have multiple initial winners
      if (initialWinners.length > 1) {
        console.log("⚖️ TIE DETECTED! Initiating discard pile tiebreaker...");

        // Calculate discard pile points for each tied player
        const tiedPlayersWithDiscardPoints = initialWinners.map(
          (playerData) => {
            const playerName = playerData.player;
            const discardPile = players[playerName]?.discard || [];

            // Sum up all card strengths in discard pile
            const discardPilePoints = discardPile.reduce((total, card) => {
              return total + (card.strength || 0);
            }, 0);

            console.log(
              `⚖️ TIEBREAKER: ${playerName} has ${discardPilePoints} discard pile points (${discardPile.length} cards)`
            );

            return {
              ...playerData,
              discardPilePoints,
              discardPile: discardPile,
            };
          }
        );

        // Sort by discard pile points (highest first)
        tiedPlayersWithDiscardPoints.sort(
          (a, b) => b.discardPilePoints - a.discardPilePoints
        );

        const highestDiscardPoints =
          tiedPlayersWithDiscardPoints[0].discardPilePoints;
        const tiebreakerWinners = tiedPlayersWithDiscardPoints.filter(
          (p) => p.discardPilePoints === highestDiscardPoints
        );

        console.log("⚖️ TIEBREAKER RESULTS:", {
          highestDiscardPoints,
          tiebreakerWinners: tiebreakerWinners.map(
            (w) => `${w.player} (${w.discardPilePoints} pts)`
          ),
        });

        // Update final winners and mark tiebreaker as used
        finalWinners = tiebreakerWinners;
        tiebreakerUsed = true;
        tiebreakerDetails = {
          initialTiedPlayers: initialWinners.map((w) => w.player),
          discardPileComparison: tiedPlayersWithDiscardPoints.map((p) => ({
            player: p.player,
            playerName: players[p.player]?.name || p.player,
            discardPilePoints: p.discardPilePoints,
          })),
          highestDiscardPoints,
        };

        // Update playerStrengths to include discard pile data for all tied players
        playerStrengths.forEach((ps) => {
          const tiebreakerData = tiedPlayersWithDiscardPoints.find(
            (tp) => tp.player === ps.player
          );
          if (tiebreakerData) {
            ps.discardPilePoints = tiebreakerData.discardPilePoints;
          }
        });
      } else {
        // Single winner - no tiebreaker needed
        console.log("🏆 CLEAR VICTORY: Single winner, no tiebreaker needed");
      }

      console.log("🏆 FINAL RESULT:", {
        finalWinners: finalWinners.map((w) => w.player),
        tiebreakerUsed,
        singleWinner: initialWinners.length === 1,
      });

      return {
        isRoundEnd: true,
        type: "deckEmpty",
        winners: finalWinners.map((w) => w.player),
        winnerNames: finalWinners.map(
          (w) => players[w.player]?.name || w.player
        ),
        finalStandings: playerStrengths,
        tiebreakerUsed,
        tiebreakerDetails,
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
    // 🛡️ PROTECTION: Check if round end is already in progress or completed
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();

    if (!roomData) {
      return { success: false, message: "Room not found" };
    }

    // Check if we're already in round scoring state
    if (roomData.gameState === "roundScoring") {
      console.log(
        "🛡️ ROUND END PROTECTION: Already in roundScoring state, skipping trigger"
      );
      return { success: false, message: "Round end already triggered" };
    }

    // Check if round end is currently in progress
    if (roomData.roundEndInProgress === true) {
      console.log(
        "🛡️ ROUND END PROTECTION: Round end already in progress, skipping trigger"
      );
      return { success: false, message: "Round end already in progress" };
    }

    // 🔒 SET PROTECTION FLAG: Mark round end as in progress
    await update(roomRef, { roundEndInProgress: true });
    console.log("🔒 ROUND END PROTECTION: Set roundEndInProgress flag");

    const roundEndResult = await checkRoundEndConditions(roomCode);

    if (!roundEndResult.isRoundEnd) {
      // Clear protection flag if round hasn't actually ended
      await update(roomRef, { roundEndInProgress: false });
      return { success: false, message: "Round has not ended yet" };
    }

    console.log("🎯 TRIGGERING ROUND END:", roundEndResult);

    // Award love token to winner(s)
    const updates = {};
    let jesterBonusInfo = null;

    if (roundEndResult.type === "lastPlayerStanding") {
      // Single winner gets 1 love token
      const currentTokens =
        roomData.players[roundEndResult.winner]?.tokens || 0;
      updates[`players/${roundEndResult.winner}/tokens`] = currentTokens + 1;

      // 🃏 Check for Jester token - single winner case
      const winnerData = roomData.players[roundEndResult.winner];
      if (winnerData?.jesterToken?.giver) {
        const jesterGiver = winnerData.jesterToken.giver;

        // Only award jester bonus if giver is NOT the winner (avoid double-counting)
        if (jesterGiver !== roundEndResult.winner) {
          const jesterTokens = roomData.players[jesterGiver]?.tokens || 0;
          updates[`players/${jesterGiver}/tokens`] = jesterTokens + 1;

          console.log(
            `🃏 JESTER BONUS: Awarding love token to ${jesterGiver} (had ${jesterTokens}, now ${
              jesterTokens + 1
            })`
          );
        } else {
          console.log(
            `🃏 JESTER BONUS: Skipping ${jesterGiver} (is the winner, avoiding double-counting)`
          );
        }

        jesterBonusInfo = {
          giver: jesterGiver,
          giverName: roomData.players[jesterGiver]?.name || jesterGiver,
          winner: roundEndResult.winner,
          winnerName: roundEndResult.winnerName,
        };
      }
    } else if (roundEndResult.type === "deckEmpty") {
      // Multiple winners possible (tie for highest strength)
      const jesterBonuses = [];

      roundEndResult.winners.forEach((winner) => {
        const currentTokens = roomData.players[winner]?.tokens || 0;
        updates[`players/${winner}/tokens`] = currentTokens + 1;

        // 🃏 Check for Jester token - multiple winners case
        const winnerData = roomData.players[winner];
        if (winnerData?.jesterToken?.giver) {
          const jesterGiver = winnerData.jesterToken.giver;

          // Only award jester bonus if giver is NOT among the winners (avoid double-counting)
          if (!roundEndResult.winners.includes(jesterGiver)) {
            const jesterTokens = roomData.players[jesterGiver]?.tokens || 0;
            updates[`players/${jesterGiver}/tokens`] = jesterTokens + 1;
          }

          jesterBonuses.push({
            giver: jesterGiver,
            giverName: roomData.players[jesterGiver]?.name || jesterGiver,
            winner: winner,
            winnerName: roomData.players[winner]?.name || winner,
          });
        }
      });

      // Use first jester bonus for main info, or null if none
      jesterBonusInfo = jesterBonuses.length > 0 ? jesterBonuses[0] : null;
    }

    // 🏰💰 Check for Chamberlain tokens - players eliminated with Chamberlain benefit
    let chamberlainBonusInfo = null;
    const chamberlainBonuses = [];

    console.log(
      "🏰💰 CHAMBERLAIN CHECK: Checking all players for Chamberlain tokens..."
    );

    // Check all players for activated Chamberlain tokens (set to true upon elimination)
    Object.entries(roomData.players || {}).forEach(
      ([playerName, playerData]) => {
        console.log(
          `🏰💰 CHAMBERLAIN CHECK: Player ${playerName} has chamberlainToken: ${playerData?.chamberlainToken}`
        );

        if (playerData?.chamberlainToken === true) {
          // Get current token count BEFORE checking if it was already updated by Jester bonus
          const currentTokens = playerData.tokens || 0;

          // Check if this player already got a Jester bonus in the updates object
          const existingJesterUpdate = updates[`players/${playerName}/tokens`];
          const baseTokens =
            existingJesterUpdate !== undefined
              ? existingJesterUpdate
              : currentTokens;

          console.log(
            `🏰💰 CHAMBERLAIN BONUS: Player ${playerName} - base tokens: ${currentTokens}, existing update: ${existingJesterUpdate}, using base: ${baseTokens}`
          );

          // Award this eliminated player 1 love token for their Chamberlain's influence
          updates[`players/${playerName}/tokens`] = baseTokens + 1;

          chamberlainBonuses.push({
            player: playerName,
            playerName: playerData.name || playerName,
          });

          console.log(
            `🏰💰 Chamberlain bonus awarded to ${playerName} for noble sacrifice! (Final tokens: ${
              baseTokens + 1
            })`
          );
        }
      }
    );

    // Use first Chamberlain bonus for main info, or null if none
    chamberlainBonusInfo =
      chamberlainBonuses.length > 0 ? chamberlainBonuses[0] : null;

    // Build round result data
    const roundResult = {
      roundNumber: roomData.gameStats?.currentRound || 1,
      type: roundEndResult.type,
      winner: roundEndResult.winner || roundEndResult.winners?.[0],
      winners: roundEndResult.winners || [roundEndResult.winner],
      winnerNames: roundEndResult.winnerNames || [roundEndResult.winnerName],
      hiddenCard: roomData.round?.hiddenCard || null,
      finalStandings: roundEndResult.finalStandings || [],
      tiebreakerUsed: roundEndResult.tiebreakerUsed || false, // ⚖️ Add tiebreaker information
      tiebreakerDetails: roundEndResult.tiebreakerDetails || null, // ⚖️ Add tiebreaker details
      jesterBonusInfo, // 🃏 Add jester bonus information
      chamberlainBonusInfo, // 🏰💰 Add Chamberlain bonus information
      timestamp: Date.now(),
    };

    // Update game state to roundScoring and store round result
    updates.gameState = "roundScoring";
    updates.roundResult = roundResult;

    // 🔓 CLEAR PROTECTION FLAG: Round end process complete
    updates.roundEndInProgress = false;

    // Update game stats
    updates["gameStats/lastRoundWinner"] = roundResult.winner;
    updates["gameStats/totalRoundsPlayed"] =
      (roomData.gameStats?.totalRoundsPlayed || 0) + 1;

    await update(roomRef, updates);

    console.log("✅ ROUND END TRIGGERED SUCCESSFULLY:", {
      updates,
      roundResult,
    });

    console.log("📊 FINAL TOKEN UPDATES:", JSON.stringify(updates, null, 2));

    return { success: true, roundResult };
  } catch (error) {
    console.error("🚨 Error triggering round end:", error);

    // 🛡️ SAFETY: Clear protection flag on error to prevent deadlock
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, { roundEndInProgress: false });
      console.log("🔓 ROUND END PROTECTION: Cleared flag after error");
    } catch (cleanupError) {
      console.error("🚨 Error clearing protection flag:", cleanupError);
    }

    return { success: false, error: error.message };
  }
}

/**
 * Logs round end detection for debugging - DOES NOT automatically trigger round end
 * Use triggerRoundEndIfNeeded() for automatic triggering with protection
 * @param {string} context - Where this check was called from
 * @param {string} roomCode - The room code
 */
export async function logRoundEndCheck(context, roomCode) {
  console.log(`🔍 ROUND END CHECK: ${context}`, { roomCode });
  const result = await checkRoundEndConditions(roomCode);
  console.log(`🔍 ROUND END RESULT: ${context}`, result);
  return result;
}

/**
 * Checks for round end and triggers it safely if needed (with protection against duplicates)
 * @param {string} context - Where this check was called from
 * @param {string} roomCode - The room code
 */
export async function triggerRoundEndIfNeeded(context, roomCode) {
  console.log(`🔍 ROUND END CHECK WITH AUTO-TRIGGER: ${context}`, { roomCode });
  const result = await checkRoundEndConditions(roomCode);
  console.log(`🔍 ROUND END RESULT: ${context}`, result);

  // If round end is detected, trigger the actual round end with protection
  if (result.isRoundEnd) {
    console.log(`🎯 ROUND END DETECTED - TRIGGERING: ${context}`);
    const triggerResult = await triggerRoundEnd(roomCode);
    console.log(`🎯 ROUND END TRIGGER RESULT: ${context}`, triggerResult);
    return { ...result, triggerResult };
  }

  return result;
}
