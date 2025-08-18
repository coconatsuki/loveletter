import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyPrincessEffect } from "../cardEffects.js";

// Mock Firebase properly - need to mock both firebase/database and local firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
}));

// Mock cards data
vi.mock("../cardsData", () => ({
  cards: [
    {
      id: 8,
      name: "Princess",
      strength: 8,
      effect: "If played or discarded, player is eliminated.",
    },
  ],
}));

describe("👑 Princess Effects - The Ultimate Royal Card", () => {
  let mockGet, mockUpdate, mockRef;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked functions from firebase/database
    const firebaseDb = await import("firebase/database");
    mockGet = firebaseDb.get;
    mockUpdate = firebaseDb.update;
    mockRef = firebaseDb.ref;

    // Setup default mock returns
    mockRef.mockReturnValue({ path: "mock-ref" });
  });

  describe("Direct Princess Play", () => {
    it("should immediately eliminate player when Princess is played", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      // Mock Firebase snapshot
      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("princess_played");
      expect(result.message).toBe(
        "The Princess has spoken! You are eliminated!"
      );
      expect(result.eliminatedPlayer).toBe("alice");

      // Check elimination was applied to Firebase
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "rooms/test-room/players/alice/isOut": true,
        })
      );

      // Check public message contains royal catastrophe
      expect(result.publicMessage).toContain("👑💀 ROYAL CATASTROPHE!");
      expect(result.publicMessage).toContain(
        "alice has played the PRINCESS herself!"
      );
      expect(result.publicMessage).toContain("banished from the royal court!");

      // Check player message contains medieval humor
      expect(result.playerMessage).toContain("👑💀 ULTIMATE ROYAL BLUNDER!");
      expect(result.playerMessage).toContain("you hopeless romantic!");
      expect(result.playerMessage).toContain("Have some class!");
    });

    it("should handle player with fallback name", async () => {
      const mockRoomData = {
        players: {
          player123: {
            // No name property - should use player ID as fallback
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "player123",
      });

      expect(result.result).toBe("princess_played");
      expect(result.publicMessage).toContain("player123"); // Uses player ID as fallback
    });

    it("should handle missing room data gracefully", async () => {
      // Mock Firebase snapshot that doesn't exist
      mockGet.mockResolvedValue({
        exists: () => false,
      });

      const result = await applyPrincessEffect({
        roomCode: "non-existent-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("royal mishap");
    });

    it("should handle Firebase errors gracefully", async () => {
      // Mock Firebase to throw error
      mockGet.mockRejectedValue(new Error("Network error"));

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("royal mishap");
    });
  });

  describe("Modal Flow Configuration", () => {
    it("should return correct modal configuration for Princess", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      // Check attacker message modal configuration
      expect(result.attackerMessage).toBeDefined();
      expect(result.attackerMessage.cardName).toBe("Princess");
      expect(result.attackerMessage.from).toBe("alice");
      expect(result.attackerMessage.shouldAdvanceTurn).toBe(true); // Playing Princess advances turn
      expect(result.attackerMessage.visibleTo).toBe("alice");
    });
  });

  describe("Debug Logging", () => {
    it("should log debug information correctly", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "👑 PRINCESS DEBUG: The ultimate tragedy unfolds...",
        { player: "alice" }
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "👑 PRINCESS: The ultimate sacrifice begins",
        { player: "alice", hand: [{ id: 8, strength: 8, name: "Princess" }] }
      );

      consoleSpy.mockRestore();
    });
  });
});
