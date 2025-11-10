import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import "./GameScoring.css";
import weddingMusic1 from "../sounds/wedding-music1.mp3";
import weddingMusic2 from "../sounds/wedding-music2.mp3";

export default function GameScoring() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Music state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayFadeOut, setOverlayFadeOut] = useState(false);

  // Audio refs for both tracks
  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);
  const fadeIntervalRef = useRef(null);
  const musicTracks = useRef([]);
  const currentAudioRef = useRef(null);

  // Epic entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setPageVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fade utility functions for smooth volume transitions
  const fadeIn = (audio, targetVolume = 0.3, duration = 3000) => {
    return new Promise((resolve) => {
      if (!audio) {
        console.error("❌ fadeIn: no audio element");
        resolve();
        return;
      }

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      audio.volume = 0;
      const steps = 60; // More steps for smoother fade
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

  const fadeOut = (audio, duration = 1000) => {
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
      const steps = 30;
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

  // Initialize music tracks and shuffle
  useEffect(() => {
    console.log("🎵 GAME SCORING MUSIC: Initializing tracks...");

    // Shuffle the two tracks randomly
    const tracks = [
      { ref: audio1Ref, src: weddingMusic1, name: "Wedding Music 1" },
      { ref: audio2Ref, src: weddingMusic2, name: "Wedding Music 2" },
    ];

    // Fisher-Yates shuffle
    const shuffled = [...tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    musicTracks.current = shuffled;

    console.log("🎵 Track order:", {
      first: shuffled[0].name,
      second: shuffled[1].name,
    });

    // Preload audio files
    if (audio1Ref.current && audio2Ref.current) {
      audio1Ref.current.load();
      audio2Ref.current.load();
    }
  }, []);

  // Handle track ending and switch to next
  const handleTrackEnd = () => {
    console.log("🎵 Track ended, switching to next...");

    const nextIndex = (currentTrackIndex + 1) % musicTracks.current.length;
    const nextTrack = musicTracks.current[nextIndex];

    console.log("🎵 Next track:", nextTrack.name);

    // Fade out current, then fade in next
    if (currentAudioRef.current) {
      fadeOut(currentAudioRef.current, 2000).then(() => {
        setCurrentTrackIndex(nextIndex);
        currentAudioRef.current = nextTrack.ref.current;

        if (isPlaying && currentAudioRef.current) {
          currentAudioRef.current.currentTime = 0;
          currentAudioRef.current
            .play()
            .then(() => {
              console.log("🎵 Next track playing, fading in...");
              fadeIn(currentAudioRef.current, 0.3, 3000);
            })
            .catch((err) => console.error("🎵 Error playing next track:", err));
        }
      });
    }
  };

  // Set up track end listeners
  useEffect(() => {
    if (audio1Ref.current && audio2Ref.current) {
      audio1Ref.current.addEventListener("ended", handleTrackEnd);
      audio2Ref.current.addEventListener("ended", handleTrackEnd);

      return () => {
        if (audio1Ref.current) {
          audio1Ref.current.removeEventListener("ended", handleTrackEnd);
        }
        if (audio2Ref.current) {
          audio2Ref.current.removeEventListener("ended", handleTrackEnd);
        }
      };
    }
  }, [currentTrackIndex, isPlaying]);

  // Handle overlay click (first user interaction)
  const handleOverlayClick = () => {
    console.log("🎵 OVERLAY CLICKED: Starting music...");

    // Animate overlay out
    setOverlayFadeOut(true);

    setTimeout(() => {
      setShowOverlay(false);

      // Start playing the first track
      const firstTrack = musicTracks.current[0];
      currentAudioRef.current = firstTrack.ref.current;

      if (currentAudioRef.current) {
        currentAudioRef.current
          .play()
          .then(() => {
            console.log("🎵 First track started playing");
            setIsPlaying(true);
            fadeIn(currentAudioRef.current, 0.3, 3000);
          })
          .catch((error) => {
            console.error("🎵 Error starting first track:", error);
          });
      }
    }, 600); // Wait for overlay fade-out animation
  }; // Handle keyboard interaction for overlay
  useEffect(() => {
    if (!showOverlay || overlayFadeOut) return;

    const handleKeyPress = (e) => {
      handleOverlayClick();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showOverlay, overlayFadeOut]);

  // Music toggle function
  const toggleMusic = () => {
    if (!currentAudioRef.current) return;

    console.log("🎵 TOGGLE MUSIC:", { isPlaying });

    if (isPlaying) {
      console.log("🎵 Fading out music...");
      setIsPlaying(false);
      fadeOut(currentAudioRef.current, 1500).then(() => {
        console.log("🎵 Music paused by user");
      });
    } else {
      currentAudioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          console.log("🎵 Music resumed by user, fading in...");
          fadeIn(currentAudioRef.current, 0.3, 2000);
        })
        .catch((error) => {
          console.error("🎵 Error resuming music:", error);
        });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🎵 GameScoring unmounting, cleaning up music...");

      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      // Stop all audio
      if (audio1Ref.current) {
        audio1Ref.current.pause();
        audio1Ref.current.currentTime = 0;
      }
      if (audio2Ref.current) {
        audio2Ref.current.pause();
        audio2Ref.current.currentTime = 0;
      }
    };
  }, []);

  // Firebase listener for room data
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🏆 GameScoring - Room data received:", data);

      if (data) {
        setRoomData(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Listen to notifications
  useEffect(() => {
    if (!roomCode) return;

    const notifRef = ref(db, `rooms/${roomCode}/notifications`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotifications(Object.values(data));
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Redirect to landing if room doesn't exist or wrong game state
  useEffect(() => {
    if (!loading && (!roomData || roomData.gameState !== "gameEnd")) {
      console.log("🏆 GameScoring - Invalid state, redirecting to landing");
      navigate("/");
    }
  }, [roomData, loading, navigate]);

  const returnToLanding = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      console.log("🏰 Host ending game session and returning to landing");

      // Update game state to redirect all players
      const updates = {
        gameState: "returnToLanding",
        redirectMessage:
          "🏰 The royal tournament has concluded! Returning to the royal court...",
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      // Navigate host to create page
      setTimeout(() => {
        navigate("/create");
      }, 1500);
    } catch (error) {
      console.error("❌ Error returning to landing:", error);
    }
  };

  const getSortedPlayers = () => {
    if (!roomData?.players) return [];

    return Object.entries(roomData.players)
      .sort(([, a], [, b]) => (b.tokens || 0) - (a.tokens || 0))
      .map(([name, player]) => ({ name, ...player }));
  };

  const formatPlayerName = (player) => {
    const primaryName = player.name; // nickname
    const secondaryName = player.realName; // real name

    if (primaryName && secondaryName && primaryName !== secondaryName) {
      return { primary: primaryName, secondary: secondaryName };
    }

    return { primary: primaryName || secondaryName, secondary: null };
  };

  const getFinalWinner = () => {
    const sortedPlayers = getSortedPlayers();
    if (sortedPlayers.length === 0) return null;

    const topPlayer = sortedPlayers[0];
    const maxTokens = topPlayer.tokens || 0;

    // Check for ties
    const winners = sortedPlayers.filter(
      (player) => (player.tokens || 0) === maxTokens
    );

    return {
      istie: winners.length > 1,
      winners: winners,
      maxTokens: maxTokens,
    };
  };

  const getMostTargetedPlayers = () => {
    const targetedPlayers = roomData?.gameStats?.targetedPlayers;
    if (!targetedPlayers) return [];

    // Convert to array and sort by targetCount (descending)
    return Object.entries(targetedPlayers)
      .map(([name, data]) => ({
        name,
        realName: data.realName,
        targetCount: data.targetCount,
      }))
      .sort((a, b) => b.targetCount - a.targetCount)
      .slice(0, 3); // Get top 3
  };

  // Listen for redirect signals
  useEffect(() => {
    if (roomData?.gameState === "returnToLanding") {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [roomData?.gameState, navigate]);

  if (loading) {
    return (
      <div className="game-scoring-loading">
        <div className="loading-spinner">
          ⏳ Preparing the royal coronation ceremony...
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="game-scoring-loading">
        <div className="loading-spinner">
          ❌ The royal court has vanished into the mists...
        </div>
      </div>
    );
  }

  const finalResult = getFinalWinner();
  const isHost = roomData.host === nickname;
  const sortedPlayers = getSortedPlayers();
  const totalRounds = roomData.gameStats?.totalRoundsPlayed || 0;
  const mostTargetedPlayers = getMostTargetedPlayers();

  if (roomData.gameState === "returnToLanding") {
    return (
      <div className="game-scoring-container redirect-message">
        <div className="redirect-content">
          <h1>🏰 Royal Tournament Concluded</h1>
          <p>{roomData.redirectMessage}</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className={`game-scoring-container ${pageVisible ? "fade-in" : ""}`}>
        {/* Audio elements for both tracks */}
        <audio ref={audio1Ref} src={weddingMusic1} preload="auto" />
        <audio ref={audio2Ref} src={weddingMusic2} preload="auto" />

        {/* Royal Coronation Overlay */}
        {showOverlay && (
          <div
            className={`coronation-overlay ${overlayFadeOut ? "fade-out" : ""}`}
            onClick={handleOverlayClick}
          >
            <div className="coronation-content">
              <h1 className="coronation-title">🏰 ROYAL CORONATION 🏰</h1>
              <p className="coronation-question">
                "Who has won the Princess' heart?"
              </p>
              <p className="coronation-reveal-hint">
                ✨ Click to Reveal ✨
                <br />
                <span className="coronation-key-hint">(or press any key)</span>
              </p>
            </div>
          </div>
        )}

        {/* Music toggle button */}
        {!showOverlay && (
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
        )}

        <div className="game-scoring-main">
          <div className="game-scoring-content-layout">
            <h1 className="royal-title">🏰 ROYAL TOURNAMENT FINALE 🏰</h1>
            <div className="game-scoring-columns-container">
              <div className="game-scoring-main-column">
                {/* Winner Announcement */}
                {finalResult && (
                  <div className="winner-announcement">
                    {finalResult.istie ? (
                      <>
                        <div className="winner-text">
                          Multiple suitors have won the Princess's heart with{" "}
                          <span className="token-count">
                            {finalResult.maxTokens}
                          </span>{" "}
                          love tokens each:
                        </div>
                        <div className="winners-list">
                          {finalResult.winners.map((winner, index) => {
                            const nameFormat = formatPlayerName(winner);
                            return (
                              <div key={winner.name} className="winner-name">
                                🎭 {nameFormat.primary}
                                {nameFormat.secondary && (
                                  <span className="winner-real-name">
                                    {" "}
                                    ({nameFormat.secondary})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="epic-phrase">
                          "In matters of the heart, even the wisest Princess
                          cannot choose between such worthy suitors! A royal
                          wedding feast shall honor them all!"
                        </div>
                      </>
                    ) : (
                      <>
                        {(() => {
                          const champion = finalResult.winners[0];
                          const nameFormat = formatPlayerName(champion);
                          return (
                            <>
                              <div className="winner-text">
                                The Princess's heart belongs to:{" "}
                                <span className="champion-name">
                                  {nameFormat.primary}
                                </span>
                                {nameFormat.secondary && (
                                  <span className="champion-real-name">
                                    {" "}
                                    ({nameFormat.secondary})
                                  </span>
                                )}
                              </div>
                              <div className="token-display">
                                With{" "}
                                <span className="token-count">
                                  {finalResult.maxTokens}
                                </span>{" "}
                                precious love tokens!
                              </div>
                              <div className="epic-phrase">
                                "Through wit, charm, and noble deeds, our
                                champion has proven worthy of the Princess's
                                hand. Let the royal wedding bells ring
                                throughout the kingdom!"
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {/* Final Leaderboard */}
                <div className="final-leaderboard">
                  <h3 className="game-scoring-leaderboard-title">
                    🏆 Final Court Rankings 🏆
                  </h3>
                  <div className="game-scoring-leaderboard-list">
                    {sortedPlayers.map((player, index) => {
                      const nameFormat = formatPlayerName(player);
                      const isCurrentUser = player.name === nickname;
                      const isWinner =
                        finalResult &&
                        finalResult.winners.some((w) => w.name === player.name);

                      return (
                        <div
                          key={player.name}
                          className={`final-player-row ${
                            index === 0 ? "champion" : "noble"
                          } ${isWinner ? "winner" : ""}`}
                        >
                          <div className="player-rank-section">
                            <span className="player-rank">
                              {index === 0
                                ? "👑"
                                : index === 1
                                ? "🥈"
                                : index === 2
                                ? "🥉"
                                : `${index + 1}.`}
                            </span>
                            <div className="player-names">
                              <div className="player-nickname">
                                {nameFormat.primary}
                                {isCurrentUser && (
                                  <span className="player-you-indicator">
                                    (You)
                                  </span>
                                )}
                              </div>
                              {nameFormat.secondary && (
                                <div className="player-realname">
                                  {nameFormat.secondary}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="player-score">
                            <span className="final-tokens">
                              {player.tokens || 0} love token
                              {(player.tokens || 0) !== 1 ? "s" : ""}
                            </span>
                            {isWinner && (
                              <span className="winner-badge">👑 Champion</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Host Actions */}
                {isHost && (
                  <div className="host-final-actions">
                    <button
                      onClick={returnToLanding}
                      className="return-to-court-button"
                    >
                      🏰 Return to Royal Court
                    </button>
                  </div>
                )}

                {/* Non-host message */}
                {!isHost && (
                  <div className="awaiting-host-message">
                    🕰️ Awaiting the host's command to return to the royal
                    court...
                  </div>
                )}
              </div>

              <div className="game-scoring-side-column">
                {/* Princess Wedding Image */}
                <div className="princess-wedding">
                  <div className="wedding-frame">
                    <div className="princess-image"></div>
                    <div className="wedding-caption">
                      💐 The Princess awaits her champion 💐
                    </div>
                  </div>

                  {/* Tournament Chronicle - Moved from main column */}
                  <div className="tournament-summary">
                    <h3 className="summary-title">
                      ⚔️ Tournament Chronicle ⚔️
                    </h3>
                    <div className="summary-stats">
                      <div className="summary-stats-first-row">
                        <div className="stat-item">
                          <span className="stat-label">
                            Total Rounds Played:
                          </span>
                          <span className="stat-value">{totalRounds}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">
                            Noble Participants:
                          </span>
                          <span className="stat-value">
                            {sortedPlayers.length}
                          </span>
                        </div>
                      </div>
                      <div className="stat-item stat-item-second-row">
                        <span className="stat-label">Game Mode:</span>
                        <span className="stat-value">
                          {roomData.mode === "premium"
                            ? "👑 Premium Court"
                            : "🏰 Classic Court"}
                        </span>
                      </div>
                      {mostTargetedPlayers.length > 0 && (
                        <div className="stat-item stat-item-targeted-players">
                          <div className="targeted-players-title">
                            🎯 Most Targeted Players 🎯
                          </div>
                          <div className="targeted-players-list">
                            {mostTargetedPlayers.map((player, index) => (
                              <div
                                key={player.name}
                                className="targeted-player-entry"
                              >
                                <span className="target-rank">
                                  #{index + 1}
                                </span>
                                <span className="target-nickname">
                                  {player.name}
                                </span>
                                <span className="target-realname">
                                  ({player.realName})
                                </span>
                                <span className="target-count">
                                  {player.targetCount}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
