import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRoundEndConditions,
  triggerRoundEnd,
  logRoundEndCheck,
} from "../roundEndDetection";
import { ref, get, update } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

describe("Round End Detection", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock ref to return a consistent reference object
    ref.mockReturnValue({ _path: "mock-ref" });
  });

  describe("checkRoundEndConditions", () => {
    it("should detect last player standing (Case 1)", async () => {
      const mockRoomData = {
        players: {
          alice: { isOut: false, hand: [{ id: 8, strength: 8 }] },
          bob: { isOut: true, hand: [] },
          charlie: { isOut: true, hand: [] },
        },
        round: {
          deck: [{ id: 1, strength: 1 }],
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result).toEqual({
        isRoundEnd: true,
        type: "lastPlayerStanding",
        winner: "alice",
        winnerName: "alice",
        activePlayers: ["alice"],
        eliminatedPlayers: ["bob", "charlie"],
      });
    });

    it("should detect deck empty with single highest card (Case 2)", async () => {
      const mockRoomData = {
        players: {
          alice: { isOut: false, hand: [{ id: 8, strength: 8 }] },
          bob: { isOut: false, hand: [{ id: 5, strength: 5 }] },
          charlie: { isOut: false, hand: [{ id: 3, strength: 3 }] },
        },
        round: {
          deck: [], // Empty deck
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result).toEqual({
        isRoundEnd: true,
        type: "deckEmpty",
        winners: ["alice"],
        winnerNames: ["alice"],
        finalStandings: [
          { player: "alice", strength: 8, hand: [{ id: 8, strength: 8 }] },
          { player: "bob", strength: 5, hand: [{ id: 5, strength: 5 }] },
          { player: "charlie", strength: 3, hand: [{ id: 3, strength: 3 }] },
        ],
      });
    });

    it("should detect deck empty with multiple tied winners", async () => {
      const mockRoomData = {
        players: {
          alice: { isOut: false, hand: [{ id: 8, strength: 8 }] },
          bob: { isOut: false, hand: [{ id: 8, strength: 8 }] },
          charlie: { isOut: false, hand: [{ id: 3, strength: 3 }] },
        },
        round: {
          deck: [], // Empty deck
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result).toEqual({
        isRoundEnd: true,
        type: "deckEmpty",
        winners: ["alice", "bob"],
        winnerNames: ["alice", "bob"],
        finalStandings: [
          { player: "alice", strength: 8, hand: [{ id: 8, strength: 8 }] },
          { player: "bob", strength: 8, hand: [{ id: 8, strength: 8 }] },
          { player: "charlie", strength: 3, hand: [{ id: 3, strength: 3 }] },
        ],
      });
    });

    it("should return false when round continues", async () => {
      const mockRoomData = {
        players: {
          alice: { isOut: false, hand: [{ id: 5, strength: 5 }] },
          bob: { isOut: false, hand: [{ id: 3, strength: 3 }] },
          charlie: { isOut: true, hand: [] },
        },
        round: {
          deck: [
            { id: 1, strength: 1 },
            { id: 2, strength: 2 },
          ], // Still has cards
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result).toEqual({
        isRoundEnd: false,
        activePlayers: ["alice", "bob"],
        eliminatedPlayers: ["charlie"],
      });
    });

    it("should handle missing room data gracefully", async () => {
      get.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const result = await checkRoundEndConditions("INVALID");

      expect(result).toEqual({
        isRoundEnd: false,
        error: "Room not found",
      });
    });
  });

  describe("triggerRoundEnd", () => {
    it("should award tokens and update game state for last player standing", async () => {
      const mockRoomData = {
        players: {
          alice: { tokens: 2, isOut: false, name: "Alice" },
          bob: { tokens: 1, isOut: true, name: "Bob" },
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
        round: {
          hiddenCard: { id: 4, strength: 4 },
        },
      };

      // Mock checkRoundEndConditions to return round end
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // First call in checkRoundEndConditions
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // Second call in triggerRoundEnd

      // Mock round end detection
      vi.doMock("../roundEndDetection", async () => {
        const actual = await vi.importActual("../roundEndDetection");
        return {
          ...actual,
          checkRoundEndConditions: vi.fn().mockResolvedValue({
            isRoundEnd: true,
            type: "lastPlayerStanding",
            winner: "alice",
            winnerName: "Alice",
          }),
        };
      });

      update.mockResolvedValue();

      const result = await triggerRoundEnd("TEST123");

      expect(update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          gameState: "roundScoring",
          "players/alice/tokens": 3, // 2 + 1
          roundResult: expect.objectContaining({
            type: "lastPlayerStanding",
            winner: "alice",
            winners: ["alice"],
            winnerNames: ["Alice"],
            roundNumber: 3,
          }),
          "gameStats/lastRoundWinner": "alice",
          "gameStats/totalRoundsPlayed": 3,
        })
      );

      expect(result.success).toBe(true);
    });

    it("should award tokens to multiple winners for deck empty tie", async () => {
      const mockRoomData = {
        players: {
          alice: {
            tokens: 1,
            isOut: false,
            name: "Alice",
            hand: [{ id: 8, strength: 8 }],
          },
          bob: {
            tokens: 2,
            isOut: false,
            name: "Bob",
            hand: [{ id: 8, strength: 8 }],
          },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
        round: {
          deck: [], // Empty deck for Case 2
          hiddenCard: { id: 7, strength: 7 },
        },
      };

      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // First call in checkRoundEndConditions
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // Second call in triggerRoundEnd

      // Mock round end detection for tie
      vi.doMock("../roundEndDetection", async () => {
        const actual = await vi.importActual("../roundEndDetection");
        return {
          ...actual,
          checkRoundEndConditions: vi.fn().mockResolvedValue({
            isRoundEnd: true,
            type: "deckEmpty",
            winners: ["alice", "bob"],
            winnerNames: ["Alice", "Bob"],
          }),
        };
      });

      update.mockResolvedValue();

      const result = await triggerRoundEnd("TEST123");

      expect(update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          gameState: "roundScoring",
          "players/alice/tokens": 2, // 1 + 1
          "players/bob/tokens": 3, // 2 + 1
          roundResult: expect.objectContaining({
            type: "deckEmpty",
            winners: ["alice", "bob"],
            winnerNames: ["Alice", "Bob"],
          }),
        })
      );

      expect(result.success).toBe(true);
    });

    it("should handle Firebase errors gracefully", async () => {
      const mockRoomData = {
        players: {
          alice: { tokens: 2, isOut: false, name: "Alice" },
          bob: { tokens: 1, isOut: true, name: "Bob" },
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
        round: {
          hiddenCard: { id: 4, strength: 4 },
        },
      };

      // Mock successful checkRoundEndConditions but failed update
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // First call in checkRoundEndConditions
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      }); // Second call in triggerRoundEnd

      update.mockRejectedValue(new Error("Firebase connection failed"));

      const result = await triggerRoundEnd("TEST123");

      expect(result).toEqual({
        success: false,
        error: "Firebase connection failed",
      });
    });

    it("should not trigger if round hasn't ended", async () => {
      const mockRoomData = {
        players: {
          alice: { tokens: 2, isOut: false, name: "Alice" },
          bob: { tokens: 1, isOut: false, name: "Bob" }, // Both alive
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
        round: {
          deck: [{ id: 1, strength: 1 }], // Still has cards
          hiddenCard: { id: 4, strength: 4 },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result).toEqual({
        success: false,
        message: "Round has not ended yet",
      });

      expect(update).not.toHaveBeenCalled();
    });
  });

  describe("logRoundEndCheck", () => {
    it("should trigger round end when detected", async () => {
      // Mock console.log to avoid spam
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // Mock room data that will trigger round end (last player standing)
      const mockRoomData = {
        players: {
          alice: { tokens: 2, isOut: false, name: "Alice" },
          bob: { tokens: 1, isOut: true, name: "Bob" },
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
        round: {
          hiddenCard: { id: 4, strength: 4 },
        },
      };

      // First call for checkRoundEndConditions, second for triggerRoundEnd
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      });
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await logRoundEndCheck("GUARD_ELIMINATION", "TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        "🔍 ROUND END CHECK: GUARD_ELIMINATION",
        expect.objectContaining({ roomCode: "TEST123" })
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "🎯 ROUND END DETECTED - TRIGGERING: GUARD_ELIMINATION"
      );

      consoleSpy.mockRestore();
    });

    it("should not trigger when round continues", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // Mock room data that will NOT trigger round end (multiple players, deck has cards)
      const mockRoomData = {
        players: {
          alice: { tokens: 2, isOut: false, name: "Alice" },
          bob: { tokens: 1, isOut: false, name: "Bob" }, // Both alive
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
        round: {
          deck: [{ id: 1, strength: 1 }], // Still has cards
          hiddenCard: { id: 4, strength: 4 },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await logRoundEndCheck("TURN_COMPLETION", "TEST123");

      expect(result.isRoundEnd).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "🔍 ROUND END CHECK: TURN_COMPLETION",
        expect.objectContaining({ roomCode: "TEST123" })
      );
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("🎯 ROUND END DETECTED")
      );

      consoleSpy.mockRestore();
    });
  });
});
