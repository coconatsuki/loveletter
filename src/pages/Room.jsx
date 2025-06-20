import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { generateNickname } from "../utils/names";
import { buildDeck } from "../utils/deckBuilder";

export default function Room() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roomMode, setRoomMode] = useState("normal");

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    if (nickname) {
      const playerRef = ref(db, `rooms/${roomCode}/players/${nickname}`);
      update(playerRef, {
        name: nickname,
        realName: realName || "",
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
      if (data?.mode) {
        setRoomMode(data.mode);
      }
      if (data?.gameState === "inRound") {
        setGameStarted(true);
      }
    });

    return () => unsubscribe();
  }, [roomCode, nickname, realName]);

  useEffect(() => {
    if (gameStarted) {
      navigate(`/play/${roomCode}`, { state: { nickname } });
    }
  }, [gameStarted, navigate, roomCode, nickname]);

  const isHost = nickname === host;

  const startGame = () => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    onValue(
      roomRef,
      (snapshot) => {
        const roomData = snapshot.val();
        if (!roomData?.players) return;

        const playerNames = Object.keys(roomData.players);
        const fullDeck = buildDeck(roomData.mode || "normal");
        const shuffled = [...fullDeck];

        const hiddenCard = shuffled.shift();

        const hands = {};
        playerNames.forEach((name) => {
          hands[name] = {
            ...roomData.players[name],
            hand: [shuffled.shift()],
            discard: [],
            isOut: false,
          };
        });

        const startingPlayer =
          playerNames[Math.floor(Math.random() * playerNames.length)];

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
            {player.name} ({player.realName})
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
