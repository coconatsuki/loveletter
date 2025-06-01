import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { getStartingPlayer, shuffleDeck } from "../utils/gamehelpers";

export default function Room() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const nickname = state?.nickname;
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState("");
  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    if (nickname) {
      const playerRef = ref(db, `rooms/${roomCode}/players/${nickname}`);
      update(playerRef, {
        name: nickname,
        isOut: false,
        tokens: 0,
      });
    }

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.players) {
        setPlayers(Object.values(data.players));
      }
      if (data?.host) {
        setHost(data.host);
      }
    });
    return () => unsubscribe();
  }, [roomCode]);

  const isHost = nickname === host;

  const startGame = () => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    onValue(
      roomRef,
      (snapshot) => {
        const roomData = snapshot.val();
        if (!roomData?.players) return;

        const playerNames = Object.keys(roomData.players);
        const fullDeck = Array.from({ length: 32 }, (_, i) => i + 1); // Placeholder 1–32
        const shuffled = shuffleDeck(fullDeck);
        const hiddenCard = shuffled.shift(); // remove 1 card

        const hands = {};
        playerNames.forEach((name) => {
          hands[name] = {
            ...roomData.players[name],
            hand: [shuffled.shift()],
            discard: [],
            isOut: false,
          };
        });

        const startingPlayer = getStartingPlayer(roomData.players, roundNumber);

        update(roomRef, {
          gameState: "inRound",
          players: hands,
          round: {
            hiddenCard,
            deck: shuffled,
            currentPlayer: startingPlayer,
          },
        });
      },
      { onlyOnce: true }
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Room Code: {roomCode}</h2>
      <p>
        Welcome, <strong>{nickname}</strong>
      </p>

      <h3>Players in Room:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.name}
            {player.name === host && " 👑 (host)"}
            {player.name === nickname && " ← you"}
          </li>
        ))}
      </ul>

      {isHost && (
        <button
          onClick={startGame}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          Start Game
        </button>
      )}
    </div>
  );
}
