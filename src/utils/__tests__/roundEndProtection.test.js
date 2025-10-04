/**
 * 🛡️ ROUND END PROTECTION TEST 🛡️
 * Testing the new protection mechanism against double triggers
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

describe("🛡️ Round End Protection Mechanism", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockRef.mockClear();

    // Set up default mocks
    mockRef.mockReturnValue({ path: "mock/path" });
  });

  describe("🚧 Double Trigger Prevention", () => {
    it("should prevent double round end triggers with protection flag", async () => {
      const mockRoomData = {
        mode: "premium",
        gameState: "inProgress", // Not yet in round scoring
        roundEndInProgress: false, // No protection flag yet
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

      // First call should succeed - mock both get calls (protection check + main check)
      mockGet
        .mockResolvedValueOnce({
          exists: () => true,
          val: () => mockRoomData,
        })
        .mockResolvedValueOnce({
          exists: () => true,
          val: () => mockRoomData,
        });

      const result1 = await triggerRoundEnd("TEST123");
      expect(result1.success).toBe(true);

      // Verify protection flag was set in first update call
      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        { roundEndInProgress: true }
      );

      // Second call should be blocked by protection
      const protectedRoomData = {
        ...mockRoomData,
        roundEndInProgress: true, // Protection flag now set
      };

      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => protectedRoomData,
      });

      const result2 = await triggerRoundEnd("TEST123");
      expect(result2.success).toBe(false);
      expect(result2.message).toBe("Round end already in progress");
    });

    it("should prevent trigger if already in roundScoring state", async () => {
      const mockRoomData = {
        mode: "premium",
        gameState: "roundScoring", // Already in round scoring state
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
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
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Round end already triggered");

      // Should not have made any updates
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should clear protection flag on error", async () => {
      const mockRoomData = {
        mode: "premium",
        gameState: "inProgress",
        roundEndInProgress: false,
        players: {
          alice: {
            name: "Alice",
            tokens: 1,
            isOut: true,
            hand: [],
          },
          bob: {
            name: "Bob",
            tokens: 0,
            isOut: false,
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
        },
        round: {
          currentPlayer: "bob",
          deck: [],
          hiddenCard: { id: 1, name: "Guard" },
        },
      };

      // Mock initial get to succeed
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Mock the final update to fail (simulating an error)
      mockUpdate.mockImplementation((ref, data) => {
        if (data.gameState === "roundScoring") {
          throw new Error("Database error during final update");
        }
        return Promise.resolve();
      });

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Database error during final update");

      // Should have attempted to clear protection flag
      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        { roundEndInProgress: false }
      );
    });
  });

  describe("🎯 Baron Elimination Scenario", () => {
    it("should handle Baron elimination with Chamberlain token without double triggering", async () => {
      // Clear any previous mocks
      mockUpdate.mockClear();
      mockGet.mockClear();

      const mockRoomData = {
        mode: "premium",
        gameState: "inProgress",
        roundEndInProgress: false,
        players: {
          AAA: {
            name: "AAA",
            tokens: 2,
            isOut: true, // Eliminated by Baron
            hand: [],
            chamberlainToken: true, // Had Chamberlain and was eliminated
          },
          BBB: {
            name: "BBB",
            tokens: 1,
            isOut: false, // Winner
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
        },
        round: {
          currentPlayer: "BBB",
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

      // Reset update mock to not throw errors
      mockUpdate.mockReset();
      mockUpdate.mockResolvedValue();

      const result = await triggerRoundEnd("TEST123");

      expect(result.success).toBe(true);

      // Verify update was called
      expect(mockUpdate).toHaveBeenCalled();

      const finalUpdateCall = mockUpdate.mock.calls.find(
        (call) => call[1].gameState === "roundScoring"
      );

      expect(finalUpdateCall).toBeTruthy();
      const updateData = finalUpdateCall[1];

      // Check that both BBB (winner) and AAA (Chamberlain holder) get tokens
      expect(updateData["players/BBB/tokens"]).toBe(2); // 1 + 1 = 2
      expect(updateData["players/AAA/tokens"]).toBe(3); // 2 + 1 = 3

      // Check that Chamberlain tokens are cleared
      expect(updateData["players/AAA/chamberlainToken"]).toBe(false);
      expect(updateData["players/BBB/chamberlainToken"]).toBe(false);

      // Check that protection flag is cleared
      expect(updateData.roundEndInProgress).toBe(false);

      // Check that game state is set to round scoring
      expect(updateData.gameState).toBe("roundScoring");
    });
  });
});
