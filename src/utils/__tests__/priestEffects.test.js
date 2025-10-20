import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { applyPriestEffect } from "../cardEffects";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

describe("Priest Card Effects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Normal Priest Scenarios", () => {
    it("should successfully reveal target card and return proper messages", async () => {
      // Mock Firebase data - target has Prince card
      const mockSnapshot = {
        val: () => ({
          players: {
            Alice: {
              name: "Alice the Bold",
              hand: [{ id: 5, name: "Prince", strength: 5 }],
            },
            Bob: {
              name: "Bob the Brave",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "TEST123",
        attacker: "Bob",
        target: "Alice",
      });

      expect(result.result).toBe("revealCard");
      expect(result.attacker).toBe("Bob");
      expect(result.target).toBe("Alice");
      expect(result.targetCard.id).toBe(5);
      expect(result.targetCard.name).toBe("Prince");
      expect(result.targetCard.strength).toBe(5);
      // Note: effect is not populated in current implementation (commented out)

      // Check medieval-themed messages
      expect(result.attackerMessage).toContain("divine light reveals");
      expect(result.attackerMessage).toContain("Alice the Bold");
      expect(result.attackerMessage).toContain("Prince");
      expect(result.attackerMessage).toContain("Strength");
      expect(result.attackerMessage).toContain("5");

      expect(result.targetMessage).toContain(
        "holy priest peers into your soul"
      );
      expect(result.targetMessage).toContain("Prince");
      expect(result.targetMessage).toContain("Bob");

      expect(result.publicMessage).toContain("Bob");
      expect(result.publicMessage).toContain("Priest");
      expect(result.publicMessage).toContain("Alice the Bold");
      expect(result.publicMessage).toContain("mystic arts");
    });

    it("should work with different card types", async () => {
      // Mock Firebase data - target has King card
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: {
              name: "Sir Knight",
              hand: [{ id: 6, name: "King", strength: 6 }],
            },
            Player2: {
              name: "Holy Cleric",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "GAME456",
        attacker: "Player2",
        target: "Player1",
      });

      expect(result.result).toBe("revealCard");
      expect(result.targetCard.name).toBe("King");
      expect(result.targetCard.strength).toBe(6);
      // Note: effect is not populated in current implementation (commented out)
      expect(result.attackerMessage).toContain("King");
      expect(result.attackerMessage).toContain("Strength");
      expect(result.attackerMessage).toContain("6");
    });

    it("should handle Guard card revelation", async () => {
      // Mock Firebase data - target has Guard card
      const mockSnapshot = {
        val: () => ({
          players: {
            TargetPlayer: {
              name: "Guard Captain",
              hand: [{ id: 1, name: "Guard", strength: 1 }],
            },
            Attacker: {
              name: "Mystic Seer",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "ROOM789",
        attacker: "Attacker",
        target: "TargetPlayer",
      });

      expect(result.result).toBe("revealCard");
      expect(result.targetCard.name).toBe("Guard");
      expect(result.targetCard.strength).toBe(1);
    });

    it("should handle Princess card revelation (high value)", async () => {
      // Mock Firebase data - target has Princess card
      const mockSnapshot = {
        val: () => ({
          players: {
            Noble: {
              name: "Lady Catherine",
              hand: [{ id: 8, name: "Princess", strength: 8 }],
            },
            Priest: {
              name: "Father Benedict",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "PALACE",
        attacker: "Priest",
        target: "Noble",
      });

      expect(result.result).toBe("revealCard");
      expect(result.targetCard.name).toBe("Princess");
      expect(result.targetCard.strength).toBe(8);
      expect(result.attackerMessage).toContain("Princess");
      expect(result.attackerMessage).toContain("Strength");
      expect(result.attackerMessage).toContain("8");
    });
  });

  describe("Premium Mode Scenarios", () => {
    it("should handle Assassin card revelation", async () => {
      // Mock Firebase data - target has Assassin card
      const mockSnapshot = {
        val: () => ({
          players: {
            ShadowPlayer: {
              name: "Dark Assassin",
              hand: [{ id: 14, name: "Assassin", strength: 0 }],
            },
            HolyPlayer: {
              name: "Divine Priest",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "PREMIUM_GAME",
        attacker: "HolyPlayer",
        target: "ShadowPlayer",
      });

      expect(result.result).toBe("revealCard");
      expect(result.targetCard.name).toBe("Assassin");
      expect(result.targetCard.strength).toBe(0);
      expect(result.attackerMessage).toContain("Assassin");
      expect(result.attackerMessage).toContain("Strength");
      expect(result.attackerMessage).toContain("0");
      expect(result.publicMessage).toContain("mystic arts");
    });

    it("should handle premium-exclusive cards", async () => {
      // Mock Firebase data - target has Bishop card
      const mockSnapshot = {
        val: () => ({
          players: {
            PremiumPlayer: {
              name: "Bishop Magnus",
              hand: [{ id: 9, name: "Bishop", strength: 9 }],
            },
            Attacker: {
              name: "Rival Priest",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "PREMIUM789",
        attacker: "Attacker",
        target: "PremiumPlayer",
      });

      expect(result.result).toBe("revealCard");
      expect(result.targetCard.name).toBe("Bishop");
      expect(result.targetCard.strength).toBe(9);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing room data", async () => {
      const { get } = await import("firebase/database");
      get.mockResolvedValue({ val: () => null });

      const result = await applyPriestEffect({
        roomCode: "MISSING_ROOM",
        attacker: "Player1",
        target: "Player2",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("Priest Target player not found");
    });

    it("should handle missing players data", async () => {
      const mockSnapshot = {
        val: () => ({
          // Missing players object
          round: { currentPlayer: "Someone" },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "BROKEN_ROOM",
        attacker: "Player1",
        target: "NonexistentPlayer",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("Priest Target player not found");
    });

    it("should handle missing target player", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: {
              name: "Valid Player",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
            // Missing Player2
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "TEST_ROOM",
        attacker: "Player1",
        target: "MissingPlayer",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("Priest Target player not found");
    });

    it("should handle target with no cards", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            ValidPlayer: {
              name: "Has Cards",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
            EmptyPlayer: {
              name: "No Cards",
              hand: [], // Empty hand
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "TEST_ROOM",
        attacker: "ValidPlayer",
        target: "EmptyPlayer",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("Priest Target has no cards");
    });

    it("should handle target with null/undefined hand", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            Attacker: {
              name: "Valid",
              hand: [{ id: 2, name: "Priest", strength: 2 }],
            },
            BrokenTarget: {
              name: "Broken",
              // Missing hand property entirely
            },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyPriestEffect({
        roomCode: "BROKEN_GAME",
        attacker: "Attacker",
        target: "BrokenTarget",
      });

      expect(result.result).toBe("error");
      expect(result.message).toBe("Priest Target has no cards");
    });
  });
});
