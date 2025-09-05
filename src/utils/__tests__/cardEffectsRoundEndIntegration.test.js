import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  applyGuardEffect,
  applyBaronEffect,
  applyPrincessEffect,
} from "../cardEffects";
import { logRoundEndCheck } from "../roundEndDetection";
import { ref, get, update } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

// Mock round end detection
vi.mock("../roundEndDetection", () => ({
  logRoundEndCheck: vi.fn(),
}));

// Mock notifications
vi.mock("../pushNotification", () => ({
  pushNotification: vi.fn(),
}));

describe("Card Effects - Round End Integration", () => {
  let mockGet, mockUpdate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = vi.fn();
    mockUpdate = vi.fn();

    // Mock Firebase functions
    get.mockImplementation(mockGet);
    update.mockImplementation(mockUpdate);
    ref.mockImplementation((db, path) => ({ _path: path }));
  });

  describe("Guard Card - Round End Detection", () => {
    it("should return elimination data when Guard guess is correct", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 1, strength: 1 }], isOut: false },
          target: { hand: [{ id: 5, strength: 5 }], isOut: false },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 2, strength: 2 }],
        },
        mode: "normal",
      };

      mockGet.mockResolvedValue({ val: () => roomData });

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "attacker",
        target: "target",
        guess: 5,
      });

      expect(result).toEqual(
        expect.objectContaining({
          result: "correctGuess",
          isCorrectGuess: true,
          eliminatedPlayer: "target",
          requiresPrompt: true, // Always show prompt to maintain mystery
        })
      );
    });
  });

  describe("Baron Card - Round End Detection", () => {
    it("should call logRoundEndCheck when Baron eliminates opponent", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 3, strength: 3 }], isOut: false },
          target: { hand: [{ id: 2, strength: 2 }], isOut: false },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 4, strength: 4 }],
        },
        mode: "normal",
      };

      mockGet.mockResolvedValue({ val: () => roomData });
      mockUpdate.mockResolvedValue();

      await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "attacker",
        target: "target",
      });

      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "After Baron Elimination",
        "TEST123"
      );
    });
  });

  describe("Princess Card - Round End Detection", () => {
    it("should call logRoundEndCheck when Princess eliminates player", async () => {
      const roomData = {
        players: {
          player: {
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "player",
          deck: [{ id: 4, strength: 4 }],
        },
        mode: "normal",
      };

      mockGet.mockResolvedValue({
        val: () => roomData,
        exists: () => true, // Add exists method for Firebase snapshot
      });
      mockUpdate.mockResolvedValue();

      await applyPrincessEffect({
        roomCode: "TEST123",
        player: "player",
      });

      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "After Princess Elimination",
        "TEST123"
      );
    });
  });
});
