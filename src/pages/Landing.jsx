import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateNickname } from "../utils/names";

export default function Landing() {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (nickname && roomCode) {
      navigate(`/room/${roomCode}`, { state: { nickname } });
    }
  };

  return (
    <div>
      <h1>Welcome to Love Letter Online</h1>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter nickname"
      />
      <button onClick={() => setNickname(generateNickname())}>
        🎲 Generate Name
      </button>
      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}
