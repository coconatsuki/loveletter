import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, set } from "firebase/database";
import { generateNickname } from "../utils/names";
import { generateRoomCode } from "../utils/room";

export default function CreateRoom() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [mode, setMode] = useState("normal");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nickname || !realName) return;
    const roomCode = generateRoomCode();
    await set(ref(db, `rooms/${roomCode}`), {
      host: nickname,
      mode,
      players: {
        [nickname]: {
          name: nickname,
          realName,
          tokens: 0,
          discard: [],
          isOut: false,
        },
      },
      gameState: "waiting",
    });
    navigate(`/room/${roomCode}`, { state: { nickname, realName } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Room</h1>

      <label>Real Name:</label>
      <br />
      <input value={realName} onChange={(e) => setRealName(e.target.value)} />
      <br />

      <fieldset style={{ marginTop: "1rem" }}>
        <legend>Choose your courtly title and nickname:</legend>
        <div style={{ marginBottom: "1rem" }}>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Funny nickname"
          />
          <button
            onClick={() => setNickname(generateNickname(preferredGender))}
            style={{ marginLeft: "1rem" }}
          >
            🎲 Generate Name
          </button>
        </div>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={preferredGender === "female"}
            onChange={(e) => setPreferredGender(e.target.value)}
          />
          👸 My Lady
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={preferredGender === "male"}
            onChange={(e) => setPreferredGender(e.target.value)}
          />
          🤴 My Lord
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="gender"
            value=""
            checked={preferredGender === ""}
            onChange={(e) => setPreferredGender(e.target.value)}
          />
          🧙 Whichever suits me
        </label>
      </fieldset>

      <fieldset style={{ marginTop: "1rem" }}>
        <legend>Game Mode:</legend>
        <label>
          <input
            type="radio"
            value="normal"
            checked={mode === "normal"}
            onChange={(e) => setMode(e.target.value)}
          />
          🎲 Classic (2–4 players)
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="premium"
            checked={mode === "premium"}
            onChange={(e) => setMode(e.target.value)}
          />
          🧙 Premium (5–8 players)
        </label>
      </fieldset>

      <button onClick={handleCreate} style={{ marginTop: "1rem" }}>
        Create Game
      </button>
    </div>
  );
}
