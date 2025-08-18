import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyCountessEffect } from "../cardEffects.js";

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
      id: 5,
      name: "Prince",
      strength: 5,
      effect: "Force a player to discard and draw.",
    },
    {
      id: 6,
      name: "Phantom King",
      strength: 6,
      effect: "Look at a player's hand and choose a card to discard.",
    },
    {
      id: 7,
      name: "Countess",
      strength: 7,
      effect: "Must be played if you have Prince or Phantom King.",
    },
  ],
}));

describe("🎭 Countess Effects - The Royal Matriarch", () => {
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

  describe("Royal Presence Effect", () => {
    it("should successfully apply Countess effect with royal notifications", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 7, strength: 7, name: "Countess" }],
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

      const result = await applyCountessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("countess_played");
      expect(result.message).toBe(
        "The Countess has graced the court with her presence!"
      );

      // Check public notification contains royal intrigue
      expect(result.publicMessage).toContain(
        "🎭✨ The Countess herself has appeared in court with alice!"
      );
      expect(result.publicMessage).toContain(
        "Her regal presence commands attention"
      );
      expect(result.publicMessage).toContain(
        "What royal machinations are afoot? 👑💫"
      );

      // Check player message contains royal protocol
      expect(result.playerMessage).toContain("🎭✨ THE COUNTESS ✨🎭");
      expect(result.playerMessage).toContain("Royal Effect: None.");
      expect(result.playerMessage).toContain(
        '"My dear, no one knows the Princess as I do. Let me handle that."'
      );
    });

    it("should handle missing room data gracefully", async () => {
      // Mock Firebase snapshot that doesn't exist
      mockGet.mockResolvedValue({
        exists: () => false,
      });

      const result = await applyCountessEffect({
        roomCode: "non-existent-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("The Countess encountered a royal mishap!");
    });

    it("should handle Firebase errors gracefully", async () => {
      // Mock Firebase to throw error
      mockGet.mockRejectedValue(new Error("Network error"));

      const result = await applyCountessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("The Countess encountered a royal mishap!");
    });

    it("should use fallback name when player name is not available", async () => {
      const mockRoomData = {
        players: {
          player123: {
            // No name property
            hand: [{ id: 7, strength: 7, name: "Countess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyCountessEffect({
        roomCode: "test-room",
        player: "player123",
      });

      expect(result.publicMessage).toContain("player123"); // Uses player ID as fallback
    });
  });

  describe("Debug Logging", () => {
    it("should log debug information correctly", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 7, strength: 7, name: "Countess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await applyCountessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "🎭 COUNTESS DEBUG: The royal matriarch takes the stage...",
        { player: "alice" }
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "🎭 COUNTESS: Royal presence confirmed",
        { player: "alice", hand: [{ id: 7, strength: 7, name: "Countess" }] }
      );

      consoleSpy.mockRestore();
    });
  });
});
