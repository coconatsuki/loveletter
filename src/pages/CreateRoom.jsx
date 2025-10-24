import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, set } from "firebase/database";
import { generateNickname } from "../utils/names";
import { generateRoomCode } from "../utils/room";
import princessImage from "../img/princess-square.jpeg";
import loveLetterImage from "../img/love-letter.png";
import sentimentalMusic from "../sounds/sentimental-classical-gentle-love.mp3";
import "./LandingPage.css";

export default function CreateRoom() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [mode, setMode] = useState("normal");
  const [isCreating, setIsCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Fade utility functions for smooth volume transitions
  const fadeIn = (audio, targetVolume = 0.7, duration = 1000) => {
    return new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      audio.volume = 0;
      const steps = 50; // Number of volume steps
      const stepTime = duration / steps;
      const volumeIncrement = targetVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);

        if (currentStep >= steps) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          audio.volume = targetVolume;
          resolve();
        }
      }, stepTime);
    });
  };

  const fadeOut = (audio, duration = 800) => {
    return new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const initialVolume = audio.volume;
      const steps = 50;
      const stepTime = duration / steps;
      const volumeDecrement = initialVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(
          initialVolume - volumeDecrement * currentStep,
          0
        );

        if (currentStep >= steps || audio.volume <= 0) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          audio.volume = 0;
          audio.pause();
          resolve();
        }
      }, stepTime);
    });
  };

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
            roundTokens: 0,
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

  // Music setup and first-interaction trigger
  useEffect(() => {
    console.log(
      "🎵 MUSIC DEBUG: CreateRoom page mounted, setting up first-interaction trigger..."
    );

    if (audioRef.current) {
      // Set up audio properties
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;

      // Ensure audio is loaded before attempting to play
      audioRef.current.load();

      console.log("🎵 Audio element prepared:", {
        src: audioRef.current.src,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
      });
    }

    // Function to handle first user interaction
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && audioRef.current) {
        console.log("🎵 FIRST INTERACTION DETECTED: Starting music...");
        console.log("🎵 Audio state before play:", {
          readyState: audioRef.current.readyState,
          networkState: audioRef.current.networkState,
          paused: audioRef.current.paused,
          currentTime: audioRef.current.currentTime,
          duration: audioRef.current.duration,
        });

        setHasUserInteracted(true);

        // Wait a moment to ensure audio is ready, then play with fade-in
        setTimeout(() => {
          audioRef.current
            .play()
            .then(() => {
              console.log(
                "🎵 SUCCESS: Music started after user interaction, fading in..."
              );
              setIsPlaying(true);
              // Fade in the music smoothly
              fadeIn(audioRef.current);
            })
            .catch((error) => {
              console.log(
                "🎵 ERROR: Could not start music after interaction -",
                error.message
              );
              console.log("🎵 Audio state after error:", {
                readyState: audioRef.current.readyState,
                networkState: audioRef.current.networkState,
                error: audioRef.current.error,
              });
              setIsPlaying(false);
            });
        }, 100); // Small delay to ensure audio is ready
      }
    };

    // Add event listeners for any user interaction
    const interactionEvents = ["click", "keydown", "keyup", "input", "change"];

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: false });
    });

    // Cleanup function
    return () => {
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });

      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [hasUserInteracted]);

  // Music toggle function with smooth fade effects
  const toggleMusic = () => {
    if (audioRef.current) {
      console.log("🎵 TOGGLE MUSIC: Current state:", {
        isPlaying,
        paused: audioRef.current.paused,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
        src: audioRef.current.src,
      });

      if (isPlaying) {
        console.log("🎵 Fading out music...");
        setIsPlaying(false);
        fadeOut(audioRef.current).then(() => {
          console.log("🎵 Music faded out and paused by user");
        });
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("🎵 Music started by user, fading in...");
            fadeIn(audioRef.current);
          })
          .catch((error) => {
            console.error("🎵 Error playing music:", error);
            console.log("🎵 Audio error details:", {
              readyState: audioRef.current.readyState,
              networkState: audioRef.current.networkState,
              error: audioRef.current.error,
            });
          });
      }
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
      {/* Audio element for background music */}
      <audio ref={audioRef} src={sentimentalMusic} preload="auto" />

      {/* Music toggle button */}
      <button
        onClick={toggleMusic}
        className="music-toggle-btn"
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "0.5rem",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          background: isPlaying ? "#4CAF50" : "#666",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
        title={isPlaying ? "Stop Music" : "Play Music"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

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
                    (6–11 Noble Suitors)
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
