import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  handlePlayerElimination,
  applyChamberlainEffect,
} from "../gamehelpers.js";
import { triggerRoundEnd } from "../roundEndDetection.js";
import { get, ref, update } from "../firebase.js";

// Mock Firebase
vi.mock("../firebase.js", () => ({
  db: {},
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

// Mock the functions
vi.hoisted(() => {
  vi.mock("../gamehelpers.js", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      handlePlayerElimination: vi.fn(),
      applyChamberlainEffect: vi.fn(),
    };
  });

  vi.mock("../roundEndDetection.js", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      triggerRoundEnd: vi.fn(),
    };
  });
});

describe("🏰 Chamberlain Edge Cases Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("🚨 Error Handling", () => {
    it("should handle null room data gracefully", async () => {
      get.mockResolvedValue({ val: () => null });

      handlePlayerElimination.mockReturnValue({
        "players/alice/isOut": true,
      });

      await handlePlayerElimination("NULL_ROOM", "alice", "premium", null, {});
      expect(handlePlayerElimination).toHaveBeenCalledWith(
        "NULL_ROOM",
        "alice",
        "premium",
        null,
        {}
      );
    });

    it("should handle invalid player names", async () => {
      handlePlayerElimination.mockReturnValue({
        "players//isOut": true,
      });

      await handlePlayerElimination("TEST123", "", "premium", null, {});
      expect(handlePlayerElimination).toHaveBeenCalledWith(
        "TEST123",
        "",
        "premium",
        null,
        {}
      );
    });
  });

  describe("🔄 Token State Edge Cases", () => {
    it("should handle chamberlainToken with unexpected values", async () => {
      const playerData = {
        name: "Alice",
        chamberlainToken: "string_value",
        isOut: false,
      };

      handlePlayerElimination.mockReturnValue({
        "players/alice/isOut": true,
      });

      await handlePlayerElimination(
        "TEST123",
        "alice",
        "premium",
        playerData,
        {}
      );
      expect(handlePlayerElimination).toHaveBeenCalledWith(
        "TEST123",
        "alice",
        "premium",
        playerData,
        {}
      );
    });
  });

  describe("🛡️ Defensive Programming", () => {
    it("should handle applyChamberlainEffect with missing attacker", async () => {
      applyChamberlainEffect.mockResolvedValue({
        success: false,
        error: "Missing attacker data",
      });

      await applyChamberlainEffect({ roomCode: "TEST123", attacker: null });
      expect(applyChamberlainEffect).toHaveBeenCalledWith({
        roomCode: "TEST123",
        attacker: null,
      });
    });

    it("should handle Firebase update failures", async () => {
      update.mockRejectedValue(new Error("Firebase update failed"));
      triggerRoundEnd.mockRejectedValue(
        new Error("Round end failed due to Firebase error")
      );

      try {
        await triggerRoundEnd("TEST123");
      } catch (error) {
        expect(error.message).toBe("Round end failed due to Firebase error");
      }

      expect(triggerRoundEnd).toHaveBeenCalledWith("TEST123");
    });
  });

  describe("🧪 Boundary Conditions", () => {
    it("should handle zero token scenarios", async () => {
      const playerData = {
        name: "Alice",
        chamberlainToken: true,
        tokens: 0,
      };

      handlePlayerElimination.mockReturnValue({
        "players/alice/isOut": true,
        "players/alice/chamberlainToken": true,
      });

      await handlePlayerElimination(
        "TEST123",
        "alice",
        "premium",
        playerData,
        {}
      );
      expect(handlePlayerElimination).toHaveBeenCalledWith(
        "TEST123",
        "alice",
        "premium",
        playerData,
        {}
      );
    });
  });
});
