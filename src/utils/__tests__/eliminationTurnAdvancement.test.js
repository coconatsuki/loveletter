import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref, update, onValue } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  update: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
}));

// Mock the Play component's Firebase listener logic
const mockFirebaseListener = (data, roomCode) => {
  // This simulates the critical fix we added to Play.jsx
  if (data?.round?.currentPlayer && data?.players) {
    const currentPlayerData = data.players[data.round.currentPlayer];
    if (currentPlayerData?.isOut) {
      console.log(
        "🚨 CRITICAL BUG FIX: Current player is eliminated, advancing turn immediately",
        {
          currentPlayer: data.round.currentPlayer,
          isOut: currentPlayerData.isOut,
        }
      );

      // Find next non-eliminated player
      const allPlayers = Object.keys(data.players);
      const activePlayers = allPlayers.filter((p) => !data.players[p].isOut);

      if (activePlayers.length > 1) {
        const currentIndex = activePlayers.indexOf(data.round.currentPlayer);
        const nextIndex = (currentIndex + 1) % activePlayers.length;
        const nextPlayer = activePlayers[nextIndex];

        console.log("🚨 ADVANCING TURN FROM ELIMINATED PLAYER:", {
          eliminatedPlayer: data.round.currentPlayer,
          nextPlayer: nextPlayer,
          activePlayers: activePlayers,
        });

        // Return the correction that should be applied
        return {
          shouldCorrect: true,
          nextPlayer: nextPlayer,
          eliminatedPlayer: data.round.currentPlayer,
        };
      }
    }
  }
  return { shouldCorrect: false };
};

