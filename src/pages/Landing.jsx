import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateNickname } from "../utils/names";
import princessImage from "../img/princess-square.jpeg";
import loveLetterImage from "../img/love-letter.png";
import "./LandingPage.css";

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

  const handleGenerateName = () => {
    const generatedName = generateNickname(preferredGender);
    setNickname(generatedName);
    // Add visual feedback
    const button = document.querySelector(".generate-name-btn");
    if (button) {
      button.classList.add("success-glow");
      setTimeout(() => button.classList.remove("success-glow"), 600);
    }
  };

  return (
    <div className="royal-landing-container">
      {/* Full width centered title */}
      <div className="royal-header">
        <img
          src={loveLetterImage}
          alt="Love Letter"
          className="royal-header-image"
        />
        <div className="royal-header-text">
          <h1 className="royal-title-centered floating">LOVE LETTER</h1>
          <p className="royal-subtitle-centered">
            "Who wants to win a princess's heart... and her noble crown?"
          </p>
        </div>
        <img
          src={loveLetterImage}
          alt="Love Letter"
          className="royal-header-image"
        />
      </div>

      <div className="royal-main-content">
        {/* 📜 Left Panel - The Royal Court Entry Form */}
        <div className="royal-form-panel">
          <div className="royal-form-group">
            <label className="royal-label">Thy True Name:</label>
            <input
              className="royal-input"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="By what name art thou known in the realm?"
            />
          </div>

          <fieldset className="royal-fieldset">
            <legend className="royal-legend">
              Choose Thy Courtly Title & Moniker
            </legend>
            <div className="name-generator-container">
              <div className="name-generator-input royal-form-group">
                <input
                  className="royal-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter thy courtly nickname"
                />
              </div>
              <button
                className="royal-button generate-name-btn"
                onClick={handleGenerateName}
              >
                🎲 Generate Noble Name
              </button>
            </div>

            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={preferredGender === "female"}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">👸 Lady name</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={preferredGender === "male"}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">🤴 Lord name</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value=""
                  checked={preferredGender === ""}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">⚡ Neutral name</span>
              </label>
            </div>
          </fieldset>

          <div className="royal-form-group room-code-group">
            <label className="royal-label">Sacred Room Code:</label>
            <input
              className="royal-input"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter the mystical chamber code..."
            />
          </div>

          <button
            onClick={handleJoin}
            className="royal-button"
            disabled={!nickname || !realName || !roomCode}
            style={{
              width: "100%",
              fontSize: "1.2rem",
              opacity: !nickname || !realName || !roomCode ? 0.6 : 1,
              cursor:
                !nickname || !realName || !roomCode ? "not-allowed" : "pointer",
            }}
          >
            🏰 Enter the Royal Court 🏰
          </button>
        </div>

        {/* 🖼️ Right Panel - Princess Artwork */}
        <div className="royal-artwork-panel">
          <div className="story-container">
            <p className="story-1">
              ⚔️ The throne is vacant: the King is dead, the Queen a traitor.
            </p>
            <p className="story-2">
              👑 Only Princess Charlotte remains, drowning in sorrow and gossip.
            </p>
            <p className="story-2">
              ❤️‍🔥 Could you be the one to heal her misery…
            </p>
            <p className="story-2">
              …and upgrade yourself from nobody to sovereign?
            </p>
            <p className="story-1 story-4">HOW?</p>
            <p className="story-3">
              💌 Find a fool brave enough to carry your love letter past locked
              doors. <br />
              Only then may she read your plea… or laugh at it over tea. 🫖
            </p>
          </div>

          <img
            src={princessImage}
            alt="Princess of the Royal Court"
            className="princess-artwork"
          />
        </div>
      </div>

      {/* 👑 Royal Footer */}
      <footer className="royal-footer">
        <p className="royal-footer-text">
          Made by Amandine & Archie, with love ❤️‍🔥
        </p>
      </footer>
    </div>
  );
}
