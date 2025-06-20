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

const cardEffects = {
  1: "Guess a strength (≠1). If correct, target is eliminated.",
  2: "View another player's hand.",
  3: "Compare hands. Lower card is eliminated.",
  4: "You are protected until your next turn.",
  5: "Target discards hand and draws a new one.",
  6: "Trade hands with another player.",
  7: "Must be played if with Prince or King.",
  8: "If discarded, you are eliminated.",
  9: "Guess a strength. If correct, gain an affection token.",
  10: "If eliminated, gain 1 affection token.",
  11: "Compare hands. Higher is eliminated.",
  12: "Choose who the next player must target.",
  13: "Choose a player. If they win, you gain a token.",
  14: "If targeted with Guard, eliminate attacker instead.",
  15: "Trade hands. View the new card if you wish.",
  16: "View the hands of two players.",
  17: "If discarded or played, add +1 to your hand strength.",
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
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultContent, setResultContent] = useState("");
  const [assassinDecision, setAssassinDecision] = useState(null);

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

  if (!roomData || !player) return <div>Loading game data...</div>;

  const { round, players } = roomData;
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
      if (result.requiresAssassinDecision && target === nickname) {
        setAssassinDecision({ attacker: result.attacker, target });
        return;
      } else if (result.requiresAssassinDecision) {
        return;
      } else if (result.result === "correctGuess") {
        await update(ref(db, `rooms/${roomCode}/players/${target}`), {
          isOut: true,
        });
        setResultContent(
          `Correct! ${target} had a ${
            cardNames[result.targetCard.id]
          }. They are eliminated.`
        );
      } else {
        setResultContent(`Wrong guess. ${target} was not holding a ${guess}.`);
      }
    } else if (cardPlayed.id === 2) {
      const info = await applyPriestEffect({ roomCode, target });
      setResultContent(`${target}'s card is ${cardNames[info.card.id]}.`);
    }

    setShowResultModal(true);
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

    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: [remainingCard],
      [`players/${nickname}/discard`]: discard,
      round: { ...round, currentPlayer: nextPlayer },
    });

    setIsPlaying(false);
    setShowResultModal(false);
    setSelectedCardIndex(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Game Board for Room {roomCode}</h2>
      <h3>Current Player: {currentPlayer}</h3>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <h3>Your Hand:</h3>
        <ul>
          {player.hand.map((card, idx) => (
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
          Someone sniffed out your card. You can no longer play this round, but
          may still witness the chaos as it unfolds...
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
                  <strong>{card.name}</strong> (Strength {card.strength})<br />
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

      {showResultModal && (
        <EffectResultModal
          resultText={resultContent}
          onClose={handleEffectResultClose}
        />
      )}

      {assassinDecision && nickname === assassinDecision.target && (
        <AssassinPromptModal
          attacker={assassinDecision.attacker}
          onReveal={async () => {
            const result = await resolveAssassinDefense(assassinDecision);
            setAssassinDecision(null);
            setResultContent(
              `You revealed the Assassin! ${assassinDecision.attacker} was eliminated. You drew card ${result.newCard.name}.`
            );
            setShowResultModal(true);
          }}
          onIgnore={() => {
            setAssassinDecision(null);
            setResultContent("You chose not to reveal the Assassin.");
            setShowResultModal(true);
          }}
        />
      )}
    </div>
  );
}
