/**
 * 🏰💰 COMPREHENSIVE CHAMBERLAIN CARD TESTS 💰🏰
 * Testing all Chamberlain card behaviors and scenarios
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
import { applyChamberlainEffect } from "../cardEffects.js";
import { handleCardDiscard, handlePlayerElimination } from "../gamehelpers.js";

// Mock Firebase data
const mockFirebaseData = {
  rooms: {
    TEST123: {
      mode: "premium",
      players: {
        alice: {
          name: "Alice",
          realName: "Alice Cooper",
          hand: [{ id: 10, name: "Chamberlain" }],
          tokens: 0,
          discard: [],
        },
        bob: {
          name: "Bob",
          realName: "Bob Dylan",
          hand: [{ id: 1, name: "Guard" }],
          tokens: 0,
          discard: [],
        },
        carol: {
          name: "Carol",
          realName: "Carol King",
          hand: [{ id: 3, name: "Baron" }],
          tokens: 1,
          discard: [],
        },
      },
      round: {
        currentPlayer: "alice",
        deck: [
          { id: 2, name: "Priest" },
          { id: 4, name: "Handmaid" },
        ],
      },
    },
  },
};

describe("🏰 Chamberlain Card Effects Tests", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();

    // Default successful Firebase response
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => mockFirebaseData.rooms.TEST123,
    });
  });

  describe("💰 Basic Chamberlain Effect", () => {
    it("should return royal influence message when Chamberlain is played", async () => {
      const result = await applyChamberlainEffect({
        roomCode: "TEST123",
        attacker: "alice",
      });

      expect(result).toEqual({
        result: "chamberlainInfluence",
        attacker: "alice",
        attackerMessage: expect.stringContaining("Royal Chamberlain"),
        publicMessage: expect.stringContaining("Alice"),
      });

      expect(result.attackerMessage).toContain("keeper of golden keys");
      expect(result.attackerMessage).toContain("misfortune befall you");
      expect(result.publicMessage).toContain("powerful allies ensure victory");
    });

    it("should handle missing player gracefully", async () => {
      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => ({
          ...mockFirebaseData.rooms.TEST123,
          players: {
            bob: mockFirebaseData.rooms.TEST123.players.bob,
          },
        }),
      });

      const result = await applyChamberlainEffect({
        roomCode: "TEST123",
        attacker: "alice", // Alice doesn't exist
      });

      expect(result).toEqual({
        result: "error",
        message: "Attacker player not found",
      });
    });

    it("should handle room not found", async () => {
      mockGet.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const result = await applyChamberlainEffect({
        roomCode: "NONEXISTENT",
        attacker: "alice",
      });

      expect(result).toEqual({
        result: "error",
        message: "Attacker player not found",
      });
    });
  });

  describe("🗝️ Chamberlain Token Setting (Discard Detection)", () => {
    it("should set chamberlainToken to false when Chamberlain is discarded in premium mode", () => {
      const chamberlainCard = { id: 10, name: "Chamberlain" };
      const baseUpdates = {
        "players/alice/hand": [{ id: 2, name: "Priest" }],
        "players/alice/discard": [chamberlainCard],
      };

      const result = handleCardDiscard({
        roomCode: "TEST123",
        playerName: "alice",
        card: chamberlainCard,
        gameMode: "premium",
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual({
        ...baseUpdates,
        "players/alice/chamberlainToken": false,
      });
    });

    it("should not set chamberlainToken in normal mode", () => {
      const chamberlainCard = { id: 10, name: "Chamberlain" };
      const baseUpdates = {
        "players/alice/hand": [{ id: 2, name: "Priest" }],
        "players/alice/discard": [chamberlainCard],
      };

      const result = handleCardDiscard({
        roomCode: "TEST123",
        playerName: "alice",
        card: chamberlainCard,
        gameMode: "normal",
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual(baseUpdates);
      expect(result["players/alice/chamberlainToken"]).toBeUndefined();
    });

    it("should not affect non-Chamberlain cards", () => {
      const guardCard = { id: 1, name: "Guard" };
      const baseUpdates = {
        "players/alice/hand": [{ id: 2, name: "Priest" }],
        "players/alice/discard": [guardCard],
      };

      const result = handleCardDiscard({
        roomCode: "TEST123",
        playerName: "alice",
        card: guardCard,
        gameMode: "premium",
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual(baseUpdates);
      expect(result["players/alice/chamberlainToken"]).toBeUndefined();
    });
  });

  describe("⚔️ Chamberlain Token Activation (Elimination Detection)", () => {
    it("should activate chamberlainToken when player with token is eliminated", () => {
      const playerData = {
        name: "Alice",
        tokens: 2,
        chamberlainToken: false, // Player has the token ready
        hand: [{ id: 2, name: "Priest" }],
        isOut: false,
      };

      const baseUpdates = {
        "round/currentPlayer": "bob",
      };

      const result = handlePlayerElimination({
        roomCode: "TEST123",
        playerName: "alice",
        gameMode: "premium",
        currentPlayerData: playerData,
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual({
        ...baseUpdates,
        "players/alice/isOut": true,
        "players/alice/chamberlainToken": true, // Activated!
      });
    });

    it("should not activate chamberlainToken if player doesn't have it", () => {
      const playerData = {
        name: "Alice",
        tokens: 2,
        // No chamberlainToken property
        hand: [{ id: 2, name: "Priest" }],
        isOut: false,
      };

      const baseUpdates = {
        "round/currentPlayer": "bob",
      };

      const result = handlePlayerElimination({
        roomCode: "TEST123",
        playerName: "alice",
        gameMode: "premium",
        currentPlayerData: playerData,
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual({
        ...baseUpdates,
        "players/alice/isOut": true,
      });
      expect(result["players/alice/chamberlainToken"]).toBeUndefined();
    });

    it("should not activate chamberlainToken in normal mode", () => {
      const playerData = {
        name: "Alice",
        tokens: 2,
        chamberlainToken: false,
        hand: [{ id: 2, name: "Priest" }],
        isOut: false,
      };

      const baseUpdates = {
        "round/currentPlayer": "bob",
      };

      const result = handlePlayerElimination({
        roomCode: "TEST123",
        playerName: "alice",
        gameMode: "normal", // Normal mode
        currentPlayerData: playerData,
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual({
        ...baseUpdates,
        "players/alice/isOut": true,
      });
      expect(result["players/alice/chamberlainToken"]).toBeUndefined();
    });

    it("should handle missing player data gracefully", () => {
      const baseUpdates = {
        "round/currentPlayer": "bob",
      };

      const result = handlePlayerElimination({
        roomCode: "TEST123",
        playerName: "alice",
        gameMode: "premium",
        currentPlayerData: null, // Missing data
        existingUpdates: baseUpdates,
      });

      expect(result).toEqual({
        ...baseUpdates,
        "players/alice/isOut": true,
      });
    });
  });

  describe("🎭 Message Content Validation", () => {
    it("should include medieval-themed content in attacker message", async () => {
      const result = await applyChamberlainEffect({
        roomCode: "TEST123",
        attacker: "alice",
      });

      expect(result.attackerMessage).toContain("🏰");
      expect(result.attackerMessage).toContain("Royal Chamberlain");
      expect(result.attackerMessage).toContain("golden keys");
      expect(result.attackerMessage).toContain("royal secrets");
      expect(result.attackerMessage).toContain("Princess's favor");
    });

    it("should include player name in public message", async () => {
      const result = await applyChamberlainEffect({
        roomCode: "TEST123",
        attacker: "alice",
      });

      expect(result.publicMessage).toContain("Alice");
      expect(result.publicMessage).toContain("Royal Chamberlain");
      expect(result.publicMessage).toContain("powerful allies");
      expect(result.publicMessage).toContain("golden influence");
    });

    it("should use proper CSS classes for styling", async () => {
      const result = await applyChamberlainEffect({
        roomCode: "TEST123",
        attacker: "alice",
      });

      expect(result.attackerMessage).toContain('class="effect-description"');
      expect(result.attackerMessage).toContain('class="effect-card"');
      expect(result.publicMessage).toContain('class="effect-player"');
    });
  });
});
