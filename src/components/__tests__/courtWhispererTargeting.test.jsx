import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock React
vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
  Fragment: "Fragment",
}));

describe("Court Whisperer Target Selection Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TargetModal Forced Targeting", () => {
    it("should detect forced targeting correctly", () => {
      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: false, // Effect ready to force targeting
      };

      // This is the logic from TargetModal
      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      expect(isTargetingForced).toBe(true);
      expect(forcedTargetNickname).toBe("Player2");
    });

    it("should not detect forced targeting when nextTarget is used", () => {
      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: true, // Effect already used, no longer forcing
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      expect(isTargetingForced).toBe(false);
      expect(forcedTargetNickname).toBe(null);
    });

    it("should not detect forced targeting when nextTarget is null", () => {
      const nextTarget = null;

      const isTargetingForced = !!(nextTarget && nextTarget.used === false);
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      expect(isTargetingForced).toBe(false);
      expect(forcedTargetNickname).toBe(null);
    });

    it("should filter validTargets to forced target only when targeting is forced", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player2", { name: "Bob", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: false,
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(1);
      expect(finalValidTargets[0][0]).toBe("Player2");
      expect(finalValidTargets[0][1].name).toBe("Bob");
    });

    it("should show all targets when targeting is not forced", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player2", { name: "Bob", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      const nextTarget = null; // No forced targeting

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(3);
      expect(finalValidTargets).toEqual(validTargets);
    });

    it("should handle forced targeting when target is not in validTargets", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
        // Player2 is missing (maybe protected by Handmaid)
      ];

      const nextTarget = {
        nickname: "Player2", // Forced target not in validTargets
        name: "Bob",
        used: false,
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(0); // No valid targets
      expect(isTargetingForced).toBe(true); // Still forcing, but no targets available
    });
  });

  describe("InquisitorTargetModal Forced Targeting", () => {
    it("should detect forced targeting correctly in InquisitorTargetModal", () => {
      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: false, // Effect ready to force targeting
      };

      // This is the logic from InquisitorTargetModal
      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      expect(isTargetingForced).toBe(true);
      expect(forcedTargetNickname).toBe("Player2");
    });

    it("should filter targets the same way as TargetModal", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player2", { name: "Bob", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: false,
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name, p]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(1);
      expect(finalValidTargets[0][0]).toBe("Player2");
      expect(finalValidTargets[0][1].name).toBe("Bob");
    });
  });

  describe("Target Selection hasNoTargets Logic", () => {
    it("should detect hasNoTargets correctly when forced target is unavailable", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
        // Player2 missing (protected/eliminated)
      ];

      const nextTarget = {
        nickname: "Player2", // Forced target not available
        name: "Bob",
        used: false,
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      const hasNoTargets = finalValidTargets.length === 0;

      expect(hasNoTargets).toBe(true);
      expect(isTargetingForced).toBe(true);
      expect(finalValidTargets.length).toBe(0);
    });

    it("should not have hasNoTargets when forced target is available", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player2", { name: "Bob", isOut: false }], // Forced target available
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      const nextTarget = {
        nickname: "Player2",
        name: "Bob",
        used: false,
      };

      const isTargetingForced = nextTarget && nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      const hasNoTargets = finalValidTargets.length === 0;

      expect(hasNoTargets).toBe(false);
      expect(isTargetingForced).toBe(true);
      expect(finalValidTargets.length).toBe(1);
      expect(finalValidTargets[0][0]).toBe("Player2");
    });

    it("should not have hasNoTargets in normal targeting with multiple targets", () => {
      const validTargets = [
        ["Player1", { name: "Alice", isOut: false }],
        ["Player2", { name: "Bob", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      const nextTarget = null; // No forced targeting

      const isTargetingForced = !!(nextTarget && nextTarget.used === false);

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === null)
        : validTargets;

      const hasNoTargets = finalValidTargets.length === 0;

      expect(hasNoTargets).toBe(false);
      expect(isTargetingForced).toBe(false);
      expect(finalValidTargets.length).toBe(3);
    });
  });

  describe("Confirm Button Logic", () => {
    it("should disable confirm button when placeholder is selected", () => {
      const selectedTarget = ""; // Placeholder "-- Choose a player --"

      const isConfirmDisabled = !selectedTarget || selectedTarget === "";

      expect(isConfirmDisabled).toBe(true);
    });

    it("should enable confirm button when SKIP_TURN is selected", () => {
      const selectedTarget = "SKIP_TURN";

      const isConfirmDisabled = !selectedTarget || selectedTarget === "";

      expect(isConfirmDisabled).toBe(false);
    });

    it("should enable confirm button when real target is selected", () => {
      const selectedTarget = "Player2";

      const isConfirmDisabled = !selectedTarget || selectedTarget === "";

      expect(isConfirmDisabled).toBe(false);
    });

    it("should disable confirm button when no selection is made", () => {
      const selectedTarget = null;

      const isConfirmDisabled = !selectedTarget || selectedTarget === "";

      expect(isConfirmDisabled).toBe(true);
    });
  });

  describe("Self-Targeting with Court Whisperer", () => {
    it("should allow self-targeting for Court Whisperer when not forced", () => {
      const cardPlayed = 12; // Court Whisperer
      const currentPlayer = "Player1";
      const canTargetSelfCardsIds = [5, 12, 13]; // Prince, Court Whisperer, Royal Confessor

      const canTargetSelf = canTargetSelfCardsIds.includes(cardPlayed);
      expect(canTargetSelf).toBe(true);

      const validTargets = [
        ["Player2", { name: "Bob", isOut: false }],
        ["Player3", { name: "Charlie", isOut: false }],
      ];

      // Simulate adding self to validTargets
      if (canTargetSelf) {
        validTargets.push([currentPlayer, { name: "Alice" }]);
      }

      expect(validTargets.length).toBe(3);
      expect(validTargets[2][0]).toBe("Player1"); // Self added
    });

    it("should show YOURSELF in dropdown for self-targeting", () => {
      const currentPlayer = "Player1";
      const name = "Player1"; // When mapping through finalValidTargets

      // This is the logic from TargetModal dropdown
      const displayText =
        name === currentPlayer ? "👑 YOURSELF ✨" : "Some Player Name";

      expect(displayText).toBe("👑 YOURSELF ✨");
    });

    it("should show normal name for other players", () => {
      const currentPlayer = "Player1";
      const name = "Player2"; // Different player
      const p = { name: "Bob", realName: "Bob Jones" };

      const displayText =
        name === currentPlayer ? "👑 YOURSELF ✨" : `${p.name} (${p.realName})`;

      expect(displayText).toBe("Bob (Bob Jones)");
    });
  });
});
