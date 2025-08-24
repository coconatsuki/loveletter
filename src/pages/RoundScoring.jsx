import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { cards } from "../utils/cardsData";

export default function RoundScoring() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Listen to room data to get current game state
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      setLoading(false);

      // Trigger fade-in animation
      setTimeout(() => setFadeIn(true), 100);

      // Redirect back to game if someone starts a new round
      if (data?.gameState === "inRound") {
        console.log("🎮 New round started - Redirecting back to game");
        navigate(`/play/${roomCode}`, {
          state: { nickname, realName },
        });
      }
    });

    return () => unsubscribe();
  }, [roomCode, nickname, realName, navigate]);

  const startNewRound = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      // Reset game state for new round
      const updates = {
        gameState: "inRound",
        roundResult: null,
        round: null, // Will be rebuilt when players join the new round
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log("🎮 Starting new round...");
      // Navigation will happen automatically via the listener above
    } catch (error) {
      console.error("❌ Error starting new round:", error);
    }
  };

  const kickPlayer = async (playerNickname) => {
    if (!roomData || roomData.host !== nickname || playerNickname === nickname)
      return;

    const confirmKick = window.confirm(
      `🏰 Royal Decree: Are you sure you want to banish ${playerNickname} from the realm? They will be removed from future rounds.`
    );

    if (!confirmKick) return;

    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, {
        [`players/${playerNickname}`]: null, // Remove player from the game
      });

      console.log(
        `👑 Player ${playerNickname} has been banished from the realm`
      );
    } catch (error) {
      console.error("❌ Error kicking player:", error);
    }
  };

  const endGame = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      const updates = {
        gameState: "gameEnd",
        finalResults: {
          completedRounds: roomData.gameStats?.totalRoundsPlayed || 0,
          finalWinner: getFinalWinner(),
          timestamp: Date.now(),
        },
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log("🏁 Game ended");
      // Could navigate to a final results page here
    } catch (error) {
      console.error("❌ Error ending game:", error);
    }
  };

  const getFinalWinner = () => {
    if (!roomData?.players) return null;

    const players = Object.entries(roomData.players);
    const maxTokens = Math.max(
      ...players.map(([_, player]) => player.tokens || 0)
    );
    const winners = players.filter(
      ([_, player]) => (player.tokens || 0) === maxTokens
    );

    return winners.length === 1 ? winners[0][0] : winners.map(([name]) => name);
  };

  const getSortedPlayers = () => {
    if (!roomData?.players) return [];

    return Object.entries(roomData.players)
      .sort(([, a], [, b]) => (b.tokens || 0) - (a.tokens || 0))
      .map(([name, player]) => ({ name, ...player }));
  };

  const formatPlayerName = (player) => {
    // Prioritize nickname (chosen name) over real name
    const primaryName = player.name; // nickname
    const secondaryName = player.realName; // real name

    if (primaryName && secondaryName && primaryName !== secondaryName) {
      return { primary: primaryName, secondary: secondaryName };
    }

    return { primary: primaryName || secondaryName, secondary: null };
  };

  const getHiddenCard = () => {
    const hiddenCardId = roomData?.roundResult?.hiddenCard?.id;
    if (!hiddenCardId) return null;

    return cards.find((card) => card.id === hiddenCardId);
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "'Cinzel', serif",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #8B0000 0%, #B22222 50%, #DC143C 100%)",
          color: "#FFD700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "2rem",
            borderRadius: "15px",
            border: "2px solid #FFD700",
          }}
        >
          ⏳ Loading the royal chronicles...
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "'Cinzel', serif",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #8B0000 0%, #B22222 50%, #DC143C 100%)",
          color: "#FFD700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "2rem",
            borderRadius: "15px",
            border: "2px solid #FFD700",
          }}
        >
          ❌ The royal court has vanished...
        </div>
      </div>
    );
  }

  const roundResult = roomData.roundResult;
  const isHost = roomData.host === nickname;
  const sortedPlayers = getSortedPlayers();
  const hiddenCard = getHiddenCard();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #8B0000 0%, #B22222 50%, #DC143C 100%)",
        fontFamily: "'Cinzel', serif",
        padding: "2rem",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "linear-gradient(145deg, #2C1810 0%, #1A0F08 100%)",
          border: "3px solid #FFD700",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow:
            "0 0 30px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)",
          color: "#F4E4BC",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative corner elements */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            width: "40px",
            height: "40px",
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            width: "40px",
            height: "40px",
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            width: "40px",
            height: "40px",
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            right: "15px",
            width: "40px",
            height: "40px",
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              textAlign: "center",
              color: "#FFD700",
              marginBottom: "2rem",
              fontSize: "3rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              background: "linear-gradient(45deg, #FFD700, #FFA500, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ⚜️ Royal Scoring Chronicles ⚜️
          </h1>

          <div
            style={{
              textAlign: "center",
              color: "#DEB887",
              fontSize: "1.3rem",
              marginBottom: "2.5rem",
              background: "rgba(255, 215, 0, 0.1)",
              padding: "0.8rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            Royal Chamber:{" "}
            <strong style={{ color: "#FFD700" }}>{roomCode}</strong>
          </div>

          {/* Hidden Card Revelation */}
          {hiddenCard && (
            <div
              style={{
                background: "rgba(139, 0, 0, 0.3)",
                border: "2px solid #DC143C",
                borderRadius: "15px",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, #FFD700, #FFA500)",
                  color: "#8B0000",
                  padding: "0.3rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                🤫 COURT SECRET 🤫
              </div>
              <h3
                style={{
                  color: "#FFD700",
                  marginTop: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                🃏 The Hidden Card Revealed 🃏
              </h3>
              <div
                style={{
                  background: "rgba(244, 228, 188, 0.1)",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  borderRadius: "10px",
                  padding: "1rem",
                  display: "inline-block",
                }}
              >
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#FFD700",
                  }}
                >
                  {hiddenCard.name}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#DEB887",
                    marginTop: "0.5rem",
                  }}
                >
                  Strength: {hiddenCard.strength} | <em>{hiddenCard.effect}</em>
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#CD853F",
                  fontStyle: "italic",
                  marginTop: "1rem",
                  marginBottom: "0",
                }}
              >
                This card was secretly discarded at the round's beginning...
              </p>
            </div>
          )}

          {/* Round Winner Display */}
          {roundResult && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%)",
                border: "3px solid #FFD700",
                borderRadius: "15px",
                padding: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
              }}
            >
              <h2
                style={{
                  color: "#FFD700",
                  marginBottom: "1.5rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontSize: "2rem",
                }}
              >
                🎉 Round {roundResult.roundNumber || "?"} Results 🎉
              </h2>
              {roundResult.winners && roundResult.winners.length > 1 ? (
                <p
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#F4E4BC",
                  }}
                >
                  Round {roundResult.roundNumber} Winners:{" "}
                  <span style={{ color: "#FFD700" }}>
                    {roundResult.winnerNames?.join(", ") ||
                      roundResult.winners.join(", ")}
                  </span>
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#F4E4BC",
                  }}
                >
                  Round {roundResult.roundNumber} Winner:{" "}
                  <span style={{ color: "#FFD700" }}>
                    {roundResult.winnerNames?.[0] ||
                      roundResult.winnerName ||
                      roundResult.winner}
                  </span>
                </p>
              )}
              <div
                style={{
                  background: "rgba(139, 0, 0, 0.2)",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  border: "1px solid rgba(220, 20, 60, 0.3)",
                }}
              >
                <strong style={{ color: "#DEB887" }}>Victory Type:</strong>{" "}
                <span style={{ color: "#FFD700" }}>
                  {roundResult.type === "lastPlayerStanding"
                    ? "⚔️ Last Noble Standing"
                    : "🃏 Highest Card (Deck Exhausted)"}
                </span>
              </div>
            </div>
          )}

          {/* Love Tokens Leaderboard */}
          <div
            style={{
              background: "rgba(255, 215, 0, 0.1)",
              border: "2px solid #FFD700",
              borderRadius: "15px",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                color: "#FFD700",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontSize: "1.8rem",
                textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
              }}
            >
              💝 Love Tokens Leaderboard 💝
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              {sortedPlayers.map((player, index) => {
                const nameFormat = formatPlayerName(player);
                const isCurrentUser = player.name === nickname;

                return (
                  <div
                    key={player.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 100%)"
                          : "rgba(244, 228, 188, 0.1)",
                      border:
                        index === 0
                          ? "2px solid #FFD700"
                          : "1px solid rgba(255, 215, 0, 0.3)",
                      borderRadius: "10px",
                      fontWeight: index === 0 ? "bold" : "normal",
                      boxShadow:
                        index === 0
                          ? "0 0 15px rgba(255, 215, 0, 0.3)"
                          : "none",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <span
                        style={{
                          fontSize: "1.2rem",
                          color: index === 0 ? "#FFD700" : "#F4E4BC",
                          marginRight: "1rem",
                        }}
                      >
                        {index === 0 ? "👑" : `${index + 1}.`}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#FFD700",
                          }}
                        >
                          {nameFormat.primary}
                          {isCurrentUser && (
                            <span
                              style={{
                                color: "#DEB887",
                                fontSize: "0.9rem",
                                marginLeft: "0.5rem",
                                fontStyle: "italic",
                              }}
                            >
                              (You)
                            </span>
                          )}
                        </div>
                        {nameFormat.secondary && (
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#CD853F",
                              fontStyle: "italic",
                            }}
                          >
                            {nameFormat.secondary}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span
                        style={{
                          color: "#DC143C",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          background: "rgba(220, 20, 60, 0.1)",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "15px",
                          border: "1px solid rgba(220, 20, 60, 0.3)",
                        }}
                      >
                        {player.tokens || 0} love token
                        {(player.tokens || 0) !== 1 ? "s" : ""}
                      </span>

                      {/* Kick Player Button (Host Only) */}
                      {isHost && player.name !== nickname && (
                        <button
                          onClick={() => kickPlayer(player.name)}
                          style={{
                            background:
                              "linear-gradient(135deg, #8B0000, #B22222)",
                            color: "#FFD700",
                            border: "1px solid #DC143C",
                            borderRadius: "6px",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontWeight: "bold",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background =
                              "linear-gradient(135deg, #B22222, #DC143C)";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background =
                              "linear-gradient(135deg, #8B0000, #B22222)";
                            e.target.style.transform = "scale(1)";
                          }}
                          title={`Banish ${player.name} from the realm`}
                        >
                          ⚔️ Banish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Host Actions */}
          {isHost && (
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={startNewRound}
                style={{
                  background: "linear-gradient(135deg, #228B22, #32CD32)",
                  color: "white",
                  border: "2px solid #FFD700",
                  borderRadius: "12px",
                  padding: "1.2rem 2.5rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  boxShadow: "0 4px 15px rgba(34, 139, 34, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #32CD32, #7FFF00)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(34, 139, 34, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #228B22, #32CD32)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(34, 139, 34, 0.3)";
                }}
              >
                🎮 Commence New Round
              </button>
              <button
                onClick={endGame}
                style={{
                  background: "linear-gradient(135deg, #8B0000, #DC143C)",
                  color: "#FFD700",
                  border: "2px solid #FFD700",
                  borderRadius: "12px",
                  padding: "1.2rem 2.5rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  boxShadow: "0 4px 15px rgba(139, 0, 0, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #DC143C, #FF6347)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(139, 0, 0, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #8B0000, #DC143C)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(139, 0, 0, 0.3)";
                }}
              >
                🏁 End Royal Tournament
              </button>
            </div>
          )}

          {/* Non-host message */}
          {!isHost && (
            <div
              style={{
                textAlign: "center",
                color: "#DEB887",
                fontSize: "1.1rem",
                fontStyle: "italic",
                background: "rgba(222, 184, 135, 0.1)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(222, 184, 135, 0.3)",
              }}
            >
              🕰️ Awaiting the host's royal decree to begin the next round or
              conclude the tournament...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
