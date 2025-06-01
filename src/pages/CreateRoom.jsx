import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { ref, set } from 'firebase/database';
import { generateRoomCode } from '../utils/room';

export default function CreateRoom() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nickname) return;
    const roomCode = generateRoomCode();
    await set(ref(db, `rooms/${roomCode}`), {
      host: nickname,
      players: {
        [nickname]: {
          name: nickname,
          tokens: 0,
          discard: [],
          isOut: false,
        }
      },
      mode: null,
      gameState: 'waiting',
    });
    navigate(`/room/${roomCode}`, { state: { nickname } });
  };

  return (
    <div>
      <h1>Create Room</h1>
      <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Your nickname" />
      <button onClick={handleCreate}>Create Game</button>
    </div>
  );
}