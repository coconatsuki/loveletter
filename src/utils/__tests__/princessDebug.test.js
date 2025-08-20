import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyPrinceEffect } from "../cardEffects.js";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(() => "mock-ref"),
  get: vi.fn(),
  update: vi.fn().mockResolvedValue(),
}));

vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
}));

describe("🔍 Princess Debug Test", () => {
  let mockGet, mockUpdate;

  beforeEach(async () => {
    vi.clearAllMocks();
    const firebaseDb = await import("firebase/database");
    mockGet = firebaseDb.get;
    mockUpdate = firebaseDb.update;
  });

  it("should work with basic setup", async () => {
    // Simplest possible test
    const roomData = {
      players: {
        bob: {
          name: "bob",
          hand: [{ id: 8, name: "Princess" }],
          discard: [],
        },
      },
      round: { deck: [] },
    };

    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => roomData,
    });

    const result = await applyPrinceEffect({
      roomCode: "test",
      attacker: "alice",
      target: "bob",
    });

    console.log("🔍 Result:", result);
    console.log("🔍 Mock calls:", mockUpdate.mock.calls);

    // Basic assertions
    expect(result).toBeDefined();
    expect(result.result).toBe("princessEliminated");
  });
});
