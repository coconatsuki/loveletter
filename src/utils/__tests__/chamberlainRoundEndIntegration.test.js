/**
 * 🏆💰 CHAMBERLAIN ROUND END INTEGRATION TESTS 💰🏆
 * Testing love token awarding with Chamberlain bonuses
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

import { triggerRoundEnd } from "../roundEndDetection.js";

describe("🏰 Chamberlain Round End Detection Tests", () => {
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

  describe("💰 Single Winner with Chamberlain Bonus", () => {
    it("should award 1 token to winner and 1 token to eliminated Chamberlain holder", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Alice was eliminated with Chamberlain
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
          carol: {
            name: "Carol",
            tokens: 0,
            isOut: true,
            hand: [],
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
        gameStats: {
          currentRound: 3,
          totalRoundsPlayed: 2,
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalled();

      const updateCall = mockUpdate.mock.calls[0][1];

      // Bob (winner) gets 1 token: 1 + 1 = 2
      expect(updateCall["players/bob/tokens"]).toBe(2);

      // Alice (Chamberlain holder) gets 1 token: 2 + 1 = 3
      expect(updateCall["players/alice/tokens"]).toBe(3);

      // Round result should include Chamberlain bonus info
      expect(updateCall.roundResult.chamberlainBonusInfo).toEqual({
        player: "alice",
        playerName: "Alice",
      });
    });

    it("should award multiple Chamberlain bonuses if multiple players have activated tokens", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 1,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Eliminated with Chamberlain
          },
          bob: {
            name: "Bob",
            tokens: 0,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
          carol: {
            name: "Carol",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Also eliminated with Chamberlain
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

      const updateCall = mockUpdate.mock.calls[0][1];

      // Bob (winner) gets 1 token: 0 + 1 = 1
      expect(updateCall["players/bob/tokens"]).toBe(1);

      // Alice gets Chamberlain bonus: 1 + 1 = 2
      expect(updateCall["players/alice/tokens"]).toBe(2);

      // Carol gets Chamberlain bonus: 2 + 1 = 3
      expect(updateCall["players/carol/tokens"]).toBe(3);

      // Should include first Chamberlain bonus in result
      expect(updateCall.roundResult.chamberlainBonusInfo).toEqual({
        player: "alice",
        playerName: "Alice",
      });
    });

    it("should not award Chamberlain bonus if token is false (not activated)", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: false, // Token set but not activated
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

      const updateCall = mockUpdate.mock.calls[0][1];

      // Bob (winner) gets 1 token: 1 + 1 = 2
      expect(updateCall["players/bob/tokens"]).toBe(2);

      // Alice should NOT get Chamberlain bonus (token not activated)
      expect(updateCall["players/alice/tokens"]).toBeUndefined();

      // No Chamberlain bonus info
      expect(updateCall.roundResult.chamberlainBonusInfo).toBe(null);
    });
  });

  describe("🏆 Multiple Winners with Chamberlain Bonus", () => {
    it("should award tokens to winners and Chamberlain holder in deck empty scenario", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 1,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Eliminated with Chamberlain
          },
          bob: {
            name: "Bob",
            tokens: 2,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
          carol: {
            name: "Carol",
            tokens: 0,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }], // Tie!
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [], // Deck empty
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

      const updateCall = mockUpdate.mock.calls[0][1];

      // Both winners get 1 token each
      expect(updateCall["players/bob/tokens"]).toBe(3); // 2 + 1
      expect(updateCall["players/carol/tokens"]).toBe(1); // 0 + 1

      // Alice (Chamberlain holder) gets bonus: 1 + 1 = 2
      expect(updateCall["players/alice/tokens"]).toBe(2);

      // Should include Chamberlain bonus info
      expect(updateCall.roundResult.chamberlainBonusInfo).toEqual({
        player: "alice",
        playerName: "Alice",
      });
    });
  });

  describe("🚫 No Chamberlain Bonus Scenarios", () => {
    it("should not award Chamberlain bonus in normal mode", async () => {
      const mockRoomData = {
        mode: "normal", // Normal mode
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            chamberlainToken: true, // Would get bonus in premium mode
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

      const updateCall = mockUpdate.mock.calls[0][1];

      // Bob (winner) gets 1 token: 1 + 1 = 2
      expect(updateCall["players/bob/tokens"]).toBe(2);

      // Alice should NOT get Chamberlain bonus (normal mode)
      expect(updateCall["players/alice/tokens"]).toBeUndefined();

      // No Chamberlain bonus info
      expect(updateCall.roundResult.chamberlainBonusInfo).toBe(null);
    });

    it("should not award bonus if no players have activated Chamberlain tokens", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
            // No chamberlainToken
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

      const updateCall = mockUpdate.mock.calls[0][1];

      // Only Bob (winner) gets 1 token
      expect(updateCall["players/bob/tokens"]).toBe(2);

      // No Chamberlain bonus info
      expect(updateCall.roundResult.chamberlainBonusInfo).toBe(null);
    });
  });

  describe("🔍 Edge Cases", () => {
    it("should handle missing players object gracefully", async () => {
      const mockRoomData = {
        mode: "premium",
        // Missing players object
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

      expect(result.success).toBe(false);
      expect(result.error).toContain("No players found");
    });

    it("should handle player with chamberlainToken but missing tokens property", async () => {
      const mockRoomData = {
        mode: "premium",
        players: {
          alice: {
            name: "Alice",
            // Missing tokens property
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

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      const updateCall = mockUpdate.mock.calls[0][1];

      // Alice should get 1 token (0 + 1 = 1, treating missing as 0)
      expect(updateCall["players/alice/tokens"]).toBe(1);

      // Bob gets normal winner token
      expect(updateCall["players/bob/tokens"]).toBe(2);
    });
  });
});
