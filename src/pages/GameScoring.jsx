import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import "./GameScoring.css";

export default function GameScoring() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Epic entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 300);
    return () => clearTimeout(timer);
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
    <div className={`game-scoring-container ${fadeIn ? "fade-in" : ""}`}>
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
                              "Through wit, charm, and noble deeds, our champion
                              has proven worthy of the Princess's hand. Let the
                              royal wedding bells ring throughout the kingdom!"
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
                  🕰️ Awaiting the host's command to return to the royal court...
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
                  <h3 className="summary-title">⚔️ Tournament Chronicle ⚔️</h3>
                  <div className="summary-stats">
                    <div className="summary-stats-first-row">
                      <div className="stat-item">
                        <span className="stat-label">Total Rounds Played:</span>
                        <span className="stat-value">{totalRounds}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Noble Participants:</span>
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
