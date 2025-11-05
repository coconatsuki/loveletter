import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, set } from "firebase/database";
import { generateNickname } from "../utils/names";
import { generateRoomCode } from "../utils/room";
import { validateCreator } from "../utils/auth";
import landingMusic1 from "../sounds/landing1.mp3";
import landingMusic2 from "../sounds/landing2.mp3";
import landingMusic3 from "../sounds/landing3.mp3";
import "./LandingPage.css";

export default function CreateRoom() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preferredGender, setPreferredGender] = useState("");
  const [mode, setMode] = useState(""); // No default mode - force user to select
  const [isCreating, setIsCreating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const musicTracks = useRef([]);
  const navigate = useNavigate();

  // Fade utility functions for smooth volume transitions
  const fadeIn = (audio, targetVolume = 0.3, duration = 1000) => {
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
    // Clear any previous errors
    setAuthError("");

    // Check all required fields with proper length validation
    if (!nickname.trim() || nickname.trim().length < 3) {
      setAuthError(
        "⚠️ Please enter thy courtly title (at least 3 characters)!"
      );
      return;
    }

    if (!realName.trim() || realName.trim().length < 3) {
      setAuthError("⚠️ Thy noble name must be at least 3 characters long!");
      return;
    }

    if (!password.trim() || password.trim().length < 1) {
      setAuthError("⚠️ Please enter thy sacred password!");
      return;
    }

    if (!mode) {
      setAuthError("⚠️ Please select a Royal Tournament Mode!");
      return;
    }

    // Validate credentials
    const isValid = await validateCreator(realName, password);

    if (!isValid) {
      console.log("❌ Authentication failed");
      setAuthError(
        "🚫 Alas! Only the game's creator and trusted companions may establish royal courts. If thou art meant to be here, verify thy credentials!"
      );
      return;
    }

    console.log("✅ Authentication successful! Creating room...");

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
      setAuthError("❌ Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  // Initialize and shuffle music tracks
  useEffect(() => {
    console.log("🎵 MUSIC DEBUG: Initializing and shuffling tracks...");

    // Shuffle the three tracks randomly using Fisher-Yates
    const tracks = [
      { src: landingMusic1, name: "Landing Music 1" },
      { src: landingMusic2, name: "Landing Music 2" },
      { src: landingMusic3, name: "Landing Music 3" },
    ];

    const shuffled = [...tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    musicTracks.current = shuffled;

    console.log("🎵 Track order:", {
      first: shuffled[0].name,
      second: shuffled[1].name,
      third: shuffled[2].name,
    });

    // Set up the first track
    if (audioRef.current) {
      audioRef.current.src = shuffled[0].src;
      audioRef.current.volume = 0.7;
      audioRef.current.load();

      console.log("🎵 Audio element prepared with first track:", {
        src: audioRef.current.src,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
      });
    }
  }, []);

  // Handle track ending and switch to next
  useEffect(() => {
    const handleTrackEnd = () => {
      console.log("🎵 Track ended, switching to next...");

      const nextIndex = (currentTrackIndex + 1) % musicTracks.current.length;
      const nextTrack = musicTracks.current[nextIndex];

      console.log("🎵 Next track:", nextTrack.name);

      if (audioRef.current) {
        audioRef.current.src = nextTrack.src;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            console.log("🎵 Next track started playing");
            setCurrentTrackIndex(nextIndex);
            fadeIn(audioRef.current, 0.7, 2000);
          })
          .catch((error) => {
            console.error("🎵 Error playing next track:", error);
          });
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleTrackEnd);
      return () => {
        audioRef.current?.removeEventListener("ended", handleTrackEnd);
      };
    }
  }, [currentTrackIndex]);

  // Music setup and first-interaction trigger
  useEffect(() => {
    console.log(
      "🎵 MUSIC DEBUG: CreateRoom page mounted, setting up first-interaction trigger..."
    );

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

  // Check if all required conditions are met for the button to be "ready"
  const isFormReady =
    nickname.trim().length >= 3 &&
    realName.trim().length >= 3 &&
    password.trim().length >= 1 &&
    mode !== "";

  return (
    <div className="royal-landing-container">
      {/* Audio element for background music */}
      <audio ref={audioRef} preload="auto" />

      {/* Music toggle button */}
      <button
        onClick={toggleMusic}
        className="music-toggle-btn"
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "2px solid #d4af37",
          background: isPlaying
            ? "linear-gradient(135deg, #4CAF50, #45a049)"
            : "linear-gradient(135deg, #666, #555)",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: isPlaying
            ? "0 0 20px rgba(76, 175, 80, 0.5)"
            : "0 2px 10px rgba(0,0,0,0.3)",
        }}
        title={isPlaying ? "Silence the Royal Orchestra" : "Play Music"}
      >
        {isPlaying ? "🎵" : "🔇"}
      </button>

      {/* Full width centered title */}
      <div className="royal-header">
        <img
          src="/img/love-letter.png"
          alt="Love Letter"
          className="royal-header-image"
        />
        <div className="royal-header-text">
          <h1 className="royal-title-centered floating">
            Establish Royal Court
          </h1>
          <p className="royal-subtitle-centered">
            "Noble Game Master, Prepare Thy Sacred Chamber for the Grand
            Tournament!"
          </p>
        </div>
        <img
          src="/img/love-letter.png"
          alt="Love Letter"
          className="royal-header-image"
        />
      </div>

      <div className="royal-main-content">
        {/* 📜 Left Panel - The Royal Game Master Form */}
        <div className="royal-form-panel">
          {/* Authentication Row - Name & Password */}
          <div className="auth-row">
            <div className="auth-field name">
              <label className="royal-label auth">Thy Noble Name:</label>
              <input
                className="royal-input auth"
                value={realName}
                onChange={(e) => {
                  setRealName(e.target.value);
                  setAuthError("");
                }}
                placeholder="Thy name..."
              />
            </div>

            <div className="auth-field pwd">
              <label className="royal-label auth">Sacred Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="royal-input password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError("");
                  }}
                  placeholder="Passphrase..."
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              marginTop: "0.5rem",
              marginBottom: "1.5rem",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            🔐 Only authorized Game Masters may create royal courts
          </p>

          <fieldset className="royal-fieldset">
            <legend className="royal-legend">
              Thy Courtly Title & Royal Moniker
            </legend>

            <div className="name-generator-container">
              <div className="name-generator-input royal-form-group">
                <input
                  className="royal-input"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setAuthError("");
                  }}
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
                  onChange={(e) => {
                    setMode(e.target.value);
                    setAuthError("");
                  }}
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
                  onChange={(e) => {
                    setMode(e.target.value);
                    setAuthError("");
                  }}
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

          {/* Error Messages Display - Above Button */}
          {authError && (
            <div className="validation-errors">
              <div className="error-message">{authError}</div>
            </div>
          )}

          <button
            onClick={handleCreate}
            className="royal-button create-button"
            disabled={isCreating}
            style={{
              width: "100%",
              fontSize: "1.2rem",
              opacity: isCreating ? 0.6 : isFormReady ? 1 : 0.5,
              filter: !isFormReady && !isCreating ? "blur(0.5px)" : "none",
              cursor: isCreating ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {isCreating ? (
              <>🏗️ Establishing Royal Court... 🏗️</>
            ) : !isFormReady ? (
              <>🔒 Complete the form to proceed 🔒</>
            ) : (
              <>👑 Establish thy Royal Court 👑</>
            )}
          </button>
        </div>

        {/* 🖼️ Right Panel - Princess Artwork */}
        <div className="royal-artwork-panel">
          <img
            src="/img/princess-square.jpeg"
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
