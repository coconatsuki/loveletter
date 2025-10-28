import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update, set, get } from "firebase/database";
import TargetModal from "../components/TargetModal";
import InquisitorTargetModal from "../components/InquisitorTargetModal";
import RoyalConfessorTargetModal from "../components/RoyalConfessorTargetModal";
import BaronessTargetModal from "../components/BaronessTargetModal";
import RoyalConfessorResultModal from "../components/RoyalConfessorResultModal";
import EffectResultModal from "../components/EffectResultModal";
import AssassinPromptModal from "../components/AssassinPromptModal";
import BaronResultModal from "../components/BaronResultModal";
import RegentQueenResultModal from "../components/RegentQueenResultModal";
import RoundEndModal from "../components/RoundEndModal";
import DiscardPilePopover from "../components/DiscardPilePopover";
import DiscardHistoryModal from "../components/DiscardHistoryModal";
import CardCountStars from "../components/CardCountStars";
import CardEffectPopover from "../components/CardEffectPopover";
import "../components/CardEffectPopover.css";
import {
  applyJesterEffect,
  applyChamberlainEffect,
  applyGuardEffect,
  applyGuard2Effect,
  applyPriestEffect,
  applyBaronEffect,
  applyRegentQueenEffect,
  applyHandmaidEffect,
  applyPrinceEffect,
  applyPhantomKingEffect,
  applyCountessEffect,
  applyAssassinEffect,
  applyPrincessEffect,
  applyInquisitorEffect,
  applyCourtWhispererEffect,
  applyRoyalConfessorEffect,
  applyBaronessEffect,
  applyDukeEffect,
} from "../utils/cardEffects";
import { pushNotification } from "../utils/pushNotification";
import {
  checkRoundEndConditions,
  triggerRoundEnd,
  triggerRoundEndIfNeeded,
} from "../utils/roundEndDetection";
import { cards, getCardImage } from "../utils/cardsData";
import {
  getCardCount,
  handleCardDiscard,
  handlePlayerElimination,
} from "../utils/gamehelpers";
import { shouldShowPopoverOnLeft } from "../utils/popoverPositioning";
import "./Play.css";

const cardNames = {
  0: "Jester",
  1: "Guard",
  2: "Priest",
  3: "Baron",
  4: "Handmaid",
  5: "Prince",
  6: "Phantom King",
  7: "Countess",
  8: "Princess",
  9: "Inquisitor",
  10: "Chamberlain",
  11: "Regent Queen",
  12: "Court Whisperer",
  13: "Royal Confessor",
  14: "Assassin",
  15: "Baroness",
  16: "Duke",
};

