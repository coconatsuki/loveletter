import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update, set } from "firebase/database";
import TargetModal from "../components/TargetModal";
import EffectResultModal from "../components/EffectResultModal";
import AssassinPromptModal from "../components/AssassinPromptModal";
import PriestTargetModal from "../components/PriestTargetModal";
import BaronResultModal from "../components/BaronResultModal";
import {
  applyGuardEffect,
  resolveAssassinDefense,
  applyPriestEffect,
  applyBaronEffect,
  applyHandmaidEffect,
  applyPrinceEffect,
  applyKingEffect,
} from "../utils/cardEffects";
import { pushNotification } from "../utils/pushNotification";

const cardNames = {
  0: "Jester",
  1: "Guard",
  2: "Priest",
  3: "Baron",
  4: "Handmaid",
  5: "Prince",
  6: "Phantom King",
  7: "Countess",
  8: "Princess",
  9: "Inquisitor",
  10: "Chamberlain",
  11: "Regent Queen",
  12: "Court Whisperer",
  13: "Royal Confessor",
  14: "Assassin",
  15: "Baroness",
  16: "Duke",
};

export default function Play() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const nickname = state?.nickname;

  const [roomData, setRoomData] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [resultModalData, setResultModalData] = useState(null);
  const [guardTargetPromptData, setGuardTargetPromptData] = useState(null);
  const [showGuardTargetPrompt, setShowGuardTargetPrompt] = useState(false);
  const [priestTargetModalData, setPriestTargetModalData] = useState(null);
  const [resultContent, setResultContent] = useState("");
  const [baronResultModalData, setBaronResultModalData] = useState(null);
  const [baronTargetModalData, setBaronTargetModalData] = useState(null);
  const [targetMessageModalData, setTargetMessageModalData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  /**
   * FIREBASE LISTENERS - Real-time data synchronization
   * These effects set up Firebase listeners to keep the game state in sync
   */

  // Listen to room data changes (players, game state) and update player data
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      if (data?.players && nickname) {
        setPlayer(data.players[nickname]);
      }

      // Auto-clear info-only result modals when it's no longer this player's turn
      // This ensures attacker modals don't stay on screen forever
      if (
        data?.round?.currentPlayer !== nickname &&
        resultModalData?.isInfoOnly
      ) {
        setResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname, resultModalData]);

  // Listen for Guard prompts targeting this player (premium mode Assassin interactions)
  useEffect(() => {
    const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
    const unsubscribe = onValue(promptRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.target === nickname) {
        setGuardTargetPromptData(data);
        setShowGuardTargetPrompt(true);
      } else if (!data) {
        // Hide the modal when guardPrompt is cleared from Firebase
        setGuardTargetPromptData(null);
        setShowGuardTargetPrompt(false);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to notifications feed for real-time game updates
  useEffect(() => {
    const notifRef = ref(db, `rooms/${roomCode}/notifications`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setNotifications(messages);
      }
    });
    return () => unsubscribe();
  }, [roomCode]);

  // Listen to action results to show effect modals for card outcomes
  useEffect(() => {
    console.log("actionResult useEffect called!");

    const refResult = ref(db, `rooms/${roomCode}/actionResult`);
    const unsubscribe = onValue(refResult, (snapshot) => {
      const data = snapshot.val();

      console.log(
        "attacker is nickname? => ",
        data?.attacker === nickname,
        " / data.resultText: ",
        data?.resultText
      );

      if (data && data.attacker === nickname && data.resultText) {
        setResultModalData(data.resultText);
      } else if (!data) {
        // Clear the modal when actionResult is cleared from Firebase
        setResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to priest target modal data
  useEffect(() => {
    const refPriestTarget = ref(db, `rooms/${roomCode}/priestTarget`);
    const unsubscribe = onValue(refPriestTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show target modal to the target player
        setPriestTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setPriestTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to baron target modal data
  useEffect(() => {
    const refBaronTarget = ref(db, `rooms/${roomCode}/baronTarget`);
    const unsubscribe = onValue(refBaronTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show Baron target modal to the target player
        setBaronTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setBaronTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to general target message modal data (for Prince, etc.)
  useEffect(() => {
    const refTargetMessage = ref(db, `rooms/${roomCode}/targetMessage`);
    const unsubscribe = onValue(refTargetMessage, (snapshot) => {
      const data = snapshot.val();

      console.log("🎯 TARGET MESSAGE LISTENER: Received data:", {
        data,
        nickname,
        isVisibleToMe: data?.visibleTo === nickname,
      });

      if (data && data.visibleTo === nickname) {
        // Show target message modal to the target player
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Setting target message modal data:",
          data
        );
        setTargetMessageModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Clearing target message modal data"
        );
        setTargetMessageModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  const { round, players } = roomData || {};
  const currentPlayer = round?.currentPlayer;
  const isMyTurn = nickname === currentPlayer;

  const drawCard = () => {
    if (!isMyTurn || player.hand?.length !== 1 || isPlaying) return;
    const nextCard = round.deck[0];
    const newDeck = round.deck.slice(1);
    const newHand = [...player.hand, nextCard];
    const roomRef = ref(db, `rooms/${roomCode}`);
    update(roomRef, {
      round: { ...round, deck: newDeck },
      [`players/${nickname}/hand`]: newHand,
    });
  };

  const playCard = (index) => {
    const card = player.hand[index];
    if ([1, 2, 3, 6].includes(card.id)) {
      // Cards that need target selection (Guard, Priest, Baron, Phantom King)
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    } else if (card.id === 4) {
      // HANDMAID CARD - No target needed, apply effect immediately
      playHandmaid(index);
    } else if (card.id === 5) {
      // PRINCE CARD - Needs target selection (including "Yourself" option)
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    }
  };

  const playHandmaid = async (index) => {
    setSelectedCardIndex(index);
    setIsPlaying(true);

    // Apply Handmaid protection
    const result = await applyHandmaidEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification
    pushNotification(roomCode, result.publicMessage);

    // Show protection confirmation modal to the player
    setResultModalData({
      resultText: result.playerMessage,
      isHandmaidProtection: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const handleTargetConfirm = async ({ target, guess }) => {
    const cardPlayed = player.hand[selectedCardIndex];
    setShowTargetModal(false);
    setIsPlaying(true);

    // === SKIP TURN CASE (All players protected by Handmaid) ===
    if (target === "SKIP_TURN") {
      // Show a result modal explaining the skip
      setResultModalData({
        resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your ${
          cardNames[cardPlayed.id]
        } cannot find a target, so your turn is skipped. The card takes no effect! ☕🛡️`,
      });

      // Note: Turn will be completed when player closes the result modal
      return;
    }

    // === GUARD CARD LOGIC (ID: 1) ===
    if (cardPlayed.id === 1) {
      // Apply the Guard effect to determine the outcome
      const result = await applyGuardEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      // Notify all players about the Guard action
      pushNotification(
        roomCode,
        `${nickname} played a Guard and pointed their finger at ${target}, whispering: "Strength ${guess}!"`
      );

      // ALWAYS show AssassinPromptModal to target (good UX for both modes)
      // In premium mode: target can choose to use Assassin or not
      // In normal mode: target just acknowledges the attack
      const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
      await update(promptRef, {
        ...result,
        timestamp: Date.now(),
        // Store card play info so we can complete the turn later
        cardPlayInfo: {
          playedCardIndex: selectedCardIndex,
          playerNickname: nickname,
        },
      });
      // Exit early - AssassinPromptModal will handle the rest for both modes
      return;
    }

    // === PRIEST CARD LOGIC (ID: 2) ===
    else if (cardPlayed.id === 2) {
      const priestResult = await applyPriestEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (priestResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${priestResult.message}`,
        });
        return;
      }

      // Send notifications with medieval fun! 🏰
      pushNotification(roomCode, priestResult.publicMessage);

      // Show the target modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/priestTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetCard: priestResult.targetCard,
      });

      // Show the result to the attacker with card details
      setResultModalData({
        resultText: priestResult.attackerMessage,
        cardDetails: {
          "Target Player": target,
          "Revealed Card": `${priestResult.targetCard.name} (Strength ${priestResult.targetCard.strength})`,
          "Card Effect":
            priestResult.targetCard.effect || "No effect description available",
        },
      });

      // Priest effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === BARON CARD LOGIC (ID: 3) ===
    else if (cardPlayed.id === 3) {
      const baronResult = await applyBaronEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (baronResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${baronResult.message}`,
        });
        return;
      }

      // Send the public notification (reveals eliminated player's card only)
      pushNotification(roomCode, baronResult.publicMessage);

      // Show Baron result modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/baronTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        targetMessage: baronResult.targetMessage,
      });

      // Show Baron result modal to the attacker (with confirm button to control game flow)
      setBaronResultModalData({
        attackerName: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        attackerMessage: baronResult.attackerMessage,
        targetMessage: baronResult.targetMessage,
      });

      // Baron effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === PRINCE CARD LOGIC (ID: 5) ===
    else if (cardPlayed.id === 5) {
      // Clear any existing target messages to ensure clean state
      await set(ref(db, `rooms/${roomCode}/targetMessage`), null);
      
      // Store the original attacker hand before Prince effect modifies it
      const originalAttackerHand = [...player.hand];
      
      const princeResult = await applyPrinceEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (princeResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${princeResult.error}`,
        });
        return;
      }

      // Send the public notification
      pushNotification(roomCode, princeResult.publicMessage);

      // Show result modal to the attacker (prince player) - info only, no turn advancement
      setResultModalData({
        resultText: princeResult.attackerMessage,
        isInfoOnly: true, // Flag to indicate this modal shouldn't advance turn
      });

      // Always send target message via Firebase (even for self-targeting)
      // The target modal will handle turn advancement
      console.log("🤴 PRINCE DEBUG: Creating target message with data:", {
        target,
        selectedCardIndex,
        isSelfTarget: princeResult.isSelfTarget,
        attackerMessage: princeResult.attackerMessage,
        targetMessage: princeResult.targetMessage,
        originalAttackerHand
      });

      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        visibleTo: target, // For self-targeting, this will be the same player
        message: princeResult.isSelfTarget
          ? princeResult.attackerMessage
          : princeResult.targetMessage,
        from: nickname,
        cardName: "Prince",
        shouldAdvanceTurn: true, // This modal controls turn advancement
        selectedCardIndex: selectedCardIndex, // Store the card index for turn completion
        originalAttackerHand: originalAttackerHand // Store original hand for turn completion
      });

      console.log(
        "🤴 PRINCE DEBUG: Target message sent to Firebase for player:",
        target
      );      // Prince effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === OTHER CARD LOGIC (Phantom King, etc.) ===
    // This section is for Guard-specific turn completion
    const { playedCardIndex, playerNickname } = cardPlayInfo;
    const attackerPlayer = players[playerNickname];

    // Validate that we have the necessary data to complete the turn
    if (
      !attackerPlayer ||
      !attackerPlayer.hand ||
      attackerPlayer.hand.length !== 2
    ) {
      console.error("Invalid attacker player data for completing Guard turn:", {
        playerNickname,
        attackerPlayer,
        handLength: attackerPlayer?.hand?.length,
      });
      return;
    }

    // Determine which cards to keep vs discard
    const playedCard = attackerPlayer.hand[playedCardIndex];
    const remainingCard = attackerPlayer.hand[1 - playedCardIndex];
    const newDiscard = [...(attackerPlayer.discard || []), playedCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(playerNickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update Firebase with the turn completion
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${playerNickname}/hand`]: [remainingCard],
      [`players/${playerNickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );
  };

  /**
   * Completes the current player's turn for non-Guard effects
   * This handles discarding the played card and advancing to the next player
   */
  const handleEffectResultClose = async () => {
    // Validate that we have the necessary data to complete the turn
    if (
      selectedCardIndex === null ||
      !player?.hand ||
      player.hand.length !== 2
    ) {
      console.error(
        "Cannot complete turn - invalid selectedCardIndex or hand state:",
        {
          selectedCardIndex,
          handLength: player?.hand?.length,
        }
      );
      return;
    }

    await completeTurnWithCardIndex(selectedCardIndex);
  };

  /**
   * Completes the turn using a specific card index (used by target message modals)
   */
  const completeTurnWithCardIndex = async (cardIndex) => {
    console.log("🔄 TURN COMPLETION DEBUG: Starting with data:", {
      cardIndex,
      cardIndexType: typeof cardIndex,
      player,
      playerHand: player?.hand,
      handLength: player?.hand?.length,
      nickname,
      roomCode,
    });

    // Validate that we have the necessary data to complete the turn
    if (
      cardIndex === null ||
      cardIndex === undefined ||
      !player?.hand ||
      player.hand.length !== 2
    ) {
      console.error(
        "🔄 TURN COMPLETION ERROR: Cannot complete turn - invalid cardIndex or hand state:",
        {
          cardIndex,
          cardIndexType: typeof cardIndex,
          handLength: player?.hand?.length,
          player: player,
        }
      );
      return;
    }

    const playedCard = player.hand[cardIndex];
    const remainingCard = player.hand[1 - cardIndex];
    const newDiscard = [...(player.discard || []), playedCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }
    const nextPlayer = activePlayers[nextIndex];

    // Final validation before Firebase update
    if (!playedCard || !remainingCard || !nextPlayer) {
      console.error("Invalid values detected before Firebase update:", {
        playedCard,
        remainingCard,
        nextPlayer,
      });
      return;
    }

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update Firebase with the turn completion
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: [remainingCard],
      [`players/${nickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    // Reset local state
    setIsPlaying(false);
    setSelectedCardIndex(null);
  };

  /**
   * Completes the Prince turn - special logic since Prince effect has already been applied
   */
  const completePrinceTurn = async (cardIndex, attackerNickname, originalAttackerHand) => {
    console.log("👑 PRINCE TURN COMPLETION DEBUG: Starting with data:", {
      cardIndex,
      attackerNickname,
      currentNickname: nickname,
      originalAttackerHand,
      players,
      roomData,
    });

    // For self-targeting, use the original hand. For external targeting, get current attacker data.
    const isSelfTargeting = attackerNickname === nickname;
    let attackerHand;
    
    if (isSelfTargeting && originalAttackerHand) {
      // Use the stored original hand for self-targeting
      attackerHand = originalAttackerHand;
      console.log("👑 PRINCE TURN: Using original hand for self-targeting:", attackerHand);
    } else {
      // Use current attacker data for external targeting
      const attackerData = players[attackerNickname];
      attackerHand = attackerData?.hand;
      console.log("👑 PRINCE TURN: Using current attacker hand for external targeting:", attackerHand);
    }

    // Validate that we have the necessary data to complete the turn
    if (
      cardIndex === null ||
      cardIndex === undefined ||
      !attackerHand ||
      attackerHand.length !== 2
    ) {
      console.error(
        "👑 PRINCE TURN COMPLETION ERROR: Cannot complete turn - invalid data:",
        {
          cardIndex,
          cardIndexType: typeof cardIndex,
          attackerHand,
          attackerHandLength: attackerHand?.length,
          isSelfTargeting,
          originalAttackerHand
        }
      );
      return;
    }

    const playedCard = attackerHand[cardIndex];
    const remainingCard = attackerHand[1 - cardIndex];
    const attackerData = players[attackerNickname];
    const newDiscard = [...(attackerData.discard || []), playedCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(attackerNickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }
    const nextPlayer = activePlayers[nextIndex];

    // Final validation before Firebase update
    if (!playedCard || !remainingCard || !nextPlayer) {
      console.error("👑 PRINCE Invalid values detected before Firebase update:", {
        playedCard,
        remainingCard,
        nextPlayer,
      });
      return;
    }

    console.log("👑 PRINCE TURN COMPLETION: Updating Firebase for attacker:", {
      attackerNickname,
      remainingCard,
      newDiscard,
      nextPlayer,
    });

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update Firebase with the turn completion for the ATTACKER
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${attackerNickname}/hand`]: [remainingCard],
      [`players/${attackerNickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    // Reset local state (only if we're the attacker)
    if (nickname === attackerNickname) {
      setIsPlaying(false);
      setSelectedCardIndex(null);
    }
  };

  if (!roomData || !player || !round || !players) {
    return <div style={{ padding: "2rem" }}>⏳ Loading game state...</div>;
  } else {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {/* MAIN GAME BOARD */}
        <div>
          <h2>Game Board for Room {roomCode}</h2>
          <h3>Current Player: {currentPlayer}</h3>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <h3>Your Hand:</h3>
            <ul>
              {player?.hand?.map((card, idx) => (
                <li key={idx}>
                  <strong>{card.name}</strong> (Strength {card.strength})<br />
                  <em>{card.effect}</em>
                </li>
              ))}
            </ul>
          </div>

          {players[nickname]?.isOut && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#ffeeee",
                border: "2px solid #cc0000",
                borderRadius: "8px",
                color: "#990000",
              }}
            >
              <strong>💀 You’ve been eliminated!</strong>
              <br />
              You can no longer play this round, but may still witness the drama
              as it unfolds...
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <h3>Players:</h3>
            <ul>
              {Object.entries(players).map(([name, p]) => {
                const isProtected = roomData?.protectedPlayers?.includes(name);
                const playerStyle = isProtected
                  ? {
                      marginBottom: "0.5rem",
                      padding: "5px",
                      border: "2px solid #FFD700",
                      borderRadius: "8px",
                      backgroundColor: "#FFF8DC",
                      boxShadow: "0 0 8px rgba(255,215,0,0.3)",
                    }
                  : { marginBottom: "0.5rem" };

                return (
                  <li key={name} style={playerStyle}>
                    <strong>{p.name}</strong> ({p.realName})<br />
                    Tokens: {p.tokens} | Discard:{" "}
                    {(p.discard || []).map((card) => card.name).join(", ") ||
                      "—"}
                    {name === currentPlayer && " 👑 (current turn)"}
                    {name === nickname && " ← you"}
                    {isProtected && " 🫖✨ (protected by Handmaid)"}
                  </li>
                );
              })}
            </ul>
          </div>

          {isMyTurn && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#ffe5b4",
              }}
            >
              <h3>It’s your turn!</h3>
              {player.hand?.length === 1 && (
                <button onClick={drawCard}>Draw Card</button>
              )}
              {player.hand?.length === 2 && (
                <div>
                  <p>Choose a card to play:</p>
                  {player.hand.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => playCard(index)}
                      style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}
                      disabled={isPlaying}
                    >
                      <strong>{card.name}</strong> (Strength {card.strength})
                      <br />
                      <small>{card.effect}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isMyTurn && (
            <div style={{ marginTop: "2rem", color: "#999" }}>
              <em>Waiting for {currentPlayer} to play...</em>
            </div>
          )}

          {showTargetModal && (
            <TargetModal
              players={players}
              currentPlayer={nickname}
              cardPlayed={player.hand[selectedCardIndex].id}
              protectedPlayers={roomData?.protectedPlayers || []}
              onConfirm={handleTargetConfirm}
              onCancel={() => setShowTargetModal(false)}
            />
          )}

          {resultModalData && (
            <EffectResultModal
              resultText={resultModalData.resultText || resultModalData}
              cardDetails={resultModalData.cardDetails || null}
              onClose={async () => {
                console.log(
                  "⚔️ ATTACKER MODAL DEBUG: Result modal closing with data:",
                  {
                    resultModalData,
                    isInfoOnly: resultModalData.isInfoOnly,
                    selectedCardIndex,
                    nickname,
                  }
                );

                await set(ref(db, `rooms/${roomCode}/actionResult`), null);
                // Clear priest target modal if it exists
                await set(ref(db, `rooms/${roomCode}/priestTarget`), null);
                // Clear baron target modal if it exists
                await set(ref(db, `rooms/${roomCode}/baronTarget`), null);
                setResultModalData(null);

                // Only advance turn if this is NOT an info-only modal (like Prince attacker modal)
                if (!resultModalData.isInfoOnly) {
                  console.log(
                    "⚔️ ATTACKER MODAL DEBUG: Not info-only, checking if should advance turn"
                  );
                  // Only call handleEffectResultClose if selectedCardIndex is valid
                  // For Guard effects that went through AssassinPromptModal, selectedCardIndex will be null
                  if (selectedCardIndex !== null) {
                    console.log(
                      "⚔️ ATTACKER MODAL DEBUG: Advancing turn for non-Prince card"
                    );
                    handleEffectResultClose();
                  }
                } else {
                  console.log(
                    "⚔️ ATTACKER MODAL DEBUG: Info-only modal (Prince attacker), NOT advancing turn"
                  );
                }
              }}
            />
          )}

          {/* === ASSASSIN PROMPT MODAL (Premium Mode Only) === */}
          {showGuardTargetPrompt &&
            guardTargetPromptData &&
            nickname === guardTargetPromptData.target && (
              <AssassinPromptModal
                promptData={guardTargetPromptData}
                // Target acknowledges the guess without using Assassin
                onAcknowledge={async () => {
                  const { isCorrectGuess, targetCard, target, attacker } =
                    guardTargetPromptData;

                  let finalResultContent;

                  if (isCorrectGuess) {
                    // Attacker guessed correctly - eliminate target
                    await update(
                      ref(db, `rooms/${roomCode}/players/${target}`),
                      { isOut: true }
                    );
                    pushNotification(
                      roomCode,
                      `🎯 ${attacker} guessed correctly! ${target} had the ${
                        cardNames[targetCard.id]
                      }. Removed from play.`
                    );
                    finalResultContent = `💀 Your suspicion proved true! ${target} held the ${
                      cardNames[targetCard.id]
                    } and has been cast from the court.`;
                  } else {
                    // Attacker guessed incorrectly - target survives
                    pushNotification(
                      roomCode,
                      `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                    );
                    finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;
                  }

                  // Clean up and send result to attacker
                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: attacker,
                  });

                  // Complete the Guard turn (discard card, advance turn)
                  await completeGuardTurn(guardTargetPromptData);

                  setGuardTargetPromptData(null);
                  setShowGuardTargetPrompt(false);
                }}
                // Target uses Assassin to strike back at attacker
                onReveal={async () => {
                  const { target, attacker } = guardTargetPromptData;

                  // Apply Assassin defense (eliminates attacker, target draws new card)
                  const result = await resolveAssassinDefense({
                    roomCode,
                    attacker,
                    target,
                  });

                  pushNotification(
                    roomCode,
                    `☠️ ${attacker} guessed the Assassin… and paid the price. Well struck, ${target}!`
                  );

                  const finalResultContent = `☠️ A fatal mistake! ${target} revealed the Assassin and struck you down. Your legacy ends here...`;

                  // Clean up and send result to attacker
                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: attacker,
                  });

                  // Complete the Guard turn (discard card, advance turn)
                  await completeGuardTurn(guardTargetPromptData);

                  setGuardTargetPromptData(null);
                  setShowGuardTargetPrompt(false);
                }}
                // Target ignores (same as acknowledge - for when they don't have Assassin)
                onIgnore={async () => {
                  const { target } = guardTargetPromptData;

                  pushNotification(
                    roomCode,
                    `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                  );

                  const finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;

                  // Clean up and send result to attacker
                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: guardTargetPromptData.attacker,
                  });

                  // Complete the Guard turn (discard card, advance turn)
                  await completeGuardTurn(guardTargetPromptData);

                  setGuardTargetPromptData(null);
                  setShowGuardTargetPrompt(false);
                }}
              />
            )}

          {/* === BARON RESULT MODAL === */}
          {baronResultModalData && (
            <BaronResultModal
              isOpen={true}
              userRole={
                nickname === baronResultModalData.attackerName
                  ? "attacker"
                  : "target"
              }
              attackerName={baronResultModalData.attackerName}
              targetName={baronResultModalData.targetName}
              attackerCard={baronResultModalData.attackerCard}
              targetCard={baronResultModalData.targetCard}
              eliminatedPlayer={baronResultModalData.eliminatedPlayer}
              isTie={baronResultModalData.isTie}
              message={
                nickname === baronResultModalData.attackerName
                  ? baronResultModalData.attackerMessage
                  : baronResultModalData.targetMessage
              }
              onConfirm={async () => {
                // Only attacker can confirm to proceed with the game
                // Clear Baron target data in Firebase
                await set(ref(db, `rooms/${roomCode}/baronTarget`), null);
                setBaronResultModalData(null);

                // Complete the Baron turn (discard card, advance turn)
                if (selectedCardIndex !== null) {
                  handleEffectResultClose();
                }
              }}
            />
          )}

          {/* === PRIEST TARGET MODAL === */}
          {priestTargetModalData && (
            <PriestTargetModal
              attacker={priestTargetModalData.attacker}
              targetCard={priestTargetModalData.targetCard}
            />
          )}

          {/* === BARON TARGET MODAL === */}
          {baronTargetModalData && (
            <BaronResultModal
              isOpen={true}
              userRole="target"
              attackerName={baronTargetModalData.attacker}
              targetName={baronTargetModalData.targetName}
              attackerCard={baronTargetModalData.attackerCard}
              targetCard={baronTargetModalData.targetCard}
              eliminatedPlayer={baronTargetModalData.eliminatedPlayer}
              isTie={baronTargetModalData.isTie}
              message={baronTargetModalData.targetMessage}
              // No onConfirm for target - they just observe
            />
          )}

          {/* === GENERAL TARGET MESSAGE MODAL (Prince, etc.) === */}
          {targetMessageModalData && (
            <EffectResultModal
              resultText={targetMessageModalData.message}
              onClose={async () => {
                console.log(
                  "🎯 TARGET MODAL DEBUG: Target modal closing with data:",
                  {
                    targetMessageModalData,
                    shouldAdvanceTurn: targetMessageModalData.shouldAdvanceTurn,
                    selectedCardIndex: targetMessageModalData.selectedCardIndex,
                    currentPlayer: player,
                    currentHand: player?.hand,
                    handLength: player?.hand?.length,
                  }
                );

                // Clear the target message when confirmed
                await set(ref(db, `rooms/${roomCode}/targetMessage`), null);
                setTargetMessageModalData(null);

                // If this target message should advance turn, do it now using stored card index
                if (
                  targetMessageModalData.shouldAdvanceTurn &&
                  targetMessageModalData.selectedCardIndex !== null
                ) {
                  console.log(
                    "🎯 TARGET MODAL DEBUG: Attempting to complete turn with cardIndex:",
                    targetMessageModalData.selectedCardIndex
                  );

                  // For Prince cards, we need special turn completion logic since the effect has already been applied
                  if (targetMessageModalData.cardName === "Prince") {
                    await completePrinceTurn(
                      targetMessageModalData.selectedCardIndex,
                      targetMessageModalData.from,
                      targetMessageModalData.originalAttackerHand
                    );
                  } else {
                    // Complete the turn directly using the stored card index
                    await completeTurnWithCardIndex(
                      targetMessageModalData.selectedCardIndex
                    );
                  }
                } else {
                  console.log(
                    "🎯 TARGET MODAL DEBUG: NOT advancing turn because:",
                    {
                      shouldAdvanceTurn:
                        targetMessageModalData.shouldAdvanceTurn,
                      selectedCardIndex:
                        targetMessageModalData.selectedCardIndex,
                    }
                  );
                }
              }}
            />
          )}
        </div>

        {/* NOTIFICATION PANEL */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderLeft: "3px solid #ccc",
            padding: "1rem",
            height: "90vh",
            overflowY: "auto",
          }}
        >
          <h3>📜 Game Chronicle</h3>
          {notifications.map((n, i) => (
            <div key={i} style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
              ➤ {n.message}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
