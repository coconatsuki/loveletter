import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateNickname } from "../utils/names";

export default function Landing() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (nickname && realName && roomCode) {
      navigate(`/room/${roomCode}`, {
        state: { nickname, realName },
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello from Love Letter Landing Page!</h1>

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
          placeholder="Funny nickname"
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

      <div style={{ marginTop: "1rem" }}>
        <label>Room Code:</label>
        <br />
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Room code"
        />
      </div>

      <button onClick={handleJoin} style={{ marginTop: "1rem" }}>
        Join Room
      </button>
    </div>
  );
}
