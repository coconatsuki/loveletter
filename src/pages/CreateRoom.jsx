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
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nickname || !realName) return;
    const roomCode = generateRoomCode();
    await set(ref(db, `rooms/${roomCode}`), {
      host: nickname,
      players: {
        [nickname]: {
          name: nickname,
          realName,
          tokens: 0,
          discard: [],
          isOut: false,
        },
      },
      mode: null,
      gameState: "waiting",
    });
    navigate(`/room/${roomCode}`, { state: { nickname, realName } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Room</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Real Name:</label>
        <br />
        <input
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          placeholder="Enter your real name"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Nickname:</label>
        <br />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your nickname"
        />
        <button onClick={() => setNickname(generateNickname(preferredGender))}>
          🎲 Generate Name
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <fieldset>
          <legend>Choose Your Title:</legend>
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
      </div>

      <button onClick={handleCreate} style={{ marginTop: "1rem" }}>
        Create Game
      </button>
    </div>
  );
}