export default function Play() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;

  const [roomData, setRoomData] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCardForUI, setSelectedCardForUI] = useState(null); // For UI positioning only
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [resultModalData, setResultModalData] = useState(null);
  const [guardTargetPromptData, setGuardTargetPromptData] = useState(null);
  const [showGuardTargetPrompt, setShowGuardTargetPrompt] = useState(false);
  const [inquisitorResultModalData, setInquisitorResultModalData] =
    useState(null);
  const [royalConfessorResultModalData, setRoyalConfessorResultModalData] =
    useState(null);

  const [baronResultModalData, setBaronResultModalData] = useState(null);
  const [baronTargetModalData, setBaronTargetModalData] = useState(null);
  const [regentQueenResultModalData, setRegentQueenResultModalData] =
    useState(null);
  const [regentQueenTargetModalData, setRegentQueenTargetModalData] =
    useState(null);
  const [targetMessageModalData, setTargetMessageModalData] = useState(null);
  const [target2MessageModalData, setTarget2MessageModalData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [roundEndModalData, setRoundEndModalData] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [showDiscardHistory, setShowDiscardHistory] = useState(false); // For discard pile popover
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null); // For card effect popover
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false); // Track if user manually scrolled up
  const [newNotificationsCount, setNewNotificationsCount] = useState(0); // Count of unread notifications
  const chronicleContentRef = useRef(null); // Ref for the chronicle content div

  // Total players count for popover positioning
  const totalPlayers = roomData?.players
    ? Object.keys(roomData.players).length
    : 0; // Prevents flash during modal transitions

  // Helper function to check if any modal is currently active
  const hasActiveModal = () => {
    return !!(
      resultModalData ||
      inquisitorResultModalData ||
      royalConfessorResultModalData ||
      baronResultModalData ||
      baronTargetModalData ||
      regentQueenResultModalData ||
      regentQueenTargetModalData ||
      targetMessageModalData ||
      target2MessageModalData ||
      showGuardTargetPrompt ||
      roundEndModalData ||
      isModalTransitioning
    );
  };

  // Helper function to handle smooth modal transitions
  const handleModalTransition = async (closeCallback) => {
    setIsModalTransitioning(true);
    await closeCallback();
    setIsModalTransitioning(false);
  };

  /**
   * FIREBASE LISTENERS - Real-time data synchronization
   * These effects set up Firebase listeners to keep the game state in sync
   */

  // Listen to room data changes (players, game state) and update player data
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    // Debounce Firebase updates to prevent race conditions during rapid updates
    let debounceTimer = null;

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      // Clear existing debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Debounce the state update to handle rapid Firebase changes
      debounceTimer = setTimeout(() => {
        // DIAGNOSTIC: Track when currentPlayer changes
        const oldCurrentPlayer = roomData?.round?.currentPlayer;
        const newCurrentPlayer = data?.round?.currentPlayer;
        const isFinalTurn = data?.round?.isFinalTurn;

        // Only log if we have valid data and meaningful change
        if (
          oldCurrentPlayer !== newCurrentPlayer &&
          oldCurrentPlayer &&
          newCurrentPlayer
        ) {
          console.log("🔄 CURRENT PLAYER CHANGED:", {
            oldCurrentPlayer,
            newCurrentPlayer,
            isMyTurn: newCurrentPlayer === nickname,
            currentIsPlaying: isPlaying,
            isFinalTurn: isFinalTurn,
          });

          // Reset isPlaying when it becomes this player's turn AND we're currently playing
          // This prevents the race condition where intermediate states cause wrong resets
          if (newCurrentPlayer === nickname && isPlaying) {
            console.log(
              "🔄 TURN START: Resetting isPlaying = false for new turn"
            );
            setIsPlaying(false);
          }

          // CRITICAL: Reset isPlaying when it's no longer this player's turn
          // This prevents the flash of Game Actions Section during turn transitions
          if (newCurrentPlayer !== nickname && isPlaying) {
            console.log(
              "🔄 TURN END: Resetting isPlaying = false - no longer my turn"
            );
            setIsPlaying(false);
          }
        }

        // Log when final turn flag is detected
        if (isFinalTurn && !roomData?.round?.isFinalTurn) {
          console.log(
            "🏆 FINAL TURN FLAG DETECTED: This is the last turn of the round!"
          );
        }

        setRoomData(data);

        if (data?.players && nickname) {
          setPlayer(data.players[nickname]);
        }

        // Check if round ended and show round end modal
        if (data?.gameState === "roundScoring" && data?.roundResult) {
          console.log(
            "🏆 ROUND ENDED - Showing round end modal",
            data.roundResult
          );

          // Show the round end modal with the round result data
          setRoundEndModalData(data.roundResult);
          return; // Exit early to prevent further processing
        }

        // Redirect to Game Scoring if host ends the game
        if (data?.gameState === "gameEnd") {
          console.log("🏆 Game ended - Redirecting to Game Scoring");
          navigate(`/game_scoring/${roomCode}`, {
            state: { nickname, realName },
          });
          return; // Exit early to prevent further processing
        }

        // Auto-clear info-only result modals when it's no longer this player's turn
        // This ensures attacker modals don't stay on screen forever
        if (
          data?.round?.currentPlayer !== nickname &&
          resultModalData?.isInfoOnly
        ) {
          setResultModalData(null);
        }
      }, 100); // 100ms debounce
    });

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      unsubscribe();
    };
  }, [roomCode, nickname, resultModalData, targetMessageModalData]);

  // Listen for Guard prompts that should be displayed to a guard's TARGET player
  useEffect(() => {
    const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
    const unsubscribe = onValue(promptRef, (snapshot) => {
      const data = snapshot.val();

      if (data && data.target === nickname) {
        console.log(`🔍 SETTING GUARD TARGET PROMPT DATA:`, data);
        setGuardTargetPromptData(data);
        setShowGuardTargetPrompt(true);
      } else if (!data) {
        // Hide the modal when guardPrompt is cleared from Firebase
        console.log(`🔍 CLEARING GUARD TARGET PROMPT DATA`);
        setGuardTargetPromptData(null);
        setShowGuardTargetPrompt(false);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen for Guard prompts that should be sent BACK to the attacker / current player
  useEffect(() => {
    console.log("guard2Prompt useEffect called!");

    const refResult = ref(db, `rooms/${roomCode}/guard2Prompt`);
    const unsubscribe = onValue(refResult, (snapshot) => {
      const data = snapshot.val();

      if (data && data.attacker === nickname && data.resultText) {
        setResultModalData({
          selectedCardId: 1, // Guard
          resultText: data.resultText,
          guardOutcome: data.guardOutcome,
        });
      } else if (!data) {
        // Clear the modal when actionResult is cleared from Firebase
        setResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen for Inquisitor results targeting this player
  useEffect(() => {
    const inquisitorRef = ref(db, `rooms/${roomCode}/inquisitorResult`);
    const unsubscribe = onValue(inquisitorRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.originalTarget === nickname) {
        console.log(
          "🕵️ INQUISITOR RESULT received for target:",
          nickname,
          data
        );
        setInquisitorResultModalData(data);
      } else if (!data) {
        setInquisitorResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to notifications feed for real-time game updates
  useEffect(() => {
    const notifRef = ref(db, `rooms/${roomCode}/notifications`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setNotifications(messages);
      }
    });
    return () => unsubscribe();
  }, [roomCode]);

  // Smart auto-scroll for chronicle: scroll to bottom on new notifications (unless user scrolled up)
  useEffect(() => {
    const chronicleDiv = chronicleContentRef.current;
    if (!chronicleDiv) return;

    // Check if user is at/near the bottom (within 50px threshold)
    const isNearBottom =
      chronicleDiv.scrollHeight -
        chronicleDiv.scrollTop -
        chronicleDiv.clientHeight <
      50;

    if (!isUserScrolledUp || isNearBottom) {
      // Auto-scroll to bottom
      chronicleDiv.scrollTop = chronicleDiv.scrollHeight;
      setNewNotificationsCount(0); // Reset unread count when auto-scrolling
    } else {
      // User is scrolled up, increment unread notifications count
      setNewNotificationsCount((prev) => prev + 1);
    }
  }, [notifications, isUserScrolledUp]);

  // Detect when user manually scrolls the chronicle
  const handleChronicleScroll = () => {
    const chronicleDiv = chronicleContentRef.current;
    if (!chronicleDiv) return;

    // Check if user is at/near the bottom (within 50px threshold)
    const isNearBottom =
      chronicleDiv.scrollHeight -
        chronicleDiv.scrollTop -
        chronicleDiv.clientHeight <
      50;

    if (isNearBottom) {
      // User scrolled back to bottom
      setIsUserScrolledUp(false);
      setNewNotificationsCount(0);
    } else {
      // User is scrolled up
      setIsUserScrolledUp(true);
    }
  };

  // Function to scroll to bottom and reset state
  const scrollToBottomAndReset = () => {
    const chronicleDiv = chronicleContentRef.current;
    if (chronicleDiv) {
      chronicleDiv.scrollTop = chronicleDiv.scrollHeight;
      setIsUserScrolledUp(false);
      setNewNotificationsCount(0);
    }
  };

  // Listen to baron target modal data
  useEffect(() => {
    const refBaronTarget = ref(db, `rooms/${roomCode}/baronTarget`);
    const unsubscribe = onValue(refBaronTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show Baron target modal to the target player
        setBaronTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setBaronTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to regent queen target modal data
  useEffect(() => {
    const refRegentQueenTarget = ref(db, `rooms/${roomCode}/regentQueenTarget`);
    const unsubscribe = onValue(refRegentQueenTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show Regent Queen target modal to the target player
        setRegentQueenTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setRegentQueenTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to general target message modal data (for Prince, etc.)
  useEffect(() => {
    const refTargetMessage = ref(db, `rooms/${roomCode}/targetMessage`);
    const unsubscribe = onValue(refTargetMessage, (snapshot) => {
      const data = snapshot.val();

      console.log("🎯 TARGET MESSAGE LISTENER: Received data:", {
        data,
        nickname,
        isVisibleToMe: data?.visibleTo === nickname,
      });

      if (data && data.visibleTo === nickname) {
        // Show target message modal to the target player
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Setting target message modal data:",
          data
        );
        setTargetMessageModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Clearing target message modal data"
        );
        setTargetMessageModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to target2 message modal data (for Royal Confessor external targeting)
  useEffect(() => {
    const refTarget2Message = ref(db, `rooms/${roomCode}/target2Message`);
    const unsubscribe = onValue(refTarget2Message, (snapshot) => {
      const data = snapshot.val();

      console.log("🎭 TARGET2 MESSAGE LISTENER: Received data:", {
        data,
        nickname,
        isVisibleToMe: data?.visibleTo === nickname,
      });

      if (data && data.visibleTo === nickname) {
        // Show target2 message modal to the target player
        console.log(
          "🎭 TARGET2 MESSAGE LISTENER: Setting target2 message modal data:",
          data
        );
        setTarget2MessageModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        console.log(
          "🎭 TARGET2 MESSAGE LISTENER: Clearing target2 message modal data"
        );
        setTarget2MessageModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  const { round, players } = roomData || {};
  const currentPlayer = round?.currentPlayer;
  const isMyTurn = nickname === currentPlayer;

  const drawCard = () => {
    // Prevent drawing card if round has ended
    if (roomData?.gameState === "roundScoring") {
      console.log("🛑 DRAW CARD blocked - Round has ended");
      return;
    }

    console.log(
      "🃏 DRAW CARD button clicked / NOT my Turn? => ",
      !isMyTurn,
      " / playerHandLength: ",
      player.hand?.length,
      " / isPlaying? ",
      isPlaying,
      " / should NOT draw? => ",
      !isMyTurn || player.hand?.length !== 1 || isPlaying
    );

    // DIAGNOSTIC: Log detailed state to debug why isPlaying might be stuck
    console.log("🔍 DIAGNOSTIC - isPlaying state analysis:", {
      isPlaying,
      isMyTurn,
      currentPlayer: currentPlayer,
      nickname: nickname,
      playerHandLength: player?.hand?.length,
      selectedCardIndex,
      showTargetModal,
      resultModalData: !!resultModalData,
      baronResultModalData: !!baronResultModalData,
      targetMessageModalData: !!targetMessageModalData,
      inquisitorResultModalData: !!inquisitorResultModalData,
      royalConfessorResultModalData: !!royalConfessorResultModalData,
    });

    if (!isMyTurn || player.hand?.length !== 1 || isPlaying) return;

    // Check if deck is empty before trying to draw
    if (!round.deck || round.deck.length === 0) {
      console.log("❌ Cannot draw card: deck is empty");
      // Also check if this is already flagged as final turn
      if (round.isFinalTurn) {
        console.log(
          "🏆 DrawCard () - FINAL TURN: Deck is empty and this is flagged as the final turn"
        );
      }
      // Don't trigger round end check here - wait for turn completion
      return;
    }

    const nextCard = round.deck[0];
    const newDeck = round.deck.slice(1);
    const newHand = [...player.hand, nextCard];
    const roomRef = ref(db, `rooms/${roomCode}`);

    // 🗣️ COURT WHISPERER: Handle nextTarget lifecycle
    let updatedRound = { ...round, deck: newDeck };
    if (round.nextTarget) {
      console.log(
        "🗣️ COURT WHISPERER: Processing nextTarget lifecycle:",
        round.nextTarget
      );

      if (round.nextTarget.used === false) {
        // Mark as used (this is the turn right after Court Whisperer was played)
        console.log("🗣️ COURT WHISPERER: Marking nextTarget as used");
        updatedRound.nextTarget = { ...round.nextTarget, used: true };
      } else if (round.nextTarget.used === true) {
        // Clear nextTarget (this is the turn after the forced targeting turn)
        console.log("🗣️ COURT WHISPERER: Clearing nextTarget");
        updatedRound.nextTarget = null;
      }
    }

    // Check if deck is now empty (round end condition)
    if (newDeck.length === 0) {
      console.log(
        "🏆 drawCard() - DECK EMPTY: Last card drawn, flagging this as the final turn in Firebase"
      );
      // Flag in Firebase that this is the final turn - all players will see this
      updatedRound.isFinalTurn = true;
      update(roomRef, {
        round: updatedRound,
        [`players/${nickname}/hand`]: newHand,
      });
    } else {
      // Normal deck update
      update(roomRef, {
        round: updatedRound,
        [`players/${nickname}/hand`]: newHand,
      });
    }
  };

  // 🎭 Countess Force-Play Detection
  const getCountessForcePlay = (hand) => {
    if (!hand || hand.length !== 2) return { forced: false };

    const hasCountess = hand.some((card) => card.id === 7);
    const hasPrince = hand.some((card) => card.id === 5);
    const hasPhantomKing = hand.some((card) => card.id === 6);

    if (hasCountess && hasPrince) {
      return {
        forced: true,
        countessIndex: hand.findIndex((card) => card.id === 7),
        blockedCard: "Prince",
        reason:
          "She cannot bear the company of such a pompous fool —you're forced to let her go.",
      };
    }

    if (hasCountess && hasPhantomKing) {
      return {
        forced: true,
        countessIndex: hand.findIndex((card) => card.id === 7),
        blockedCard: "Phantom King",
        reason:
          "She refuses to breathe the same air as such a notorious drunkard —you're forced to let her go.",
      };
    }

    return { forced: false };
  };

  const handleCardBack = () => {
    // Reset UI selection states when going back
    setSelectedCardForUI(null);
    setSelectedCardIndex(null);
    setShowTargetModal(false);
  };

  const playCard = (index) => {
    // Prevent playing card if round has ended
    if (roomData?.gameState === "roundScoring") {
      console.log("🛑 PLAY CARD blocked - Round has ended");
      return;
    }

    const card = player.hand[index];

    // First, always set the UI state to show which card was selected
    setSelectedCardForUI(index);

    if ([0, 1, 2, 3, 5, 6, 9, 11, 12, 13, 15].includes(card.id)) {
      // Cards that need target selection (Jester, Guard, Priest, Baron, Phantom King, Inquisitor, Regent Queen, Court Whisperer, Baroness)
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    } else if (card.id === 4) {
      // HANDMAID CARD - No target needed, apply effect immediately
      playHandmaid(index);
    } else if (card.id === 7) {
      // COUNTESS CARD - No target needed, royal presence effect immediately
      playCountess(index);
    } else if (card.id === 8) {
      // PRINCESS CARD - No target needed, immediate elimination!
      playPrincess(index);
    } else if (card.id === 10) {
      // CHAMBERLAIN CARD - No target needed, secure royal influence immediately
      playChamberlain(index);
    } else if (card.id === 16) {
      // DUKE CARD - No target needed, noble favor effect immediately
      playDuke(index);
    } else if (card.id === 14) {
      // ASSASSIN CARD - No target needed, shadow moves through the court
      playAssassin(index);
    }
  };

  const playHandmaid = async (index) => {
    setSelectedCardIndex(index);
    console.log("🛡️ HANDMAID: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Handmaid protection
    const result = await applyHandmaidEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification
    pushNotification(roomCode, result.publicMessage);

    // Show protection confirmation modal to the player
    setResultModalData({
      selectedCardId: 4, // Handmaid
      resultText: result.playerMessage,
      isHandmaidProtection: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playDuke = async (index) => {
    setSelectedCardIndex(index);
    console.log("👑🐕 DUKE: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Duke noble favor effect
    const result = await applyDukeEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification
    pushNotification(roomCode, result.publicMessage);

    // Show duke favor confirmation modal to the player
    setResultModalData({
      selectedCardId: 16, // Duke
      resultText: result.attackerMessage,
      hasDukeFavor: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playCountess = async (index) => {
    setSelectedCardIndex(index);
    console.log("🎭 COUNTESS: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Countess effect (royal presence)
    const result = await applyCountessEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the royal appearance
    pushNotification(roomCode, result.publicMessage);

    // Show royal confirmation modal to the player
    setResultModalData({
      selectedCardId: 7, // Countess
      resultText: result.playerMessage,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playChamberlain = async (index) => {
    setSelectedCardIndex(index);
    console.log("🏰 CHAMBERLAIN: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Chamberlain effect (secure royal influence)
    const result = await applyChamberlainEffect({
      roomCode,
      attacker: nickname,
    });

    // Send public notification about the powerful alliance
    pushNotification(roomCode, result.publicMessage);

    // Show rich influence modal to the player
    setResultModalData({
      selectedCardId: 10, // Chamberlain
      resultText: result.attackerMessage,
      isChamberlainInfluence: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playPrincess = async (index) => {
    setSelectedCardIndex(index);
    console.log("👑 PRINCESS: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Princess effect (immediate elimination!)
    const result = await applyPrincessEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the royal catastrophe
    pushNotification(roomCode, result.publicMessage);

    // Show tragic elimination modal to the player
    setResultModalData({
      selectedCardId: 8, // Princess
      resultText: result.playerMessage,
      isPrincessElimination: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playAssassin = async (index) => {
    setSelectedCardIndex(index);
    console.log("🗡️ ASSASSIN: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Assassin effect (mysterious shadow moves)
    const result = await applyAssassinEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the shadow in the court
    pushNotification(roomCode, result.publicMessage);

    // Show mysterious shadow modal to the player
    setResultModalData({
      selectedCardId: 14, // Assassin
      resultText: result.playerMessage,
      isAssassinShadow: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const handleTargetConfirm = async ({ target, target2, guess }) => {
    const cardPlayed = player.hand[selectedCardIndex];
    const isDeckEmpty =
      !roomData?.round?.deck || roomData?.round?.deck.length === 0;

    setShowTargetModal(false);
    console.log(
      "🎯 TARGET CONFIRM: Setting isPlaying = true for card:",
      cardPlayed?.name || cardPlayed?.id
    );
    setIsPlaying(true);

    // === SKIP TURN CASE (All players protected by Handmaid) ===
    if (target === "SKIP_TURN") {
      // Show a result modal explaining the skip
      setResultModalData({
        selectedCardId: cardPlayed.id,
        resultText: `Your chose to skip your turn. Your card will have no effect.`,
      });

      // Note: Turn will be completed when player closes the result modal
      return;
    }

    // === JESTER CARD LOGIC (ID: 0) ===
    if (cardPlayed.id === 0) {
      const result = await applyJesterEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      // Show the target message to the target
      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        selectedCardId: cardPlayed.id,
        visibleTo: target,
        attacker: nickname,
        message: result.targetMessage,
        timestamp: Date.now(),
      });

      setResultModalData({
        selectedCardId: cardPlayed.id,
        resultText: result.attackerMessage,
      });
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === CHAMBERLAIN CARD LOGIC (ID: 10) ===
    if (cardPlayed.id === 10) {
      const result = await applyChamberlainEffect({
        roomCode,
        attacker: nickname,
      });

      setResultModalData({
        selectedCardId: cardPlayed.id,
        resultText: result.attackerMessage,
      });
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === GUARD CARD LOGIC (ID: 1) ===
    if (cardPlayed.id === 1) {
      // Apply the Guard effect to determine the outcome
      const result = await applyGuardEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      // Notify all players about the Guard action
      pushNotification(
        roomCode,
        `🕵️‍♂️ ${nickname} summoned a Guard and accused ${target} of conspiring with someone of influence ${guess}!`
      );

      // ALWAYS show AssassinPromptModal to target (good UX for both modes)
      // In premium mode: target can choose to use Assassin or not
      // In normal mode: target just acknowledges the attack
      const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
      await update(promptRef, {
        ...result,
        timestamp: Date.now(),
        // Store card play info so we can complete the turn later
        cardPlayInfo: {
          playedCardIndex: selectedCardIndex,
          playerNickname: nickname,
        },
      });
      // Exit early - AssassinPromptModal will handle the rest for both modes
      return;
    }

    // === PRIEST CARD LOGIC (ID: 2) ===
    else if (cardPlayed.id === 2) {
      const priestResult = await applyPriestEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (priestResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${priestResult.message}`,
        });
        return;
      }

      // Send notifications with medieval fun! 🏰
      pushNotification(roomCode, priestResult.publicMessage);

      // Show the target message to the target
      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        selectedCardId: cardPlayed.id,
        visibleTo: target,
        attacker: nickname,
        message: priestResult.targetMessage,
        timestamp: Date.now(),
      });

      // Show the result to the attacker with card details
      setResultModalData({
        selectedCardId: 2, // Priest
        resultText: priestResult.attackerMessage,
        cardDetails: {
          "Target Player": target,
          "Revealed Card": { ...priestResult.targetCard },
        },
      });

      // Priest effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === BARON CARD LOGIC (ID: 3) ===
    else if (cardPlayed.id === 3) {
      const baronResult = await applyBaronEffect({
        roomCode,
        attacker: nickname,
        target,
        playedCardIndex: selectedCardIndex,
        updatePlayedCardIndex: (index) => {
          setSelectedCardIndex(index);
        },
      });

      if (baronResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${baronResult.message}`,
        });
        return;
      }

      // Send the public notification (reveals eliminated player's card only)
      pushNotification(roomCode, baronResult.publicMessage);

      // Show Baron result modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/baronTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        targetMessage: baronResult.targetMessage,
      });

      // Show Baron result modal to the attacker (with confirm button to control game flow)
      setBaronResultModalData({
        attackerName: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        attackerMessage: baronResult.attackerMessage,
        targetMessage: baronResult.targetMessage,
      });

      // Baron effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === REGENT QUEEN CARD LOGIC (ID: 11) ===
    else if (cardPlayed.id === 11) {
      const regentQueenResult = await applyRegentQueenEffect({
        roomCode,
        attacker: nickname,
        target,
        playedCardIndex: selectedCardIndex, // Pass the index of the played card
        updatePlayedCardIndex: (index) => {
          setSelectedCardIndex(index);
        },
      });

      if (regentQueenResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: Regent Queen failed`,
        });
        return;
      }

      // Send the public notification (reveals eliminated player's card only)
      pushNotification(roomCode, regentQueenResult.publicMessage);

      // Show Regent Queen result modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/regentQueenTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetName: target,
        attackerCard: regentQueenResult.attackerCard,
        targetCard: regentQueenResult.targetCard,
        eliminatedPlayer: regentQueenResult.eliminatedPlayer,
        isTie: regentQueenResult.isTie,
      });

      // Show Regent Queen result modal to the attacker (with confirm button to control game flow)
      setRegentQueenResultModalData({
        attackerName: nickname,
        targetName: target,
        attackerCard: regentQueenResult.attackerCard,
        targetCard: regentQueenResult.targetCard,
        eliminatedPlayer: regentQueenResult.eliminatedPlayer,
        isTie: regentQueenResult.isTie,
      });

      // Regent Queen effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === COURT WHISPERER CARD LOGIC (ID: 12) ===
    else if (cardPlayed.id === 12) {
      const courtWhispererResult = await applyCourtWhispererEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (courtWhispererResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${courtWhispererResult.error}`,
        });
        return;
      }

      // Send the public notification
      pushNotification(roomCode, courtWhispererResult.publicMessage);

      if (!courtWhispererResult.isSelfTarget) {
        // Send target message to the target
        await update(ref(db, `rooms/${roomCode}/targetMessage`), {
          selectedCardId: cardPlayed.id,
          visibleTo: target,
          attacker: nickname,
          message: courtWhispererResult.targetMessage,
          timestamp: Date.now(),
        });
      }

      // Show result modal to the attacker
      setResultModalData({
        selectedCardId: 12, // Court Whisperer
        resultText: courtWhispererResult.attackerMessage,
        isInfoOnly: false,
        isCourtWhispererEffect: true,
        courtWhispererTarget: target,
        isSelfTarget: courtWhispererResult.isSelfTarget,
      });

      // Court Whisperer effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === PRINCE CARD LOGIC (ID: 5) ===
    else if (cardPlayed.id === 5) {
      // Store the original attacker hand before Prince effect modifies it
      const originalAttackerHand = [...player.hand];

      if (isDeckEmpty) {
        setResultModalData({
          resultText: `❌ Error: The Deck is empty. You can't target anyone.`,
        });
        return;
      }

      const princeResult = await applyPrinceEffect({
        selectedCardId: cardPlayed.id,
        roomCode,
        attacker: nickname,
        target,
        selectedCardIndex,
      });

      if (princeResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${princeResult.error}`,
        });
        return;
      }

      console.log(
        "PRINCE RESULT from applyPrinceEffect:",
        princeResult,
        " / isSelfTarget? => ",
        princeResult?.isSelfTarget
      );

      // Send the public notification
      pushNotification(roomCode, princeResult.publicMessage);

      // Show result modal to the attacker (prince player)
      setResultModalData({
        selectedCardId: 5, // Prince
        resultText: princeResult.attackerMessage,
        isSelfTarget: princeResult.isSelfTarget, // Store self-target flag for turn completion
        originalAttackerHand: originalAttackerHand, // Store original hand for turn completion
        princessDiscarded: princeResult.wasPrincessDiscarded,
      });

      // Only send target message via Firebase for external targeting
      if (!princeResult.isSelfTarget && princeResult.targetMessage) {
        await update(ref(db, `rooms/${roomCode}/targetMessage`), {
          selectedCardId: cardPlayed.id,
          visibleTo: target,
          message: princeResult.targetMessage,
          from: nickname,
          cardName: "Prince",
          selectedCardIndex: selectedCardIndex,
          originalAttackerHand: originalAttackerHand,
          princessDiscarded: princeResult.wasPrincessDiscarded,
        });
      }
      return;
    }

    // === PHANTOM KING CARD LOGIC (ID: 6) ===
    else if (cardPlayed.id === 6) {
      const result = await applyPhantomKingEffect({
        roomCode,
        attacker: nickname,
        target,
        selectedCardIndex,
      });

      // Show target message to the target
      console.log("👻 PHANTOM KING: Sending target message to:", target);

      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        selectedCardId: cardPlayed.id,
        visibleTo: target,
        attacker: nickname,
        message: result.targetMessage,
        swappedCards: {
          attackerGave: result.newTargetCard, // Card the attacker gave away
          attackerReceived: result.newAttackerCard, // Card the attacker received
          targetGave: result.newAttackerCard, // Card the target gave away
          targetReceived: result.newTargetCard, // Card the target received
        },
        timestamp: Date.now(),
      });
      console.log("👻 PHANTOM KING: Target message sent successfully");

      setResultModalData({
        selectedCardId: 6, // Phantom King card ID
        resultText: result.attackerMessage,
        cardPlayed: 6, // Special flag for Phantom King
        swappedCards: {
          attackerGave: result.newTargetCard, // Card the attacker gave away
          attackerReceived: result.newAttackerCard, // Card the attacker received
          targetGave: result.newAttackerCard, // Card the target gave away
          targetReceived: result.newTargetCard, // Card the target received
        },
        role: "attacker", // For the EffectResultModal to know which perspective
      });

      pushNotification(roomCode, result.publicMessage);

      return;
    }

    // === ROYAL CONFESSOR CARD LOGIC (ID: 13) ===
    else if (cardPlayed.id === 13) {
      const result = await applyRoyalConfessorEffect({
        roomCode,
        target1: target,
        target2,
        attacker: nickname,
        selectedCardIndex,
        cardPlayed,
      });

      // Handle different messaging scenarios based on whether attacker is one of the targets
      const attackerIsTarget1 = result.isSelfTarget;
      const attackerIsExternal = !attackerIsTarget1;

      console.log("🎭 ROYAL CONFESSOR: Target analysis:", {
        attackerIsTarget1,
        attackerIsExternal,
        target1: target,
        target2,
        attacker: nickname,
      });

      // Send that to target2 IN ANY CASE

      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        selectedCardId: cardPlayed.id,
        visibleTo: target2,
        attacker: nickname,
        isSelfTarget: result.isSelfTarget,
        message: result.target2Message,
        swappedCards: {
          targetGave: result.newTarget1Card, // Card target2 gave away (to attacker/target1)
          targetReceived: result.newTarget2Card, // Card target2 received (from attacker/target1)
        },
        timestamp: Date.now(),
      });

      if (attackerIsExternal) {
        // Case 2: Attacker is external - need to send EffectResultModal to target1 as well
        console.log(
          "🎭 ROYAL CONFESSOR: Attacker is external - sending normal messages to target1 as well"
        );

        // Send message to Target1 via target2Message
        await update(ref(db, `rooms/${roomCode}/target2Message`), {
          selectedCardId: cardPlayed.id,
          visibleTo: target,
          attacker: nickname,
          isSelfTarget: false,
          message: result.target1Message,
          swappedCards: {
            targetGave: result.newTarget2Card,
            targetReceived: result.newTarget1Card,
          },
          timestamp: Date.now(),
        });

        console.log(
          "🎭 ROYAL CONFESSOR: Messages sent to both Target1 and Target2"
        );
      }

      // Set up the RoyalConfessorResultModal for the attacker
      setRoyalConfessorResultModalData({
        selectedCardId: 13, // Royal Confessor card ID
        resultText: attackerIsTarget1
          ? result.attackerSelfTargetMessage
          : result.externalAttackerMessage,
        target1Name: target,
        target2Name: target2,
        isSelfTarget: result.isSelfTarget,
        cardPlayed: 13, // Special flag for Royal Confessor
        swappedCards: {
          target1Gave: result.newTarget2Card, // Card the attacker/target1 gave away
          target1Received: result.newTarget1Card, // Card the attacker/target1 received
        },
        role: "attacker",
      });

      console.log(
        "🎭 ROYAL CONFESSOR: RoyalConfessorResultModal data set for attacker"
      );

      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === BARONESS CARD LOGIC (ID: 15) ===
    else if (cardPlayed.id === 15) {
      console.log(
        `💄 BARONESS: ${nickname} observes romantic secrets from ${target}${
          target2 ? ` and ${target2}` : ""
        }`
      );

      const result = await applyBaronessEffect({
        roomCode,
        attacker: nickname,
        target1: target,
        target2,
      });

      if (result.result === "error") {
        console.error("💄 BARONESS ERROR:", result.error);
        setResultModalData({
          resultText: `💄 Baroness observation failed: ${result.error}`,
        });
        return;
      }

      // Send target messages with proper error handling
      try {
        // Send target message to target1
        await update(ref(db, `rooms/${roomCode}/targetMessage`), {
          selectedCardId: cardPlayed.id,
          visibleTo: target,
          attacker: nickname,
          message: result.target1Message,
          timestamp: Date.now(),
        });

        // Send target message to target2 if exists
        if (target2 && result.target2Message) {
          await update(ref(db, `rooms/${roomCode}/target2Message`), {
            selectedCardId: cardPlayed.id,
            visibleTo: target2,
            attacker: nickname,
            message: result.target2Message,
            timestamp: Date.now(),
          });
        }

        // Show attacker's result modal with revealed cards (only if Firebase succeeded)
        setResultModalData({
          selectedCardId: 15, // Baroness
          resultText: result.attackerMessage,
          cardDetails: {
            target1Name: target,
            target1Card: result.target1Card,
            target2Name: target2,
            target2Card: result.target2Card,
          },
          role: "attacker",
        });
      } catch (error) {
        console.error("💄 BARONESS Firebase Error:", error);

        // Show user-friendly error message with graceful degradation
        setResultModalData({
          resultText: `💄 Network error! The Baroness's romantic secrets couldn't be shared with the targets, but you still observed: ${target}${
            target2 ? ` and ${target2}` : ""
          }.`,
          cardDetails: {
            target1Name: target,
            target1Card: result.target1Card,
            target2Name: target2,
            target2Card: result.target2Card,
          },
          role: "attacker",
          isError: true,
        });

        // Still continue with turn completion - card effect succeeded, only messaging failed
        return;
      }

      // Notify all players about the romantic observation
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === INQUISITOR CARD LOGIC (ID: 9) ===
    else if (cardPlayed.id === 9) {
      console.log(
        `🕵️ INQUISITOR: ${nickname} investigates ${target} for strength ${guess}`
      );

      const result = await applyInquisitorEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      if (result.result === "error") {
        console.error("🕵️ INQUISITOR ERROR:", result.error);
        setResultModalData({
          resultText: `🕵️ Investigation failed: ${result.error}`,
        });
        return;
      }

      // Notify all players about the investigation
      pushNotification(roomCode, result.publicMessage);

      // Show attacker's result modal first (info only) with card details
      setResultModalData({
        selectedCardId: 9, // Inquisitor
        /* ...result.attackerModalData?, */
        resultText: result.attackerMessage,
      });

      await update(ref(db, `rooms/${roomCode}/targetMessage`), {
        roomCode,
        selectedCardId: cardPlayed.id,
        visibleTo: target,
        attacker: nickname,
        target,
        message: result.targetMessage,
        princessDiscarded: result.princessDiscarded,
        cardDetails: result.cardDetails,
        timestamp: Date.now(),
      });

      return;
    }
  };

  // CAREFUL: this executes on the TARGET's client side (when they close the AssassinPromptModal)
  const handleAssassinPromptClose = async (
    actionUsed,
    guardTargetPromptData
  ) => {
    console.log(`🔍 handleAssassinPromptClose - Begining with data:`, {
      actionUsed: actionUsed,
      guardTargetPromptData: guardTargetPromptData,
    });

    // Apply Guard effects after AssassinPromptModal is closed
    const result = await applyGuard2Effect({
      roomCode,
      actionUsed,
      guardTargetPromptData,
    });

    // Notify all players about the Guard action result
    pushNotification(roomCode, result.publicMessage);

    const bulkUpdates = {
      guardPrompt: null,
      guard2Prompt: {
        selectedCardId: 1,
        resultText: result.attackerMessage,
        guardOutcome: result.result,
        attacker: result.attacker,
        timestamp: Date.now(),
      },
      attackerMarkedForElimination: result.attackerMarkedForElimination || null,
    };

    await update(ref(db, `rooms/${roomCode}`), bulkUpdates);

    setGuardTargetPromptData(null);
    setShowGuardTargetPrompt(false);
  };

  /**  Completes the current player's turn / Check roundEnd conditions & discard card if necessary & advance to next player */
  const handleEffectResultClose = async () => {
    console.log("🔔 handleEffectResultClose: Starting with resultModalData:", {
      resultModalData,
      selectedCardIndex,
      player,
    });

    // Special handling for Guard
    if (resultModalData?.selectedCardId === 1) {
      console.log("🕵️‍♂️ GUARD: Using special turn completion");
      const attackerElimination = await completeGuardTurn();

      if (attackerElimination) {
        await completeTurnWithCardIndex(selectedCardIndex, {
          noDiscarding: true,
        });
        return;
      } // ELSE, go through normal completeTurnWithCardIndex, with Guard discarded
    }

    // Special handling for Court Whisperer - effect must be applied now
    if (resultModalData?.isCourtWhispererEffect) {
      console.log("🗣️ COURT WHISPERER: Using special turn completion");
      await completeCourtWhispererTurn(resultModalData.courtWhispererTarget);
    }

    // Special handling for Princess - elimination effect is already applied
    if (resultModalData?.isPrincessElimination) {
      console.log("👑 PRINCESS: Using special turn completion (elimination)");
      await completePrincessTurn();

      await completeTurnWithCardIndex(selectedCardIndex, {
        noDiscarding: true,
      });
      return;
    }

    // Special handling for Duke - noble favor effect must be applied now
    if (resultModalData?.hasDukeFavor) {
      console.log("👑🐕 DUKE: Using special turn completion");
      await completeDukeTurn();
      return;
    }

    // Special handling for Prince - check for self-elimination
    if (resultModalData?.selectedCardId === 5) {
      // PRINCE

      const princeSelfElimination =
        resultModalData?.isSelfTarget && resultModalData?.princessDiscarded;

      let finalUpdates = {};

      if (princeSelfElimination) {
        finalUpdates = handlePlayerElimination(
          roomCode,
          player?.name,
          roomData?.mode,
          roomData.players[player?.name],
          finalUpdates,
          { discardRemainingHand: true }
        );

        await update(ref(db, `rooms/${roomCode}`), finalUpdates);

        await completeTurnWithCardIndex(selectedCardIndex, {
          noDiscarding: true,
        });

        return;
      }
    }

    await completeTurnWithCardIndex(selectedCardIndex);
  };

  /*Completes the turn using a specific card index (used by target message modals) */

  const completeTurnWithCardIndex = async (cardIndex, options = {}) => {
    console.log("🔄 completeTurnWithCardIndex: Starting with data:", {
      cardIndex,
      cardIndexType: typeof cardIndex,
      player,
      playerHand: player?.hand,
      handLength: player?.hand?.length,
      nickname,
      roomCode,
      options,
    });

    if (options.noDiscarding) {
      console.log(
        "🔄 completeTurnWithCardIndex - noDiscarding option - Skipping discard"
      );
    } else {
      // Get the most recent data from Firebase to avoid stale state issues
      const snapshot = await get(ref(db, `rooms/${roomCode}`));
      const updatedData = snapshot.val();
      setRoomData(updatedData);
      setPlayer(updatedData?.players?.[nickname]);

      // Validate that we have the necessary data to complete the turn
      if (
        cardIndex === null ||
        cardIndex === undefined ||
        cardIndex < 0 ||
        !player?.hand ||
        player.hand.length === 0 ||
        cardIndex >= player.hand.length
      ) {
        console.error(
          "🔄 completeTurnWithCardIndex (should discard) - TURN COMPLETION ERROR: invalid cardIndex or hand state:",
          {
            cardIndex,
            cardIndexType: typeof cardIndex,
            handLength: player?.hand?.length,
            player: player,
          }
        );
        return;
      }

      const playedCard = player.hand[cardIndex];
      // Build remaining hand by filtering out the played card
      const remainingHand = player.hand.filter(
        (_, index) => index !== cardIndex
      );
      const newDiscard = [...(player.discard || []), playedCard];

      // Handle card discard and check for special tokens (like Chamberlain)
      const discardUpdates = {
        [`players/${nickname}/hand`]: remainingHand,
        [`players/${nickname}/discard`]: newDiscard,
      };

      const finalUpdates = handleCardDiscard({
        roomCode,
        playerName: nickname,
        card: playedCard,
        gameMode: roomData?.mode,
        existingUpdates: discardUpdates,
      });

      // Update Firebase with the turn completion
      await update(ref(db, `rooms/${roomCode}`), finalUpdates);

      console.log(
        "🔄 completeTurnWithCardIndex - Card discarded, checking round end:"
      );
    }

    // Checking if the round should end now
    const roundEndResult = await checkRoundEndConditions(roomCode);

    console.log(
      "🔄 completeTurnWithCardIndex - AFTER checking round end / roundEndResult:",
      {
        roundEndResult,
      }
    );

    // Also check if this was the final turn (deck empty flag)
    const isFinalTurn = roomData?.round?.isFinalTurn;

    if (roundEndResult.isRoundEnd || isFinalTurn) {
      console.log("🏆 completeTurnWithCardIndex - ROUND END DETECTED:", {
        roundEndResult,
        isFinalTurn,
      });

      // Add a delay to allow modals to be displayed and players to read effects
      setTimeout(async () => {
        console.log(
          "🏆 completeTurnWithCardIndex - TRIGGERING ROUND END after delay"
        );
        await triggerRoundEnd(roomCode);
      }, 2000);

      return; // Don't reset isPlaying yet, let the round end handle it
    } else {
      console.log("🔄 completeTurnWithCardIndex - ADVANCING TO NEXT PLAYER");
      // Calculate next player in turn order (skip eliminated players)
      const activePlayers = Object.keys(players).filter(
        (p) => !players[p].isOut
      );
      const currentIndex = activePlayers.indexOf(nickname);
      let nextIndex = (currentIndex + 1) % activePlayers.length;

      // Skip any players that got eliminated during this turn
      while (
        players[activePlayers[nextIndex]]?.isOut &&
        nextIndex !== currentIndex
      ) {
        nextIndex = (nextIndex + 1) % activePlayers.length;
      }
      const nextPlayer = activePlayers[nextIndex];

      // Final validation before Firebase update
      if (!nextPlayer) {
        console.error("Invalid values detected before Firebase update:", {
          remainingHand,
          nextPlayer,
        });
        return;
      }

      // Clean up Handmaid protection for the next player (protection expires when their turn starts)
      const currentProtected = roomData?.protectedPlayers || [];
      const updatedProtected = currentProtected.filter(
        (player) => player !== nextPlayer
      );

      const playersUpdates = {
        [`round/currentPlayer`]: nextPlayer,
        protectedPlayers: updatedProtected,
      };

      // Notify all players about the turn change
      pushNotification(
        roomCode,
        `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
      );

      // Update Firebase with the turn completion
      await update(ref(db, `rooms/${roomCode}`), playersUpdates);
    }

    // Reset local state only if round didn't end
    console.log(
      "🔄 completeTurnWithCardIndex - TURN COMPLETION: Resetting card selection state (isPlaying will be reset by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
    setSelectedCardForUI(null);
  };

  /*  Completes the Guard turn using data from guardTargetPromptData */
  const completeGuardTurn = async () => {
    const snapshot = await get(ref(db, `rooms/${roomCode}`));

    const data = snapshot.val();
    const attackerMarkedForElimination = data.attackerMarkedForElimination;

    const baseUpdates = {
      attackerMarkedForElimination: null,
      guard2Prompt: null,
    };

    let finalUpdates = baseUpdates;

    if (attackerMarkedForElimination) {
      finalUpdates = handlePlayerElimination(
        roomCode,
        nickname,
        roomData?.mode,
        player,
        baseUpdates,
        { discardRemainingHand: true }
      );

      console.log(
        `🗡️ GUARD EXECUTION: ${nickname} has been eliminated by the Assassin`
      );
    }

    // Always update Firebase to clear guard2Prompt and attackerMarkedForElimination
    await update(ref(db, `rooms/${roomCode}`), finalUpdates);

    return attackerMarkedForElimination;
  };

  const completeDukeTurn = async () => {
    console.log(
      "👑🐕 DUKE TURN COMPLETION: Noble favor granted, completing turn"
    );

    // Validate selectedCardIndex and get the Duke card
    if (
      selectedCardIndex === null ||
      selectedCardIndex === undefined ||
      !player.hand ||
      selectedCardIndex >= player.hand.length
    ) {
      console.error(
        "👑🐕 DUKE ERROR: Cannot complete turn - invalid selectedCardIndex:",
        { selectedCardIndex, handLength: player.hand?.length }
      );
      return;
    }

    const dukeCard = player.hand[selectedCardIndex];

    if (!dukeCard || dukeCard.id !== 16) {
      console.error(
        "👑🐕 DUKE ERROR: Cannot complete turn - invalid Duke card:",
        dukeCard
      );
      return;
    }

    // Remove Duke from hand and add to discard pile
    const newHand = player.hand.filter(
      (_, index) => index !== selectedCardIndex
    );
    const newDiscard = [...(player.discard || []), dukeCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Increment Duke token for this player (can stack)
    const currentDukeToken = player.dukeToken || 0;
    const newDukeToken = currentDukeToken + 1;

    // Update game state: discard Duke, advance turn, set Duke token
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: newHand,
      [`players/${nickname}/discard`]: newDiscard,
      [`players/${nickname}/dukeToken`]: newDukeToken,
      [`round/currentPlayer`]: nextPlayer,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🏛️ The Duke's favor has been granted. The crown now passes to ${nextPlayer}. 👑🐕`
    );

    // Reset local state
    console.log(
      "🔄 DUKE TURN COMPLETION: Resetting card selection state (isPlaying handled by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
  };

  /**
   * Completes the Court Whisperer turn - sets nextTarget and completes the turn
   * Called after the attacker confirms their EffectResultModal
   */
  const completeCourtWhispererTurn = async (target) => {
    console.log(
      "🗣️ COURT WHISPERER TURN COMPLETION: Setting next target and completing turn"
    );

    // Validate selectedCardIndex and get the Court Whisperer card
    if (
      selectedCardIndex === null ||
      selectedCardIndex === undefined ||
      !player.hand ||
      selectedCardIndex >= player.hand.length
    ) {
      console.error(
        "🗣️ COURT WHISPERER ERROR: Cannot complete turn - invalid selectedCardIndex:",
        { selectedCardIndex, handLength: player.hand?.length }
      );
      return;
    }

    const courtWhispererCard = player.hand[selectedCardIndex];

    if (!courtWhispererCard || courtWhispererCard.id !== 12) {
      console.error(
        "🗣️ COURT WHISPERER ERROR: Cannot complete turn - invalid Court Whisperer card:",
        courtWhispererCard
      );
      return;
    }

    // Set the nextTarget in Firebase (this is when the effect actually takes place)
    const targetPlayer = players[target];
    const nextTargetObject = {
      nickname: target,
      name: targetPlayer.realName,
      used: false,
    };

    // Update game state: discard Court Whisperer, advance turn, clear protection, set nextTarget
    await update(ref(db, `rooms/${roomCode}`), {
      [`round/nextTarget`]: nextTargetObject,
    });

    // Reset local state
    console.log(
      "🔄 COURT WHISPERER TURN COMPLETION: nextTarget set to Firebase"
    );
  };

  /**
   * Completes the Princess turn - elimination effect has already been applied
   * Just need to discard the card and advance the turn
   */
  const completePrincessTurn = async () => {
    console.log("👑 PRINCESS TURN COMPLETION: The royal tragedy concludes");

    const finalUpdates = handlePlayerElimination(
      roomCode,
      nickname,
      roomData?.mode,
      player,
      {},
      { discardRemainingHand: true }
    );
    // Just apply isOut=true for player (Princess discard is done later)
    await update(ref(db, `rooms/${roomCode}`), finalUpdates);
  };

  /**
   * Handle clicking on a player section to view their discard pile
   */
  const handlePlayerSectionClick = (playerName, playerData) => {
    console.log("🎯 Player section clicked:", playerName, playerData);
    // TODO: Open player discard modal
    // For now, just log the click
  };

  if (!roomData || !player || !round || !players) {
    return <div className="play-loading">⏳ Loading game state...</div>;
  } else {
    const roundNumber = roomData?.gameStats?.currentRound || 1;
    return (
      <>
        <style>{`
          .effect-title {
            font-weight: bold;
            font-size: 1.1em;
            color: #d4af37;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            margin: 0.5em 0;
            text-align: center;
          }

          .effect-player {
            font-weight: bold;
            color: #87ceeb;
          }

          .effect-card {
            font-weight: bold;
            color: #ffd700;
          }

          .effect-strength {
            font-weight: bold;
            color: #ff6b6b;
          }

          .effect-quote {
            font-style: italic;
            color: #daa520;
            margin: 0.5em 0;
            padding: 0.25em;
            border-left: 3px solid #daa520;
            padding-left: 1em;
          }

          .effect-signature {
            font-style: italic;
            text-align: right;
            color: #c0c0c0;
            margin-top: 0.25em;
          }

          .effect-description {
            line-height: 1.4;
            margin: 0.3em 0;
          }

          .effect-warning {
            color: #ff4444;
            font-weight: bold;
          }

          .effect-success {
            color: #44ff44;
            font-weight: bold;
          }
        `}</style>
        <div className="royal-play-container">
          {/* MAIN GAME AREA */}
          <div className="royal-game-area">
            {/* CURRENT PLAYER BANNER */}
            <div
              className={`current-player-banner ${
                currentPlayer === nickname ? "is-my-turn" : ""
              }`}
            >
              {currentPlayer === nickname ? (
                <span>👑 YOUR ROYAL TURN 👑</span>
              ) : (
                <span>
                  🎭 AWAITING {currentPlayer?.toUpperCase()}'S ROYAL DECREE 🎭
                </span>
              )}
            </div>

            {/* PLAYERS GRID */}
            <div className="game-grid">
              {Object.entries(players).map(([name, p], index) => {
                const isProtected = roomData?.protectedPlayers?.includes(name);
                const isCurrentPlayer = name === currentPlayer;
                const isEliminated = p.isOut;
                const hasJester = p.jesterToken;
                const isYou = name === nickname;

                // Use hardcoded positioning logic based on player count and position
                const shouldShowPopoverOnLeftSide = shouldShowPopoverOnLeft(
                  index,
                  totalPlayers
                );

                // Check if essential game actions are needed that would block the popover
                const shouldBlockPopover =
                  isMyTurn &&
                  !resultModalData &&
                  !baronResultModalData &&
                  !baronTargetModalData &&
                  !regentQueenResultModalData &&
                  !regentQueenTargetModalData &&
                  !targetMessageModalData &&
                  !royalConfessorResultModalData &&
                  !inquisitorResultModalData &&
                  !showGuardTargetPrompt &&
                  !roundEndModalData &&
                  !isModalTransitioning &&
                  (!isPlaying ||
                    (roomData?.guardPrompt &&
                      roomData.guardPrompt.attacker === nickname));

                return (
                  <div
                    key={name}
                    className={`royal-player-section ${
                      isCurrentPlayer ? "is-current-player" : ""
                    } ${isEliminated ? "is-eliminated" : ""} ${
                      isProtected ? "is-protected" : ""
                    } ${
                      roomData?.round?.nextTarget &&
                      roomData.round.nextTarget.nickname === name
                        ? "is-targeted"
                        : ""
                    } ${hasJester ? "has-jester" : ""}`}
                    onClick={() => handlePlayerSectionClick(name, p)}
                    onMouseEnter={() => setHoveredPlayer(name)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                  >
                    <div className="player-tokens">
                      <span>❤️</span> <span>{p.tokens || 0}</span>
                    </div>
                    {/* Player Header */}
                    <div className="player-header">
                      <div className={`player-name ${isYou ? "is-you" : ""}`}>
                        {isCurrentPlayer && "👑 "}
                        {p.name}
                        {p.realName && (
                          <div className="player-real-name">
                            ({isYou ? "You" : p.realName})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Info Grid - Simplified */}
                    <div className="player-info-grid">
                      {/* Show last discarded card if any */}
                      {p.discard && p.discard.length > 0 && (
                        <div className="player-stat">
                          <span className="player-stat-label">Last Played</span>
                          <span className="player-stat-value">
                            {p.discard[p.discard.length - 1].name} (Strength{" "}
                            {p.discard[p.discard.length - 1].strength})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Special Status Indicators */}
                    {isProtected && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          color: "#90EE90",
                          fontSize: "0.8rem",
                        }}
                      >
                        🫖✨ Protected by Handmaid
                      </div>
                    )}
                    {isEliminated && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          color: "#888",
                          fontSize: "0.8rem",
                        }}
                      >
                        Eliminated this round
                      </div>
                    )}

                    {/* Discard Pile Popover */}
                    <DiscardPilePopover
                      player={p}
                      gameMode={roomData?.mode || "normal"}
                      isVisible={hoveredPlayer === name && !shouldBlockPopover}
                      showOnLeft={shouldShowPopoverOnLeftSide}
                      isYou={isYou}
                    />
                  </div>
                );
              })}

              {/* ELIMINATION MESSAGE - Shown inside the grid for better UX */}
              {players[nickname]?.isOut && (
                <div className="royal-elimination-banner">
                  <div className="elimination-icon">💀</div>
                  <div className="elimination-content">
                    <div className="elimination-title">
                      <strong>You've been eliminated!</strong>
                    </div>
                    <div className="elimination-subtitle">
                      You can no longer play this round, but may still witness
                      the royal drama as it unfolds...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GAME ACTIONS SECTION */}
            {isMyTurn &&
              !hasActiveModal() &&
              player.hand?.length >= 1 &&
              (!isPlaying ||
                (roomData?.guardPrompt &&
                  roomData.guardPrompt.attacker === nickname)) &&
              roomData?.gameState !== "roundScoring" && (
                <div className="royal-action-area-overlay">
                  <div className="royal-actions-area">
                    {/* Discard History Link - Top Right */}
                    {player.hand?.length === 2 && hoveredCardIndex !== 1 && (
                      <button
                        className="discard-history-link"
                        onClick={() => setShowDiscardHistory(true)}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#ffd700";
                          e.target.style.textShadow =
                            "0 0 8px rgba(212, 175, 55, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#d4af37";
                          e.target.style.textShadow = "none";
                        }}
                      >
                        📜 Discard History
                      </button>
                    )}
                    {/* Discard History Modal */}
                    <DiscardHistoryModal
                      isOpen={showDiscardHistory}
                      onClose={() => setShowDiscardHistory(false)}
                      players={players}
                      roomData={roomData}
                    />
                    {isMyTurn && (
                      <div className="turn-section">
                        {player.hand?.length === 1 && <h3>It’s your turn!</h3>}
                        {player.hand?.length === 1 && (
                          <button
                            className="draw-card-button"
                            onClick={drawCard}
                          >
                            Draw Card
                          </button>
                        )}
                        {player.hand?.length === 2 && (
                          <div>
                            {(() => {
                              const countessForce = getCountessForcePlay(
                                player.hand
                              );

                              return (
                                <>
                                  <p className="choose-card-header">
                                    Choose a card to play:
                                  </p>
                                  {countessForce.forced && (
                                    <div className="countess-warning">
                                      <p className="countess-warning-title">
                                        🪭 The Countess’s pride is wounded!
                                      </p>

                                      <p className="countess-warning-reason">
                                        {countessForce.reason}
                                      </p>
                                    </div>
                                  )}

                                  <div
                                    className={`card-selection-container ${
                                      selectedCardForUI !== null
                                        ? "card-selected"
                                        : ""
                                    }`}
                                  >
                                    {/* Show selected card on left when a card is selected */}
                                    {selectedCardForUI !== null ? (
                                      <div className="selected-card-display">
                                        {(() => {
                                          const card =
                                            player.hand[selectedCardForUI];
                                          const isBlocked =
                                            countessForce.forced &&
                                            ((card.id === 5 &&
                                              countessForce.blockedCard ===
                                                "Prince") ||
                                              (card.id === 6 &&
                                                countessForce.blockedCard ===
                                                  "Phantom King"));

                                          return (
                                            <button
                                              className={`card-button ${
                                                isBlocked ? "blocked" : ""
                                              } selected`}
                                              disabled={true}
                                            >
                                              <div className="card-strength">
                                                {card.strength}
                                              </div>
                                              <div
                                                className="card-image"
                                                style={{
                                                  backgroundImage: `url('/src/img/${getCardImage(
                                                    card.name
                                                  )}')`,
                                                }}
                                              ></div>

                                              <div className="card-content">
                                                <div className="card-name">
                                                  {card.name}
                                                </div>
                                                <div className="card-effect">
                                                  {card.effect}
                                                </div>
                                                <CardCountStars
                                                  count={card.count}
                                                />
                                              </div>
                                            </button>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      /* Show all cards when no card is selected */
                                      player.hand.map((card, index) => {
                                        const isBlocked =
                                          countessForce.forced &&
                                          ((card.id === 5 &&
                                            countessForce.blockedCard ===
                                              "Prince") ||
                                            (card.id === 6 &&
                                              countessForce.blockedCard ===
                                                "Phantom King"));

                                        return (
                                          <button
                                            key={index}
                                            onClick={() => playCard(index)}
                                            className={`card-button ${
                                              isBlocked ? "blocked" : ""
                                            }`}
                                            disabled={isPlaying || isBlocked}
                                            title={
                                              isBlocked
                                                ? `Cannot play ${card.name} - Countess demands precedence!`
                                                : ""
                                            }
                                            onMouseEnter={() =>
                                              setHoveredCardIndex(index)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredCardIndex(null)
                                            }
                                            style={{ position: "relative" }}
                                          >
                                            <div className="card-strength">
                                              {card.strength}
                                            </div>
                                            <div
                                              className="card-image"
                                              style={{
                                                backgroundImage: `url('/src/img/${getCardImage(
                                                  card.name
                                                )}')`,
                                              }}
                                            ></div>

                                            <div className="card-content">
                                              <div className="card-name">
                                                {card.name}
                                              </div>
                                              <div className="card-effect">
                                                {card.effect}
                                              </div>
                                              <CardCountStars
                                                count={card.count}
                                              />
                                            </div>

                                            {/* Card Effect Details Popover */}
                                            <CardEffectPopover
                                              card={card}
                                              position={
                                                index === 0 ? "left" : "right"
                                              }
                                              isVisible={
                                                hoveredCardIndex === index &&
                                                !hasActiveModal()
                                              }
                                            />
                                          </button>
                                        );
                                      })
                                    )}

                                    {/* Show TargetModal/InquisitorTargetModal on the right when a card is selected and modal should be shown */}
                                    {selectedCardForUI !== null &&
                                      showTargetModal &&
                                      selectedCardIndex !== null &&
                                      player.hand?.[selectedCardIndex] && (
                                        <div className="target-modal-display">
                                          {player.hand[selectedCardIndex].id ===
                                          9 ? (
                                            <InquisitorTargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              nextTarget={
                                                roomData?.round?.nextTarget
                                              }
                                              isDeckEmpty={
                                                !roomData?.round?.deck ||
                                                roomData?.round?.deck.length ===
                                                  0
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          ) : player.hand[selectedCardIndex]
                                              .id === 13 ? (
                                            <RoyalConfessorTargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              nextTarget={
                                                roomData?.round?.nextTarget
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          ) : player.hand[selectedCardIndex]
                                              .id === 15 ? (
                                            <BaronessTargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              nextTarget={
                                                roomData?.round?.nextTarget
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          ) : (
                                            <TargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              cardPlayed={
                                                player.hand[selectedCardIndex]
                                                  .id
                                              }
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              nextTarget={
                                                roomData?.round?.nextTarget
                                              }
                                              isDeckEmpty={
                                                !roomData?.round?.deck ||
                                                roomData?.round?.deck.length ===
                                                  0
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          )}
                                        </div>
                                      )}

                                    {/* Show waiting message when AssassinPromptModal is active and current player is the attacker */}
                                    {selectedCardForUI !== null &&
                                      roomData?.guardPrompt &&
                                      roomData.guardPrompt.attacker ===
                                        nickname &&
                                      player.hand?.[selectedCardForUI]?.id ===
                                        1 && (
                                        <div className="assassin-waiting-display">
                                          <div className="assassin-waiting-content">
                                            <div className="assassin-waiting-icon">
                                              ⏳
                                            </div>
                                            <div className="assassin-waiting-title">
                                              Awaiting Fate's Response...
                                            </div>
                                            <div className="assassin-waiting-message">
                                              🗡️ Your accusation has been
                                              delivered to{" "}
                                              <strong>
                                                {roomData.guardPrompt.target}
                                              </strong>
                                              .
                                              <br />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* === GENERAL TARGET MESSAGE MODAL === */}
            {targetMessageModalData && (
              <EffectResultModal
                selectedCardId={targetMessageModalData.selectedCardId}
                role={currentPlayer === nickname ? "attacker" : "target"}
                resultText={targetMessageModalData.message}
                isSelfTarget={targetMessageModalData.isSelfTarget || false}
                swappedCards={targetMessageModalData.swappedCards || null}
                princessDiscarded={
                  targetMessageModalData.princessDiscarded || false
                }
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "🎯 TARGET MODAL DEBUG: Target modal closing with data:",
                      {
                        targetMessageModalData,
                        selectedCardIndex:
                          targetMessageModalData.selectedCardIndex,
                        currentPlayer: player,
                        currentHand: player?.hand,
                        handLength: player?.hand?.length,
                      }
                    );

                    // Clear the target message when confirmed
                    await set(ref(db, `rooms/${roomCode}/targetMessage`), null);
                    setTargetMessageModalData(null);
                  })
                }
              />
            )}

            {/* === TARGET2 MESSAGE MODAL (Royal Confessor external targeting) === */}
            {target2MessageModalData && (
              <EffectResultModal
                selectedCardId={target2MessageModalData.selectedCardId}
                role="target"
                resultText={target2MessageModalData.message}
                isSelfTarget={target2MessageModalData.isSelfTarget || false}
                swappedCards={target2MessageModalData.swappedCards || null}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "🎭 TARGET2 MODAL DEBUG: Target2 modal closing with data:",
                      target2MessageModalData
                    );

                    // Clear the target2 message when confirmed
                    await set(
                      ref(db, `rooms/${roomCode}/target2Message`),
                      null
                    );
                    setTarget2MessageModalData(null);

                    // Royal Confessor target2 modals are info-only, turn advancement is handled by attacker
                    console.log(
                      "🎭 TARGET2 MODAL DEBUG: Royal Confessor target2 modal closed (info-only)"
                    );
                  })
                }
              />
            )}

            {/* === BARON RESULT MODAL === */}
            {baronResultModalData && (
              <BaronResultModal
                isOpen={true}
                userRole={
                  nickname === baronResultModalData.attackerName
                    ? "attacker"
                    : "target"
                }
                nickname={nickname}
                attackerName={baronResultModalData.attackerName}
                targetName={baronResultModalData.targetName}
                attackerCard={baronResultModalData.attackerCard}
                targetCard={baronResultModalData.targetCard}
                eliminatedPlayer={baronResultModalData.eliminatedPlayer}
                isTie={baronResultModalData.isTie}
                message={
                  nickname === baronResultModalData.attackerName
                    ? baronResultModalData.attackerMessage
                    : baronResultModalData.targetMessage
                }
                onConfirm={() =>
                  handleModalTransition(async () => {
                    // Only attacker can confirm to proceed with the game
                    // If there was an elimination, apply it now
                    if (
                      baronResultModalData.eliminatedPlayer &&
                      !baronResultModalData.isTie
                    ) {
                      const eliminatedPlayerData =
                        players[baronResultModalData.eliminatedPlayer];

                      const eliminationUpdates = handlePlayerElimination(
                        roomCode,
                        baronResultModalData.eliminatedPlayer,
                        roomData?.mode,
                        eliminatedPlayerData,
                        {},
                        {
                          discardRemainingHand:
                            baronResultModalData.eliminatedPlayer === nickname
                              ? false
                              : true,
                        }
                      );

                      await update(
                        ref(db, `rooms/${roomCode}`),
                        eliminationUpdates
                      );

                      // Notify about the elimination
                      pushNotification(
                        roomCode,
                        `⚔️💥 ${baronResultModalData.eliminatedPlayer} has been eliminated in the Baron's duel!`
                      );
                    }

                    // Clear Baron target data in Firebase
                    await set(ref(db, `rooms/${roomCode}/baronTarget`), null);
                    setBaronResultModalData(null);

                    // Complete the Baron turn (discard card, advance turn)
                    if (selectedCardIndex !== null) {
                      handleEffectResultClose();
                    }
                  })
                }
              />
            )}

            {/* === REGENT QUEEN RESULT MODAL === */}
            {regentQueenResultModalData && (
              <RegentQueenResultModal
                isOpen={true}
                nickname={nickname}
                userRole={
                  nickname === regentQueenResultModalData.attackerName
                    ? "attacker"
                    : "target"
                }
                attackerName={regentQueenResultModalData.attackerName}
                targetName={regentQueenResultModalData.targetName}
                attackerCard={regentQueenResultModalData.attackerCard}
                targetCard={regentQueenResultModalData.targetCard}
                eliminatedPlayer={regentQueenResultModalData.eliminatedPlayer}
                isTie={regentQueenResultModalData.isTie}
                onConfirm={() =>
                  handleModalTransition(async () => {
                    // Only attacker can confirm to proceed with the game
                    // If there was an elimination, apply it now

                    if (
                      regentQueenResultModalData.eliminatedPlayer &&
                      !regentQueenResultModalData.isTie
                    ) {
                      const eliminatedPlayerData =
                        players[regentQueenResultModalData.eliminatedPlayer];

                      const isSelfElimination =
                        regentQueenResultModalData.eliminatedPlayer ===
                        regentQueenResultModalData.attacker;

                      const eliminationUpdates = handlePlayerElimination(
                        roomCode,
                        regentQueenResultModalData.eliminatedPlayer,
                        roomData?.mode,
                        eliminatedPlayerData,
                        {},
                        {
                          discardRemainingHand: isSelfElimination
                            ? false
                            : true,
                        }
                      );

                      await update(
                        ref(db, `rooms/${roomCode}`),
                        eliminationUpdates
                      );

                      // Clear Regent Queen target data in Firebase
                      await set(
                        ref(db, `rooms/${roomCode}/regentQueenTarget`),
                        null
                      );
                      setRegentQueenResultModalData(null);

                      if (selectedCardIndex !== null) {
                        handleEffectResultClose();
                      }
                    }
                  })
                }
              />
            )}

            {/* === REGENT QUEEN TARGET MODAL === */}
            {regentQueenTargetModalData && (
              <RegentQueenResultModal
                nickname={nickname}
                isOpen={true}
                userRole="target"
                attackerName={regentQueenTargetModalData.attacker}
                targetName={regentQueenTargetModalData.targetName}
                attackerCard={regentQueenTargetModalData.attackerCard}
                targetCard={regentQueenTargetModalData.targetCard}
                eliminatedPlayer={regentQueenTargetModalData.eliminatedPlayer}
                isTie={regentQueenTargetModalData.isTie}
                // No onConfirm for target - they just observe
              />
            )}

            {/* === BARON TARGET MODAL === */}
            {baronTargetModalData && (
              <BaronResultModal
                nickname={nickname}
                isOpen={true}
                userRole="target"
                attackerName={baronTargetModalData.attacker}
                targetName={baronTargetModalData.targetName}
                attackerCard={baronTargetModalData.attackerCard}
                targetCard={baronTargetModalData.targetCard}
                eliminatedPlayer={baronTargetModalData.eliminatedPlayer}
                isTie={baronTargetModalData.isTie}
                message={baronTargetModalData.targetMessage}
                // No onConfirm for target - they just observe
              />
            )}

            {/* === ASSASSIN PROMPT MODAL, displayed to the guard's TARGET === */}
            {showGuardTargetPrompt &&
              guardTargetPromptData &&
              nickname === guardTargetPromptData.target && (
                <AssassinPromptModal
                  promptData={guardTargetPromptData}
                  // Target acknowledges the guess without using Assassin
                  onAcknowledge={async () => {
                    handleAssassinPromptClose(
                      "onAcknowledge",
                      guardTargetPromptData
                    );
                  }}
                  // Target uses Assassin to strike back at attacker
                  onReveal={async () => {
                    handleAssassinPromptClose(
                      "onReveal",
                      guardTargetPromptData
                    );
                  }}
                  // Target ignores (same as acknowledge - for when they don't have Assassin)
                  onIgnore={async () => {
                    handleAssassinPromptClose(
                      "onIgnore",
                      guardTargetPromptData
                    );
                  }}
                />
              )}

            {resultModalData && (
              <EffectResultModal
                selectedCardId={resultModalData.selectedCardId}
                role={
                  resultModalData.role ||
                  (currentPlayer === nickname ? "attacker" : "target")
                }
                resultText={resultModalData.resultText || resultModalData}
                cardDetails={resultModalData.cardDetails || null}
                swappedCards={resultModalData.swappedCards || null}
                isSelfTarget={resultModalData.isSelfTarget || false}
                princessDiscarded={resultModalData.princessDiscarded || false}
                guardOutcome={resultModalData.guardOutcome || null}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "⚔️ RESULT MODAL DEBUG: Result modal closing with data:",
                      {
                        resultModalData,
                        isInfoOnly: resultModalData.isInfoOnly,
                        selectedCardIndex,
                        nickname,
                      }
                    );

                    // Clear priest target modal if it exists
                    await set(ref(db, `rooms/${roomCode}/priestTarget`), null);
                    // Clear baron target modal if it exists
                    await set(ref(db, `rooms/${roomCode}/baronTarget`), null);

                    setResultModalData(null);
                    setSelectedCardForUI(null);

                    // Only advance turn if this is NOT an info-only modal (like Prince attacker modal)
                    if (
                      !resultModalData.isInfoOnly &&
                      selectedCardIndex !== null
                    ) {
                      console.log(
                        "⚔️ RESULT MODAL DEBUG: Not info-only, checking if should advance turn"
                      );

                      handleEffectResultClose();
                    } else {
                      console.log(
                        "⚔️ RESULT MODAL DEBUG: Info-only modal, NOT advancing turn"
                      );
                    }
                  })
                }
              />
            )}

            {/* === ROYAL CONFESSOR RESULT MODAL === */}
            {royalConfessorResultModalData && (
              <RoyalConfessorResultModal
                resultText={royalConfessorResultModalData.resultText}
                selectedCardId={royalConfessorResultModalData.selectedCardId}
                target1Name={royalConfessorResultModalData.target1Name}
                target2Name={royalConfessorResultModalData.target2Name}
                isSelfTarget={royalConfessorResultModalData.isSelfTarget}
                cardPlayed={royalConfessorResultModalData.cardPlayed}
                swappedCards={royalConfessorResultModalData.swappedCards}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "🎭 ROYAL CONFESSOR RESULT: Modal closing, completing turn"
                    );

                    // Clear all Royal Confessor related state
                    setRoyalConfessorResultModalData(null);

                    // Complete the Royal Confessor turn (discard card, advance turn)
                    if (selectedCardIndex !== null) {
                      handleEffectResultClose();
                    }
                  })
                }
              />
            )}
          </div>

          {/* ROYAL CHRONICLE SIDEBAR */}
          <div className="royal-chronicle-sidebar">
            <div className="chronicle-header">
              {/* ROUND */}
              <div className="round-container">
                <div className="round-content">
                  <span role="img" aria-label="Round">
                    ⚔️
                  </span>
                  <span>Round</span>
                  <span className="round-number">{roundNumber}</span>
                </div>
              </div>
              <h3>📜 Game Chronicle</h3>
            </div>
            <div
              className="chronicle-content"
              ref={chronicleContentRef}
              onScroll={handleChronicleScroll}
            >
              {notifications.map((n, i) => (
                <div key={i} className="chronicle-notification">
                  <span className="chronicle-arrow">➤</span>
                  <span
                    className="chronicle-message"
                    dangerouslySetInnerHTML={{ __html: n.message }}
                  />
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="chronicle-empty">
                  <em>📜 The chronicle awaits the first royal decree...</em>
                </div>
              )}
            </div>

            {/* New Notifications Button - shown when user scrolled up */}
            {isUserScrolledUp && newNotificationsCount > 0 && (
              <button
                className="chronicle-new-notifications-btn"
                onClick={scrollToBottomAndReset}
              >
                ↓ New notifications ({newNotificationsCount})
              </button>
            )}
          </div>

          {/* ROUND END MODAL */}
          {roundEndModalData && (
            <RoundEndModal
              roundResult={roundEndModalData}
              players={roomData?.players || {}}
              onContinue={() => {
                console.log("🏆 Round End Modal - Continuing to scoring board");
                setRoundEndModalData(null);
                navigate(`/round_scoring/${roomCode}`, {
                  state: { nickname, realName: state?.realName },
                });
              }}
            />
          )}
        </div>
      </>
    );
  }
}
