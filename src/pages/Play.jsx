import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";

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
  25: "Glitchy Goblin",
  30: "Mystic Chicken",
};

export default function Play() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const nickname = state?.nickname;
  const [roomData, setRoomData] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setIsPlaying(true);

    const nextCard = round.deck[0];
    const newDeck = round.deck.slice(1);
    const newHand = [...player.hand, nextCard];

    const roomRef = ref(db, `rooms/${roomCode}`);
    update(roomRef, {
      round: {
        ...round,
        deck: newDeck,
      },
      [`players/${nickname}/hand`]: newHand,
    }).finally(() => setIsPlaying(false));
  };

  const playCard = (cardIndex) => {
    if (!isMyTurn || player.hand?.length !== 2 || isPlaying) return;
    setIsPlaying(true);

    const playedCard = player.hand[cardIndex];
    const remainingCard = player.hand[1 - cardIndex];
    const discard = [...(player.discard || []), playedCard];

    const playerOrder = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = playerOrder.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % playerOrder.length;
    while (players[playerOrder[nextIndex]]?.isOut) {
      nextIndex = (nextIndex + 1) % playerOrder.length;
    }
    const nextPlayer = playerOrder[nextIndex];

    const roomRef = ref(db, `rooms/${roomCode}`);
    update(roomRef, {
      [`players/${nickname}/hand`]: [remainingCard],
      [`players/${nickname}/discard`]: discard,
      round: {
        ...round,
        currentPlayer: nextPlayer,
      },
    }).finally(() => setIsPlaying(false));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Game Board for Room {roomCode}</h2>
      <h3>Current Player: {currentPlayer}</h3>

      <div style={{ marginTop: "2rem" }}>
        <h3>Players:</h3>
        <ul>
          {Object.entries(players).map(([name, p]) => (
            <li key={name} style={{ marginBottom: "0.5rem" }}>
              <strong>{p.name}</strong> ({p.realName})<br />
              Tokens: {p.tokens} | Discard: {p.discard?.join(", ") || "—"}
              {name === currentPlayer && " 👑 (current turn)"}
              {name === nickname && " ← you"}
            </li>
          ))}
        </ul>
      </div>

      {isMyTurn && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#ffe5b4",
          }}
        >
          <h3>It’s your turn!</h3>

          {player.hand?.length === 1 && (
            <button onClick={drawCard} disabled={isPlaying}>
              Draw Card
            </button>
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
                  Play {card} ({cardNames[card] || "Unknown"})
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
    </div>
  );
}