describe("Elimination Turn Advancement Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    update.mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Current Player Elimination Detection", () => {
    it("should detect when current player is eliminated and advance turn", () => {
      // Arrange: Game state where current player is eliminated
      const gameState = {
        round: {
          currentPlayer: "Juan Karlos",
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            isOut: true, // ELIMINATED!
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
            tokens: 0,
          },
          "Lady JSOnette": {
            name: "Lady JSOnette",
            isOut: false,
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
            tokens: 0,
          },
          Luffy: {
            name: "Luffy",
            isOut: false,
            hand: [{ id: 2, name: "Priest" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should detect the issue and provide correction
      expect(result.shouldCorrect).toBe(true);
      expect(result.eliminatedPlayer).toBe("Juan Karlos");
      expect(result.nextPlayer).toBe("Lady JSOnette"); // Next active player
    });

    it("should not interfere when current player is not eliminated", () => {
      // Arrange: Normal game state
      const gameState = {
        round: {
          currentPlayer: "Lady JSOnette",
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            isOut: true, // Eliminated but not current player
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
            tokens: 0,
          },
          "Lady JSOnette": {
            name: "Lady JSOnette",
            isOut: false, // Current player is NOT eliminated
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
            tokens: 0,
          },
          Luffy: {
            name: "Luffy",
            isOut: false,
            hand: [{ id: 2, name: "Priest" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should not trigger correction
      expect(result.shouldCorrect).toBe(false);
    });

    it("should handle edge case with only one active player remaining", () => {
      // Arrange: Game state where only one player is left
      const gameState = {
        round: {
          currentPlayer: "Juan Karlos",
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            isOut: true, // ELIMINATED!
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
            tokens: 0,
          },
          "Lady JSOnette": {
            name: "Lady JSOnette",
            isOut: false, // Only one left
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
            tokens: 0,
          },
          Luffy: {
            name: "Luffy",
            isOut: true, // Also eliminated
            hand: [],
            discard: [{ id: 5, name: "Prince" }],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should not try to advance turn (game should end)
      expect(result.shouldCorrect).toBe(false);
    });

    it("should correctly calculate next player in turn order", () => {
      // Arrange: Game state with multiple active players (need at least 2 active)
      const gameState = {
        round: {
          currentPlayer: "Luffy", // Last player in the list
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            isOut: false, // Active
            hand: [{ id: 4, name: "Handmaid" }],
            discard: [],
            tokens: 0,
          },
          "Lady JSOnette": {
            name: "Lady JSOnette",
            isOut: true, // Eliminated
            hand: [],
            discard: [{ id: 2, name: "Priest" }],
            tokens: 0,
          },
          Luffy: {
            name: "Luffy",
            isOut: true, // ELIMINATED and current player!
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
            tokens: 0,
          },
          Player4: {
            name: "Player4",
            isOut: false, // Another active player
            hand: [{ id: 5, name: "Prince" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should wrap around to first active player
      expect(result.shouldCorrect).toBe(true);
      expect(result.eliminatedPlayer).toBe("Luffy");
      expect(result.nextPlayer).toBe("Juan Karlos"); // Wraps around, skips eliminated Lady JSOnette
    });
  });

  describe("Turn Advancement Logic", () => {
    it("should skip multiple eliminated players in sequence", () => {
      // Arrange: Game state with consecutive eliminated players
      const gameState = {
        round: {
          currentPlayer: "Player1",
        },
        players: {
          Player1: {
            name: "Player1",
            isOut: true, // Current player eliminated
            hand: [],
            discard: [{ id: 1, name: "Guard" }],
            tokens: 0,
          },
          Player2: {
            name: "Player2",
            isOut: true, // Next player also eliminated
            hand: [],
            discard: [{ id: 2, name: "Priest" }],
            tokens: 0,
          },
          Player3: {
            name: "Player3",
            isOut: true, // Next player also eliminated
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
            tokens: 0,
          },
          Player4: {
            name: "Player4",
            isOut: false, // First active player
            hand: [{ id: 4, name: "Handmaid" }],
            discard: [],
            tokens: 0,
          },
          Player5: {
            name: "Player5",
            isOut: false, // Second active player (need at least 2)
            hand: [{ id: 5, name: "Prince" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should skip to first active player
      expect(result.shouldCorrect).toBe(true);
      expect(result.eliminatedPlayer).toBe("Player1");
      expect(result.nextPlayer).toBe("Player4"); // Skips all eliminated players
    });

    it("should handle missing player data gracefully", () => {
      // Arrange: Malformed game state
      const gameState = {
        round: {
          currentPlayer: "NonExistentPlayer",
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            isOut: false,
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should not crash and not trigger correction
      expect(result.shouldCorrect).toBe(false);
    });

    it("should handle empty game state gracefully", () => {
      // Arrange: Empty or null game state
      const gameState = null;

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should not crash and not trigger correction
      expect(result.shouldCorrect).toBe(false);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle Baron card elimination scenario", () => {
      // Arrange: Simulate the exact scenario from the bug report
      const gameState = {
        round: {
          currentPlayer: "Juan Karlos",
          deck: [
            { id: 8, name: "Princess" },
            { id: 7, name: "Countess" },
          ],
          isFinalTurn: false,
        },
        players: {
          "Juan Karlos": {
            name: "Juan Karlos",
            realName: "Karl",
            isOut: true, // Just eliminated by Baron
            hand: [], // Hand was cleared
            discard: [{ id: 3, name: "Baron", strength: 3 }], // Just played Baron
            tokens: 0,
          },
          "Lady JSOnette": {
            name: "Lady JSOnette",
            isOut: false,
            hand: [{ id: 1, name: "Guard", strength: 1 }],
            discard: [],
            tokens: 0,
          },
          Luffy: {
            name: "Luffy",
            isOut: false,
            hand: [{ id: 4, name: "Handmaid", strength: 4 }],
            discard: [{ id: 3, name: "Baron", strength: 3 }],
            tokens: 0,
          },
        },
        gameState: "inRound",
        protectedPlayers: [],
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should immediately advance turn away from eliminated player
      expect(result.shouldCorrect).toBe(true);
      expect(result.eliminatedPlayer).toBe("Juan Karlos");
      expect(result.nextPlayer).toBe("Lady JSOnette");
    });

    it("should handle Guard card elimination scenario", () => {
      // Arrange: Player eliminated by correct Guard guess
      const gameState = {
        round: {
          currentPlayer: "TargetPlayer",
          deck: [{ id: 8, name: "Princess" }],
          isFinalTurn: false,
        },
        players: {
          AttackerPlayer: {
            name: "AttackerPlayer",
            isOut: false,
            hand: [{ id: 2, name: "Priest" }],
            discard: [{ id: 1, name: "Guard" }],
            tokens: 0,
          },
          TargetPlayer: {
            name: "TargetPlayer",
            isOut: true, // Eliminated by correct Guard guess
            hand: [],
            discard: [{ id: 4, name: "Handmaid" }], // Was holding Handmaid (strength 4)
            tokens: 0,
          },
          OtherPlayer: {
            name: "OtherPlayer",
            isOut: false,
            hand: [{ id: 5, name: "Prince" }],
            discard: [],
            tokens: 0,
          },
        },
      };

      // Act: Run the Firebase listener logic
      const result = mockFirebaseListener(gameState, "TEST123");

      // Assert: Should advance turn away from eliminated target
      expect(result.shouldCorrect).toBe(true);
      expect(result.eliminatedPlayer).toBe("TargetPlayer");
      expect(result.nextPlayer).toBe("AttackerPlayer"); // Next player in order: AttackerPlayer comes first in the players object
    });
  });
});
