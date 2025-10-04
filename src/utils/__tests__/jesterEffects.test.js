/**
 * 🃏✨ COMPREHENSIVE JESTER CARD TESTS ✨🃏
 * Testing all Jester card behaviors and scenarios
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Use vi.hoisted for proper mock setup
const { mockGet, mockUpdate } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockUpdate: vi.fn(),
}));

// Mock Firebase imports
vi.mock("../firebase.js", () => ({
  db: {},
}));

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: mockGet,
  update: mockUpdate,
}));

// Import after mocking
import { applyJesterEffect } from "../cardEffects.js";

// Mock Firebase data
const mockFirebaseData = {
  rooms: {
    TEST123: {
      players: {
        alice: {
          name: "Alice",
          realName: "Alice Cooper",
          hand: [{ id: 0, name: "Jester" }],
          tokens: 0,
        },
        bob: {
          name: "Bob",
          realName: "Bob Dylan",
          hand: [{ id: 2, name: "Priest" }],
          tokens: 0,
        },
        carol: {
          name: "Carol",
          realName: "Carol King",
          hand: [{ id: 3, name: "Baron" }],
          tokens: 1,
        },
      },
    },
  },
};

describe("🃏 Jester Card Effect Tests", () => {
  beforeEach(() => {
    // Reset mocks and data before each test
    mockGet.mockClear();
    mockUpdate.mockClear();

    // Setup mock return values
    mockGet.mockReturnValue(
      Promise.resolve({
        val: () => mockFirebaseData.rooms["TEST123"],
      })
    );
    mockUpdate.mockReturnValue(Promise.resolve());

    // Reset player data
    mockFirebaseData.rooms["TEST123"].players.alice.jesterToken = null;
    mockFirebaseData.rooms["TEST123"].players.bob.jesterToken = null;
    mockFirebaseData.rooms["TEST123"].players.carol.jesterToken = null;
  });

  describe("✅ Basic Jester Effect Functionality", () => {
    it("should successfully apply Jester effect to target", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Verify result structure
      expect(result.result).toBe("jesterToken");
      expect(result.attacker).toBe("alice");
      expect(result.target).toBe("bob");

      // Verify messages contain expected content
      expect(result.attackerMessage).toContain("Fool's Favor");
      expect(result.attackerMessage).toContain("Bob");
      expect(result.targetMessage).toContain("Jester dances");
      expect(result.publicMessage).toContain("handed the");

      // Verify Firebase update was called with correct data
      expect(mockUpdate).toHaveBeenCalledWith(undefined, {
        "players/bob/jesterToken": { giver: "alice" },
      });
    });

    it("should handle different target names correctly", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "bob",
        target: "carol",
      });

      expect(result.result).toBe("jesterToken");
      expect(result.attacker).toBe("bob");
      expect(result.target).toBe("carol");
      expect(result.publicMessage).toContain("Carol");

      expect(mockUpdate).toHaveBeenCalledWith(undefined, {
        "players/carol/jesterToken": { giver: "bob" },
      });
    });
  });

  describe("❌ Error Handling", () => {
    it("should return error when room data is missing", async () => {
      mockGet.mockReturnValue(Promise.resolve({ val: () => null }));

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("Target player not found");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should return error when target player does not exist", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "invalidPlayer",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("Target player not found");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should return error when attacker player does not exist", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "invalidPlayer",
        target: "bob",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("Player not found");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should return error when players object is missing", async () => {
      mockGet.mockReturnValue(
        Promise.resolve({
          val: () => ({ someOtherData: true }),
        })
      );

      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("Target player not found");
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("🎭 Narrative Message Content", () => {
    it("should include all required emoji and medieval flavor in attacker message", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      const attackerMsg = result.attackerMessage;
      expect(attackerMsg).toContain("🎭");
      expect(attackerMsg).toContain("✨");
      expect(attackerMsg).toContain("🎪");
      expect(attackerMsg).toContain("💎");
      expect(attackerMsg).toContain("👑");
      expect(attackerMsg).toContain("💕");
      expect(attackerMsg).toContain("laugh and a bow");
      expect(attackerMsg).toContain("Fool's Favor");
      expect(attackerMsg).toContain("Princess");
    });

    it("should include all required emoji and medieval flavor in target message", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      const targetMsg = result.targetMessage;
      expect(targetMsg).toContain("🃏");
      expect(targetMsg).toContain("🎪");
      expect(targetMsg).toContain("✨");
      expect(targetMsg).toContain("💍");
      expect(targetMsg).toContain("🎭");
      expect(targetMsg).toContain("😊");
      expect(targetMsg).toContain("Jester dances");
      expect(targetMsg).toContain("shiny charm");
      expect(targetMsg).toContain("Princess will surely smile");
    });

    it("should include all required emoji and medieval flavor in public message", async () => {
      const result = await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      const publicMsg = result.publicMessage;
      expect(publicMsg).toContain("🎭");
      expect(publicMsg).toContain("🎪");
      expect(publicMsg).toContain("🃏");
      expect(publicMsg).toContain("✨");
      expect(publicMsg).toContain("😄");
      expect(publicMsg).toContain("handed the");
      expect(publicMsg).toContain("court laughs");
      expect(publicMsg).toContain("gift, or a trick");
    });
  });

  describe("🎯 Multiple Jester Scenarios", () => {
    it("should handle multiple Jester tokens to different players", async () => {
      // Alice gives to Bob
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Carol gives to Alice
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "carol",
        target: "alice",
      });

      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockUpdate).toHaveBeenNthCalledWith(1, undefined, {
        "players/bob/jesterToken": { giver: "alice" },
      });
      expect(mockUpdate).toHaveBeenNthCalledWith(2, undefined, {
        "players/alice/jesterToken": { giver: "carol" },
      });
    });

    it("should handle token replacement when same target receives multiple tokens", async () => {
      // Alice gives to Bob
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Carol gives to Bob (should overwrite Alice's token)
      await applyJesterEffect({
        roomCode: "TEST123",
        attacker: "carol",
        target: "bob",
      });

      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockUpdate).toHaveBeenNthCalledWith(2, undefined, {
        "players/bob/jesterToken": { giver: "carol" },
      });
    });
  });
});
