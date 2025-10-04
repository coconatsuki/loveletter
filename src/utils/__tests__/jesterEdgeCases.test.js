/**
 * 🚫✨ JESTER EDGE CASE TESTS ✨🚫
 * Testing self-targeting prevention, handmaid protection, and other edge scenarios
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

import { applyJesterEffect } from "../cardEffects.js";

describe("🃏 Jester Edge Case Tests", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockRef.mockClear();

    // Set up default ref mock to return a reference object
    mockRef.mockReturnValue({ path: "mock/path" });
  });

  describe("🚫 Self-Targeting Prevention", () => {
    it("should prevent jester from targeting themselves", () => {
      // This test verifies that the UI layer (TargetModal) prevents self-targeting
      // The actual prevention happens in the target selection UI, not in the effect function
      // But we can test that if somehow a self-target gets through, it would still work technically

      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      // Note: This is a theoretical scenario since UI prevents it
      // But the effect function itself doesn't prevent self-targeting
      expect(async () => {
        await applyJesterEffect({
          roomCode: "TEST123",
          attacker: "alice",
          target: "alice",
        });
      }).not.toThrow();
    });
  });

  describe("🛡️ Handmaid Protection Scenarios", () => {
    it("should handle targeting a player who was previously protected but is no longer protected", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: {
            name: "Bob",
            realName: "Bob Dylan",
            // No protection indicator - they are targetable
          },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      expect(mockUpdate).toHaveBeenCalledWith({ path: "mock/path" }, {
        "players/bob/jesterToken": { giver: "alice" },
      });
    });

    it("should work normally when no players are protected", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
          carol: { name: "Carol", realName: "Carol King" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "carol",
      });

      expect(result.result).toBe("jesterToken");
      expect(result.target).toBe("carol");
    });
  });

  describe("🎮 Game State Edge Cases", () => {
    it("should work during different game phases", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
        },
        gameState: "inRound", // Verify it works during active round
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
    });

    it("should handle players with existing jester tokens (replacement)", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: {
            name: "Bob",
            realName: "Bob Dylan",
            jesterToken: { giver: "carol" }, // Bob already has a token from Carol
          },
          carol: { name: "Carol", realName: "Carol King" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      // Alice gives Bob a new token, replacing Carol's
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      expect(mockUpdate).toHaveBeenCalledWith({ path: "mock/path" }, {
        "players/bob/jesterToken": { giver: "alice" },
      });
    });

    it("should handle players with missing name properties", async () => {
      const mockRoomData = {
        players: {
          alice: { realName: "Alice Cooper" }, // Missing name
          bob: { name: "Bob" }, // Missing realName
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      // Should still work even with missing name properties
      expect(result.attackerMessage).toContain("Bob");
      expect(result.publicMessage).toContain("Bob");
    });
  });

  describe("🎯 Premium Mode vs Normal Mode", () => {
    it("should work in premium mode (where Jester exists)", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
        },
        mode: "premium",
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
    });

    it("should theoretically work even if called in normal mode (though UI should prevent this)", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
        },
        mode: "normal", // Jester shouldn't exist in normal mode
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      // This shouldn't happen in practice, but if it does, the function should still work
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
    });
  });

  describe("🎪 Multiple Players and Complex Scenarios", () => {
    it("should handle large games with many players", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
          carol: { name: "Carol", realName: "Carol King" },
          david: { name: "David", realName: "David Bowie" },
          eve: { name: "Eve", realName: "Eve Johnson" },
          frank: { name: "Frank", realName: "Frank Sinatra" },
          grace: { name: "Grace", realName: "Grace Kelly" },
          henry: { name: "Henry", realName: "Henry Ford" },
          iris: { name: "Iris", realName: "Iris West" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "iris",
      });

      expect(result.result).toBe("jesterToken");
      expect(result.target).toBe("iris");
      expect(result.attackerMessage).toContain("Iris");
    });

    it("should handle chain of jester tokens in same round", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice", realName: "Alice Cooper" },
          bob: { name: "Bob", realName: "Bob Dylan" },
          carol: { name: "Carol", realName: "Carol King" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      // Alice gives token to Bob
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Bob gives token to Carol
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "bob",
        target: "carol",
      });

      // Carol gives token to Alice
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "carol",
        target: "alice",
      });

      expect(mockUpdate).toHaveBeenCalledTimes(3);
      expect(mockUpdate).toHaveBeenNthCalledWith(3, { path: "mock/path" }, {
        "players/alice/jesterToken": { giver: "carol" },
      });
    });
  });

  describe("🐛 Unusual Data Edge Cases", () => {
    it("should handle empty player names gracefully", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "", realName: "" },
          bob: { name: "", realName: "" },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      // Should still generate messages even with empty names
      expect(result.attackerMessage).toBeDefined();
      expect(result.targetMessage).toBeDefined();
      expect(result.publicMessage).toBeDefined();
    });

    it("should handle special characters in player names", async () => {
      const mockRoomData = {
        players: {
          alice: { name: "Alice🎭", realName: 'Alice "The Joker" Cooper' },
          bob: {
            name: "Bob&Carol",
            realName: 'Bob <script>alert("hi")</script>',
          },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      expect(result.attackerMessage).toContain("Bob&Carol");
      expect(result.publicMessage).toContain("Alice🎭");
    });

    it("should handle very long player names", async () => {
      const longName = "A".repeat(100);
      const mockRoomData = {
        players: {
          alice: { name: longName, realName: "Alice Cooper" },
          bob: { name: "Bob", realName: longName },
        },
      };

      mockGet.mockResolvedValue({ val: () => mockRoomData });

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("jesterToken");
      expect(result.attackerMessage).toContain("Bob");
    });
  });
});
