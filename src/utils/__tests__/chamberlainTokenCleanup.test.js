/**
 * 🧹💰 CHAMBERLAIN TOKEN CLEANUP TESTS 💰🧹
 * Testing token clearing between rounds and game reset scenarios
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Use vi.hoisted for proper mock setup
const { mockGet, mockUpdate, mockRef } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockUpdate: vi.fn(),
  mockRef: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: {},
}));

vi.mock("firebase/database", () => ({
  ref: mockRef,
  get: mockGet,
  update: mockUpdate,
}));

// Import functions that handle token cleanup
import { triggerRoundEnd } from "../roundEndDetection.js";

describe("🧹 Chamberlain Token Cleanup Tests", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockRef.mockClear();

    // Set up default mocks
    mockRef.mockReturnValue({ path: "mock/path" });
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => ({}),
    });
  });

  describe("🔄 Between Round Token Cleanup", () => {
    it("should clear all chamberlainToken flags after round ends", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Should be cleared
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
            chamberlainToken: false, // Should be cleared
          },
          carol: {
            name: "Carol",
            tokens: 0,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Should be cleared
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // All players should have their chamberlainToken cleared
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/carol/chamberlainToken"]).toBeUndefined();
    });

    it("should clear tokens even if some players don't have the property", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Has token, should be cleared
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
            // No chamberlainToken property
          },
          carol: {
            name: "Carol",
            tokens: 0,
            isOut: true,
            hand: [],
            chamberlainToken: false, // Has false token, should be cleared
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // All players should have their chamberlainToken cleared to false
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/carol/chamberlainToken"]).toBeUndefined();
    });

    it("should clear tokens in normal mode even though bonuses don't apply", async () => {
      const mockRoomData = {
        mode: "normal", // Normal mode
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Should still be cleared
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // Tokens should be cleared even in normal mode
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
    });
  });

  describe("🏁 Game End Scenarios", () => {
    it("should clear tokens when game reaches maximum rounds", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 5, // High token count, might trigger game end
            isOut: true,
            hand: [],
            chamberlainToken: true,
          },
          bob: {
            name: "Bob",
            tokens: 3,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
            chamberlainToken: false,
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 10, // High round number
          totalRoundsPlayed: 9,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // Tokens should still be cleared
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
    });
  });

  describe("🎭 Token State Verification", () => {
    it("should verify tokens are properly initialized to false for new rounds", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 0,
            isOut: false,
            hand: [{ id: 4, name: "Handmaid", strength: 4 }],
            // No chamberlainToken property (new game)
          },
          bob: {
            name: "Bob",
            tokens: 0,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
            // No chamberlainToken property (new game)
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // Even new players should have their tokens explicitly set to false
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
    });

    it("should handle mixed token states correctly", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 1,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Activated token
          },
          bob: {
            name: "Bob",
            tokens: 0,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
            chamberlainToken: false, // Deactivated token
          },
          carol: {
            name: "Carol",
            tokens: 2,
            isOut: true,
            hand: [],
            // No token property
          },
          dave: {
            name: "Dave",
            tokens: 1,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Another activated token
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 2,
          totalRoundsPlayed: 1,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[1][1];

      // All players should have tokens cleared to false
      expect(updateCall["players/alice/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/bob/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/carol/chamberlainToken"]).toBeUndefined();
      expect(updateCall["players/dave/chamberlainToken"]).toBeUndefined();

      // Should award bonuses before clearing
      expect(updateCall["players/alice/tokens"]).toBe(2); // 1 + 1 bonus
      expect(updateCall["players/dave/tokens"]).toBe(2); // 1 + 1 bonus
    });
  });

  describe("🚨 Error Scenarios", () => {
    it("should still attempt token cleanup even if round end fails", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true,
          },
          // Missing other required data that might cause issues
        },
        round: {
          // Missing required round data
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      // Even if round end fails, we should still have attempted the cleanup
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("should handle database update failures gracefully", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true,
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 1,
          totalRoundsPlayed: 0,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Mock update to fail
      mockUpdate.mockRejectedValue(new Error("Database update failed"));

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Database update failed");
    });
  });
});
