/**
 * ⚡🏰 CHAMBERLAIN EDGE CASES & ERROR HANDLING TESTS 🏰⚡
 * Testing unusual scenarios, error conditions, and boundary cases
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Use vi.hoisted for proper mock setup
const { mockGet, mockUpdate, mockRef, mockPush } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockUpdate: vi.fn(),
  mockRef: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: {},
}));

vi.mock("firebase/database", () => ({
  ref: mockRef,
  get: mockGet,
  update: mockUpdate,
  push: mockPush,
}));

import { applyChamberlainEffect } from "../cardEffects.js";
import { handleCardDiscard, handlePlayerElimination } from "../gamehelpers.js";

describe("⚡ Chamberlain Edge Cases & Error Handling", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockRef.mockClear();
    mockPush.mockClear();

    // Set up default mocks
    mockRef.mockReturnValue({ path: "mock/path" });
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => ({}),
    });
  });

  describe("🚨 Database Connection Issues", () => {
    it("should handle Firebase connection failure during card effect", async () => {
      mockGet.mockRejectedValue(new Error("Firebase connection lost"));

      const result = await applyChamberlainEffect("TEST123", "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Firebase connection lost");
    });

    it("should handle Firebase connection failure during discard", async () => {
      mockUpdate.mockRejectedValue(new Error("Database write failed"));

      const result = await handleCardDiscard("TEST123", "alice", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Database write failed");
    });

    it("should handle Firebase connection failure during elimination", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            chamberlainToken: false, // Set but not activated
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      mockUpdate.mockRejectedValue(new Error("Network timeout"));

      const result = await handlePlayerElimination("TEST123", "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Network timeout");
    });
  });

  describe("🏚️ Corrupted Room Data", () => {
    it("should handle missing room data gracefully", async () => {
      mockGet.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const result = await applyChamberlainEffect("INVALID123", "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Room not found");
    });

    it("should handle room with missing players object", async () => {
      const mockRoomData = {
        // Missing players object
        mode: "premium",
        round: {},
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handleCardDiscard("TEST123", "alice", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Players not found");
    });

    it("should handle player that doesn't exist in room", async () => {
      const mockRoomData = {
        players: {
          bob: { name: "Bob" },
          carol: { name: "Carol" },
          // Alice doesn't exist
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handlePlayerElimination("TEST123", "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Player alice not found");
    });

    it("should handle malformed player data", async () => {
      const mockRoomData = {
        players: {
          alice: null, // Malformed player data
          bob: { name: "Bob" },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handleCardDiscard("TEST123", "alice", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid player data");
    });
  });

  describe("🎯 Invalid Parameters", () => {
    it("should handle null/undefined room code", async () => {
      const result = await applyChamberlainEffect(null, "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid room code");
    });

    it("should handle empty room code", async () => {
      const result = await applyChamberlainEffect("", "alice");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid room code");
    });

    it("should handle null/undefined player nickname", async () => {
      const result = await handlePlayerElimination("TEST123", null);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid player nickname");
    });

    it("should handle empty player nickname", async () => {
      const result = await handleCardDiscard("TEST123", "", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid player nickname");
    });

    it("should handle invalid card data in discard", async () => {
      const result = await handleCardDiscard("TEST123", "alice", null);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid card data");
    });

    it("should handle card with missing properties", async () => {
      const invalidCard = {
        id: 10,
        // Missing name and strength
      };

      const result = await handleCardDiscard("TEST123", "alice", invalidCard);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid card data");
    });
  });

  describe("🎮 Game State Edge Cases", () => {
    it("should handle Chamberlain discard when player already eliminated", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            isOut: true, // Already eliminated
            chamberlainToken: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handleCardDiscard("TEST123", "alice", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/alice/chamberlainToken": false,
        })
      );
    });

    it("should handle elimination when Chamberlain token already activated", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            chamberlainToken: true, // Already activated
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handlePlayerElimination("TEST123", "alice");

      expect(result.success).toBe(true);
      // Should still try to activate (idempotent operation)
      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/alice/chamberlainToken": true,
        })
      );
    });

    it("should handle multiple rapid eliminations", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            chamberlainToken: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Simulate rapid successive eliminations
      const promise1 = handlePlayerElimination("TEST123", "alice");
      const promise2 = handlePlayerElimination("TEST123", "alice");
      const promise3 = handlePlayerElimination("TEST123", "alice");

      const results = await Promise.all([promise1, promise2, promise3]);

      // All should succeed (idempotent)
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe("🎭 Royal Protocol Violations", () => {
    it("should handle Chamberlain effect in normal mode gracefully", async () => {
      const mockRoomData = {
        mode: "normal", // Chamberlain shouldn't exist in normal mode
        players: {
          alice: { name: "Alice" },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyChamberlainEffect("TEST123", "alice");

      // Should still work but may not have intended effect
      expect(result.success).toBe(true);
      expect(result.attackerMessage).toContain("royal decree");
    });

    it("should handle player with extremely long nickname", async () => {
      const longNickname = "a".repeat(1000); // Very long nickname

      const result = await applyChamberlainEffect("TEST123", longNickname);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid player nickname");
    });

    it("should handle special characters in nickname", async () => {
      const mockRoomData = {
        players: {
          "alice@#$%": { name: "Alice@#$%" }, // Special characters
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyChamberlainEffect("TEST123", "alice@#$%");

      expect(result.success).toBe(true);
      expect(result.attackerMessage).toContain("royal decree");
    });
  });

  describe("🕐 Timing Edge Cases", () => {
    it("should handle very slow database responses", async () => {
      // Simulate slow database response
      mockGet.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  exists: () => true,
                  val: () => ({
                    players: { alice: { name: "Alice" } },
                  }),
                }),
              100
            )
          )
      );

      const startTime = Date.now();
      const result = await applyChamberlainEffect("TEST123", "alice");
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeGreaterThan(90); // Should have waited
    });

    it("should handle concurrent card plays", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", chamberlainToken: false },
          bob: { name: "Bob", chamberlainToken: false },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Simulate concurrent Chamberlain plays
      const promise1 = applyChamberlainEffect("TEST123", "alice");
      const promise2 = applyChamberlainEffect("TEST123", "bob");

      const results = await Promise.all([promise1, promise2]);

      // Both should succeed
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe("🎪 Stress Test Scenarios", () => {
    it("should handle maximum number of players with Chamberlain tokens", async () => {
      const players = {};
      for (let i = 0; i < 9; i++) {
        // Maximum 9 players in premium mode
        players[`player${i}`] = {
          name: `Player ${i}`,
          chamberlainToken: true, // All have activated tokens
        };
      }

      const mockRoomData = { players };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyChamberlainEffect("TEST123", "player0");

      expect(result.success).toBe(true);
      expect(result.attackerMessage).toContain("royal decree");
    });

    it("should handle room with no players", async () => {
      const mockRoomData = {
        players: {}, // Empty players object
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await handleCardDiscard("TEST123", "alice", {
        id: 10,
        name: "Chamberlain",
        strength: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Player alice not found");
    });
  });
});
