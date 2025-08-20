import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyPrinceEffect } from "../cardEffects.js";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(() => "mock-ref"),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
}));

describe("🧪 Simple Princess Test - Just the Core Logic", () => {
  let mockGet, mockUpdate;

  beforeEach(async () => {
    vi.clearAllMocks();
    const firebaseDb = await import("firebase/database");
    mockGet = firebaseDb.get;
    mockUpdate = firebaseDb.update;
  });

  it("🎯 SIMPLE TEST: Prince forces Princess discard → Target eliminated", async () => {
    // Setup: Alice uses Prince on Bob who has Princess
    const roomData = {
      players: {
        alice: { name: "alice", hand: [{ id: 5, name: "Prince" }] },
        bob: { name: "bob", hand: [{ id: 8, name: "Princess" }], discard: [] },
      },
      round: { deck: [] },
    };

    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => roomData,
    });

    // Execute
    const result = await applyPrinceEffect({
      roomCode: "test",
      attacker: "alice",
      target: "bob",
    });

    // Verify the simple things
    console.log("🔍 Test result:", result);

    expect(result.result).toBe("princessEliminated");
    expect(result.eliminatedPlayer).toBe("bob");
    expect(result.wasPrincessDiscarded).toBe(true);

    // Check Firebase was called to eliminate bob
    expect(mockUpdate).toHaveBeenCalledWith(
      "mock-ref",
      expect.objectContaining({
        "players/bob/isOut": true,
      })
    );

    console.log("✅ Simple Princess test passed!");
  });
});
