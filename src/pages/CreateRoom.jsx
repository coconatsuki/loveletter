import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, set } from "firebase/database";
import { generateNickname } from "../utils/names";
import { generateRoomCode } from "../utils/room";
import princessImage from "../img/princess-square.jpeg";
import loveLetterImage from "../img/love-letter.png";
import "./LandingPage.css";

export default function CreateRoom() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [mode, setMode] = useState("normal");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nickname || !realName) return;

    setIsCreating(true);
    try {
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
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsCreating(false);
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
          <h1 className="royal-title-centered floating">
            Establish Royal Court
          </h1>
          <p className="royal-subtitle-centered">
            "Noble Game Master, Prepare Thy Sacred Chamber for the Grand
            Tournament of Love Letters!"
          </p>
        </div>
        <img
          src={loveLetterImage}
          alt="Love Letter"
          className="royal-header-image"
        />
      </div>

      <div className="royal-main-content">
        {/* 📜 Left Panel - The Royal Game Master Form */}
        <div className="royal-form-panel">
          <div className="royal-form-group">
            <label className="royal-label">Thy Noble Name:</label>
            <input
              className="royal-input"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="By what name shall the court know thee?"
            />
          </div>

          <fieldset className="royal-fieldset">
            <legend className="royal-legend">
              Thy Courtly Title & Royal Moniker
            </legend>

            <div className="name-generator-container">
              <div className="name-generator-input royal-form-group">
                <input
                  className="royal-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter thy majestic court name"
                />
              </div>
              <button
                className="royal-button generate-name-btn"
                onClick={handleGenerateName}
              >
                🎲 Generate Royal Name
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

          <fieldset className="royal-fieldset">
            <legend className="royal-legend">Royal Tournament Mode</legend>

            <div className="mode-options">
              <label className="mode-option">
                <input
                  type="radio"
                  value="normal"
                  checked={mode === "normal"}
                  onChange={(e) => setMode(e.target.value)}
                  style={{ display: "none" }}
                />
                <div className="mode-option-content">
                  <div>🎲 Classic Court</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    (2–5 Noble Suitors)
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    A refined gathering for intimate courtship
                  </div>
                </div>
              </label>
              <label className="mode-option">
                <input
                  type="radio"
                  value="premium"
                  checked={mode === "premium"}
                  onChange={(e) => setMode(e.target.value)}
                  style={{ display: "none" }}
                />
                <div className="mode-option-content">
                  <div>🧙 Premium Court</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    (6–10 Noble Suitors)
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    A grand tournament with extended royal intrigue
                  </div>
                </div>
              </label>
            </div>
          </fieldset>

          <button
            onClick={handleCreate}
            className="royal-button create-button"
            disabled={!nickname || !realName || isCreating}
            style={{
              width: "100%",
              fontSize: "1.2rem",
              opacity: !nickname || !realName || isCreating ? 0.6 : 1,
              cursor:
                !nickname || !realName || isCreating
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isCreating ? (
              <>🏗️ Establishing Royal Court... 🏗️</>
            ) : (
              <>👑 Establish thy Royal Court 👑</>
            )}
          </button>
        </div>

        {/* 🖼️ Right Panel - Princess Artwork */}
        <div className="royal-artwork-panel">
          <img
            src={princessImage}
            alt="Princess of the Royal Court"
            className="princess-artwork"
            style={{ margin: "4rem" }}
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
