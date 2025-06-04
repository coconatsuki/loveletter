import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { db } from '../utils/firebase';
import { ref, onValue } from 'firebase/database';

export default function Play() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const nickname = state?.nickname;
  const [roomData, setRoomData] = useState(null);
  const [player, setPlayer] = useState(null);

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

  const { round, players, gameState } = roomData;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Game Room: {roomCode}</h2>
      <h3>Current Player: {round?.currentPlayer}</h3>

      <h3>Your Hand:</h3>
      <p>{player.hand?.[0] ?? "No card"}</p>

      <h3>Players:</h3>
      <ul>
        {Object.entries(players).map(([name, p]) => (
          <li key={name}>
            {p.name} ({p.realName}) | Tokens: {p.tokens} | Discard: {p.discard?.join(', ') || '—'}
          </li>
        ))}
      </ul>

      {nickname === round?.currentPlayer && (
        <div style={{ marginTop: "1rem", color: "green" }}>
          <strong>It’s your turn!</strong>
        </div>
      )}
    </div>
  );
}
