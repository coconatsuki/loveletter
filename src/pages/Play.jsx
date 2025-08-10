import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
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

  useEffect(() => {
    const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
    const unsubscribe = onValue(promptRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.target === nickname) {
        setGuardTargetPromptData(data);
        setShowGuardTargetPrompt(true);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

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

    if (cardPlayed.id === 1) {
      const result = await applyGuardEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      pushNotification(
        roomCode,
        `${nickname} played a Guard and pointed their finger at ${target}, whispering: "Strength ${guess}!"`
      );

      if (result.requiresPrompt) {
        const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
        await update(promptRef, {
          ...result,
          timestamp: Date.now(),
          // Store info needed to complete the turn later
          cardPlayInfo: {
            playedCardIndex: selectedCardIndex,
            playerNickname: nickname,
          },
        });
        return;
      } else {
        if (result.result === "correctGuess") {
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
          pushNotification(
            roomCode,
            `❌ Alas! ${target} was wrongly accused. They remain in play.`
          );
          setResultContent(
            `Wrong guess. ${target} was not holding a ${guess}.`
          );
        }
        await update(ref(db, `rooms/${roomCode}/effectResult`), {
          visibleTo: attacker,
        });
      }
    } else if (cardPlayed.id === 2) {
      const info = await applyPriestEffect({ roomCode, target });
      pushNotification(
        roomCode,
        `${nickname} whispered to the winds... peeking into ${target}'s mind. Behold: the ${
          cardNames[info.card.id]
        }!`
      );
      setResultContent(`${target}'s card is ${cardNames[info.card.id]}.`);
      await update(ref(db, `rooms/${roomCode}/effectResult`), {
        visibleTo: attacker,
      });
    }
  };

  const completeGuardTurn = async (guardPromptData) => {
    const { cardPlayInfo } = guardPromptData;
    if (!cardPlayInfo) return; // No card play info stored
    
    const { playedCardIndex, playerNickname } = cardPlayInfo;
    const attackerPlayer = players[playerNickname];
    if (!attackerPlayer || !attackerPlayer.hand) return;

    const playedCard = attackerPlayer.hand[playedCardIndex];
    const remainingCard = attackerPlayer.hand[1 - playedCardIndex];
    const discard = [...(attackerPlayer.discard || []), playedCard];

    const playerOrder = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = playerOrder.indexOf(playerNickname);
    let nextIndex = (currentIndex + 1) % playerOrder.length;
    while (players[playerOrder[nextIndex]]?.isOut) {
      nextIndex = (nextIndex + 1) % playerOrder.length;
    }
    const nextPlayer = playerOrder[nextIndex];

    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${playerNickname}/hand`]: [remainingCard],
      [`players/${playerNickname}/discard`]: discard,
      [`round/currentPlayer`]: nextPlayer,
    });

    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );
  };

  const handleEffectResultClose = async () => {
    const playedCard = player.hand[selectedCardIndex];
    const remainingCard = player.hand[1 - selectedCardIndex];
    const discard = [...(player.discard || []), playedCard];

    const playerOrder = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = playerOrder.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % playerOrder.length;
    while (players[playerOrder[nextIndex]]?.isOut) {
      nextIndex = (nextIndex + 1) % playerOrder.length;
    }
    const nextPlayer = playerOrder[nextIndex];

    console.log("Debug handleEffectResultClose:", {
      playedCard,
      remainingCard,
      discard,
      nextPlayer,
      selectedCardIndex,
    });

    // Validate all values before updating
    if (!playedCard || !remainingCard || !nextPlayer) {
      console.error("Invalid values detected:", {
        playedCard,
        remainingCard,
        nextPlayer,
      });
      return;
    }

    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: [remainingCard],
      [`players/${nickname}/discard`]: discard,
      [`round/currentPlayer`]: nextPlayer,
    });

    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    setIsPlaying(false);
    /*
    await update(ref(db, `rooms/${roomCode}/actionResult`), {
      resultText: resultContent,
    });
    */
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
                await update(ref(db, `rooms/${roomCode}/actionResult`), null);
                setResultModalData(null);
                
                // Only call handleEffectResultClose if selectedCardIndex is valid
                // For Guard effects that went through AssassinPromptModal, selectedCardIndex will be null
                if (selectedCardIndex !== null) {
                  handleEffectResultClose();
                }
              }}
            />
          )}

          {showGuardTargetPrompt &&
            guardTargetPromptData &&
            nickname === guardTargetPromptData.target && (
              <AssassinPromptModal
                promptData={guardTargetPromptData}
                onAcknowledge={async () => {
                  const { isCorrectGuess, targetCard, target, attacker } =
                    guardTargetPromptData;

                  let finalResultContent;

                  if (isCorrectGuess) {
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
                    pushNotification(
                      roomCode,
                      `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                    );
                    finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;
                  }

                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: attacker,
                  });

                  // Complete the Guard card turn
                  await completeGuardTurn(guardTargetPromptData);

                  setGuardTargetPromptData(null);
                  setShowGuardTargetPrompt(false);

                  console.log(
                    "nickname === currentPlayer? => " +
                      (nickname === round?.currentPlayer)
                  );
                }}
                onReveal={async () => {
                  const { target, attacker } = guardTargetPromptData;
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

                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: attacker,
                  });
                  setGuardTargetPromptData(null);
                  setShowGuardTargetPrompt(false);
                }}
                onIgnore={async () => {
                  const { target } = guardTargetPromptData;

                  pushNotification(
                    roomCode,
                    `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                  );

                  const finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;

                  await update(ref(db, `rooms/${roomCode}`), {
                    guardPrompt: null,
                  });
                  await update(ref(db, `rooms/${roomCode}/actionResult`), {
                    resultText: finalResultContent,
                    attacker: guardTargetPromptData.attacker,
                  });
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
