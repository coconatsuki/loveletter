import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyCourtWhispererEffect } from "../cardEffects";

// Mock Firebase
vi.mock("../firebase", () => ({
  db: {},
}));

// Mock Firebase database functions
vi.mock("firebase/database", () => ({
  ref: vi.fn(() => ({ path: "mocked-ref" })),
  get: vi.fn(),
  update: vi.fn(),
}));

describe("Court Whisperer Card Effects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Effect Functionality", () => {
    it("should generate gossip messages when targeting another player", async () => {
      // Mock Firebase data
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice", realName: "Alice Smith" }, // Attacker
            Player2: { name: "Bob", realName: "Bob Jones" }, // Target
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
      });

      expect(result.result).toBe("success");
      expect(result.attacker).toBe("Player1");
      expect(result.target).toBe("Player2");
      expect(result.targetPlayer.name).toBe("Bob");

      // Check that messages are generated with proper gossip styling
      expect(result.attackerMessage).toContain(
        "You lean toward the infamous Court Whisperer"
      );
      expect(result.attackerMessage).toContain("Bob"); // Target name in message
      expect(result.attackerMessage).toContain("color: #FF1493"); // Styled HTML

      expect(result.targetMessage).toContain(
        "The Court Whisperer has clearly been busy"
      );
      expect(result.targetMessage).toContain("Court Whisperer");
      expect(result.targetMessage).toContain("🎭✨"); // Styled emojis

      expect(result.publicMessage).toContain("Alice");
      expect(result.publicMessage).toContain("Bob");
      expect(result.publicMessage).toContain(
        "Rumors spread faster than perfume"
      );
    });

    it("should handle self-targeting correctly", async () => {
      // Mock Firebase data
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice", realName: "Alice Smith" }, // Both attacker and target
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player1", // Self-targeting
      });

      expect(result.result).toBe("success");
      expect(result.attacker).toBe("Player1");
      expect(result.target).toBe("Player1");
      expect(result.targetPlayer.name).toBe("Alice");

      // Should generate messages for self-targeting
      expect(result.attackerMessage).toContain("Alice"); // Own name in message
      expect(result.targetMessage).toContain(
        "The Court Whisperer has clearly been busy"
      );
      expect(result.publicMessage).toContain("Alice");
    });

    it("should return error for invalid target player", async () => {
      // Mock Firebase data with missing target
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice", realName: "Alice Smith" }, // Attacker exists
            // Player2 does not exist
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2", // Non-existent target
      });

      expect(result.result).toBe("error");
      expect(result.error).toBe("Invalid target player");
    });

    it("should return error for invalid room data", async () => {
      // Mock Firebase data with null response
      const mockSnapshot = {
        val: () => null,
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "INVALID",
        attacker: "Player1",
        target: "Player2",
      });

      expect(result.result).toBe("error");
      expect(result.error).toBe("Invalid target player");
    });
  });

  describe("Message Content Validation", () => {
    it("should include proper gossip magazine styling in messages", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice", realName: "Alice Smith" },
            Player2: { name: "Bob", realName: "Bob Jones" },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
      });

      // Check attacker message styling
      expect(result.attackerMessage).toContain("color: #FF1493");
      expect(result.attackerMessage).toContain("font-weight: bold");
      expect(result.attackerMessage).toContain("✨");

      // Check target message styling
      expect(result.targetMessage).toContain("🎭✨");
      expect(result.targetMessage).toContain("entertainment");
      expect(result.targetMessage).toContain(
        "Court Whisperer has clearly been busy"
      );

      // Check public message content
      expect(result.publicMessage).toContain('class="effect-player"');
      expect(result.publicMessage).toContain("👂🏼");
    });

    it("should include targeting instructions in messages", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice", realName: "Alice Smith" },
            Player2: { name: "Bob", realName: "Bob Jones" },
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
      });

      // Check that targeting instructions are included
      expect(result.attackerMessage).toContain("Next player MUST target");
      expect(result.attackerMessage).toContain("Bob");

      expect(result.targetMessage).toContain("Next player MUST target");
      expect(result.targetMessage).toContain("YOU");
    });
  });

  describe("Error Handling", () => {
    it("should handle Firebase errors gracefully", async () => {
      const { get } = await import("firebase/database");
      get.mockRejectedValue(new Error("Firebase connection failed"));

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
      });

      expect(result.result).toBe("error");
      expect(result.error).toBe("Firebase connection failed");
    });

    it("should handle missing player data gracefully", async () => {
      const mockSnapshot = {
        val: () => ({
          players: {
            Player1: { name: "Alice" }, // Missing realName
            Player2: null, // Null player data
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyCourtWhispererEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
      });

      expect(result.result).toBe("error");
      expect(result.error).toBe("Invalid target player");
    });
  });
});
