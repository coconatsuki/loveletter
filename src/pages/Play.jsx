import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update, set } from "firebase/database";
import TargetModal from "../components/TargetModal";
import EffectResultModal from "../components/EffectResultModal";
import AssassinPromptModal from "../components/AssassinPromptModal";
import {
  applyGuardEffect,
  resolveAssassinDefense,
  applyPriestEffect,
  applyBaronEffect,
  applyPrinceEffect,
  applyKingEffect,
} from "../utils/cardEffects";
import { pushNotification } from "../utils/pushNotification";

const cardNames = {
  1: "Guard",
  2: "Priest",
  3: "Baron",
  4: "Handmaid",
  5: "Prince",
  6: "King",
  7: "Countess",
  8: "Princess",
  9: "Bishop",
  10: "Constable",
  11: "Dowager Queen",
  12: "Sycophant",
  13: "Jester",
  14: "Assassin",
  15: "Cardinal",
  16: "Baroness",
  17: "Count",
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
  const [resultContent, setResultContent] = useState("");
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
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

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
    if ([1, 2, 3, 5, 6].includes(card.id)) {
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    }
  };

  const handleTargetConfirm = async ({ target, guess }) => {
    const cardPlayed = player.hand[selectedCardIndex];
    setShowTargetModal(false);
    setIsPlaying(true);

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

      // PREMIUM MODE: Always show AssassinPromptModal to target (for secrecy)
      if (result.requiresPrompt) {
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
        // Exit early - AssassinPromptModal will handle the rest
        return;
      }

      // NORMAL MODE: Handle Guard effect immediately (no Assassin cards exist)
      if (result.result === "correctGuess") {
        // Target was correctly guessed - eliminate them
        await update(ref(db, `rooms/${roomCode}/players/${target}`), {
          isOut: true,
        });
        pushNotification(
          roomCode,
          `🔮 The guess was true! ${target} held a ${
            cardNames[result.targetCard.id]
          }. Exiled from court!`
        );
        setResultContent(
          `Correct! ${target} had a ${
            cardNames[result.targetCard.id]
          }. Eliminated.`
        );
      } else {
        // Target was incorrectly guessed - they remain in play
        pushNotification(
          roomCode,
          `❌ Alas! ${target} was wrongly accused. They remain in play.`
        );
        setResultContent(`Wrong guess. ${target} was not holding a ${guess}.`);
      }

      // Show result to attacker for normal mode Guard effects
      await update(ref(db, `rooms/${roomCode}/effectResult`), {
        visibleTo: nickname, // Fixed: was 'attacker' which is undefined here
      });
    }

    // === PRIEST CARD LOGIC (ID: 2) ===
    else if (cardPlayed.id === 2) {
      const info = await applyPriestEffect({ roomCode, target });
      pushNotification(
        roomCode,
        `${playerNickname} whispered to the winds... peeking into ${target}'s mind. Behold: the ${
          cardNames[info.card.id]
        }!`
      );
      setResultContent(`${target}'s card is ${cardNames[info.card.id]}.`);

      // Show result to attacker
      await update(ref(db, `rooms/${roomCode}/effectResult`), {
        visibleTo: playerNickname,
      });
    }

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

    // Update Firebase with the turn completion
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${playerNickname}/hand`]: [remainingCard],
      [`players/${playerNickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
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

    const playedCard = player.hand[selectedCardIndex];
    const remainingCard = player.hand[1 - selectedCardIndex];
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

    // Update Firebase with the turn completion
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: [remainingCard],
      [`players/${nickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
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
              {Object.entries(players).map(([name, p]) => (
                <li key={name} style={{ marginBottom: "0.5rem" }}>
                  <strong>{p.name}</strong> ({p.realName})<br />
                  Tokens: {p.tokens} | Discard:{" "}
                  {(p.discard || []).map((card) => card.name).join(", ") || "—"}
                  {name === currentPlayer && " 👑 (current turn)"}
                  {name === nickname && " ← you"}
                </li>
              ))}
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
              onConfirm={handleTargetConfirm}
              onCancel={() => setShowTargetModal(false)}
            />
          )}

          {resultModalData && (
            <EffectResultModal
              resultText={resultModalData}
              onClose={async () => {
                await set(ref(db, `rooms/${roomCode}/actionResult`), null);
                setResultModalData(null);

                // Only call handleEffectResultClose if selectedCardIndex is valid
                // For Guard effects that went through AssassinPromptModal, selectedCardIndex will be null
                if (selectedCardIndex !== null) {
                  handleEffectResultClose();
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
