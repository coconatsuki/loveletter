import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRoundEndConditions } from "../roundEndDetection";
import { ref, get } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

describe("🐞 Debug Tiebreaker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ref.mockReturnValue({ _path: "mock-ref" });
  });

  it("should debug tiebreaker behavior", async () => {
    const mockRoomData = {
      players: {
        alice: {
          isOut: false,
          hand: [{ id: 8, strength: 8 }],
          discard: [
            { id: 7, strength: 7 }, // Countess
            { id: 5, strength: 5 }, // Prince
          ],
        },
        bob: {
          isOut: false,
          hand: [{ id: 8, strength: 8 }],
          discard: [
            { id: 3, strength: 3 }, // Baron
            { id: 2, strength: 2 }, // Priest
          ],
        },
      },
      round: {
        deck: [],
        hiddenCard: null,
      },
    };

    get.mockResolvedValue({
      exists: () => true,
      val: () => mockRoomData,
    });

    const result = await checkRoundEndConditions("TEST123");

    console.log("🐞 ACTUAL RESULT:", JSON.stringify(result, null, 2));
    console.log("🐞 FINAL STANDINGS:", result.finalStandings);
    console.log("🐞 TIEBREAKER DETAILS:", result.tiebreakerDetails);

    expect(result.isRoundEnd).toBe(true);
  });
});
