import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ref, update, onValue } from "firebase/database";
import Play from "../../Play.jsx";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  update: vi.fn(),
  onValue: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
  get: vi.fn(),
}));

// Mock other dependencies
vi.mock("../../../utils/pushNotification", () => ({
  default: vi.fn(),
}));

vi.mock("../../../utils/roundEndDetection", () => ({
  checkRoundEndConditions: vi.fn().mockResolvedValue({ isRoundEnd: false }),
  triggerRoundEnd: vi.fn(),
}));

vi.mock("../../../utils/cardEffects", () => ({
  applyGuardEffect: vi.fn(),
  resolveAssassinDefense: vi.fn(),
}));

// Mock React Router location state
const mockLocationState = {
  nickname: "Juan Karlos",
  realName: "Karl",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      state: mockLocationState,
    }),
    useParams: () => ({
      roomCode: "TEST123",
    }),
    useNavigate: () => vi.fn(),
  };
});

describe("Play Component - Elimination Turn Advancement", () => {
  let mockFirebaseUpdate;
  let mockOnValue;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFirebaseUpdate = vi.fn().mockResolvedValue();
    mockOnValue = vi.fn();

    update.mockImplementation(mockFirebaseUpdate);
    onValue.mockImplementation(mockOnValue);
    ref.mockReturnValue("mock-ref");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should automatically advance turn when current player is eliminated", async () => {
    // Arrange: Set up initial game state where current player gets eliminated
    const initialGameState = {
      round: {
        currentPlayer: "Juan Karlos",
        deck: [{ id: 8, name: "Princess" }],
        isFinalTurn: false,
      },
      players: {
        "Juan Karlos": {
          name: "Juan Karlos",
          realName: "Karl",
          isOut: false, // Initially not eliminated
          hand: [{ id: 3, name: "Baron" }],
          discard: [],
          tokens: 0,
        },
        "Lady JSOnette": {
          name: "Lady JSOnette",
          isOut: false,
          hand: [{ id: 1, name: "Guard" }],
          discard: [],
          tokens: 0,
        },
      },
      gameState: "inRound",
      protectedPlayers: [],
    };

    // The state after Juan Karlos gets eliminated (the problematic state)
    const eliminatedPlayerState = {
      ...initialGameState,
      players: {
        ...initialGameState.players,
        "Juan Karlos": {
          ...initialGameState.players["Juan Karlos"],
          isOut: true, // NOW ELIMINATED but still current player!
          hand: [],
          discard: [{ id: 3, name: "Baron" }],
        },
      },
    };

    // Mock the Firebase listener to call our callback with the problematic state
    mockOnValue.mockImplementation((ref, callback) => {
      // First call with initial state
      setTimeout(() => callback({ val: () => initialGameState }), 0);
      // Second call with eliminated player state (this should trigger the fix)
      setTimeout(() => callback({ val: () => eliminatedPlayerState }), 10);
      return vi.fn(); // Return unsubscribe function
    });

    // Act: Render the component
    render(
      <BrowserRouter>
        <Play />
      </BrowserRouter>
    );

    // Assert: Wait for the Firebase update to be called with turn advancement
    await waitFor(
      () => {
        expect(mockFirebaseUpdate).toHaveBeenCalledWith(
          "mock-ref",
          expect.objectContaining({
            "round/currentPlayer": "Lady JSOnette",
          })
        );
      },
      { timeout: 1000 }
    );

    // Verify the fix was triggered
    expect(mockFirebaseUpdate).toHaveBeenCalled();
    const updateCall = mockFirebaseUpdate.mock.calls.find(
      (call) => call[1] && call[1]["round/currentPlayer"] === "Lady JSOnette"
    );
    expect(updateCall).toBeTruthy();
  });

  it("should not interfere when current player is not eliminated", async () => {
    // Arrange: Normal game state where current player is active
    const normalGameState = {
      round: {
        currentPlayer: "Lady JSOnette", // Active player
        deck: [{ id: 8, name: "Princess" }],
        isFinalTurn: false,
      },
      players: {
        "Juan Karlos": {
          name: "Juan Karlos",
          isOut: true, // Someone else is eliminated
          hand: [],
          discard: [{ id: 3, name: "Baron" }],
          tokens: 0,
        },
        "Lady JSOnette": {
          name: "Lady JSOnette",
          isOut: false, // Current player is NOT eliminated
          hand: [{ id: 1, name: "Guard" }],
          discard: [],
          tokens: 0,
        },
      },
      gameState: "inRound",
      protectedPlayers: [],
    };

    mockOnValue.mockImplementation((ref, callback) => {
      setTimeout(() => callback({ val: () => normalGameState }), 0);
      return vi.fn();
    });

    // Act: Render the component
    render(
      <BrowserRouter>
        <Play />
      </BrowserRouter>
    );

    // Assert: Should not trigger any turn advancement
    await waitFor(() => {
      expect(
        screen.getByText(/AWAITING LADY JSONETTE'S ROYAL DECREE/)
      ).toBeInTheDocument();
    });

    // Should not have called update for turn advancement
    expect(mockFirebaseUpdate).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        "round/currentPlayer": expect.any(String),
      })
    );
  });

  it("should show elimination banner when player is eliminated", async () => {
    // Arrange: Game state where this player (Juan Karlos) is eliminated
    const eliminatedSelfGameState = {
      round: {
        currentPlayer: "Lady JSOnette", // Someone else's turn
        deck: [{ id: 8, name: "Princess" }],
        isFinalTurn: false,
      },
      players: {
        "Juan Karlos": {
          name: "Juan Karlos",
          realName: "Karl",
          isOut: true, // THIS player is eliminated
          hand: [],
          discard: [{ id: 3, name: "Baron" }],
          tokens: 0,
        },
        "Lady JSOnette": {
          name: "Lady JSOnette",
          isOut: false,
          hand: [{ id: 1, name: "Guard" }],
          discard: [],
          tokens: 0,
        },
      },
      gameState: "inRound",
      protectedPlayers: [],
    };

    mockOnValue.mockImplementation((ref, callback) => {
      setTimeout(() => callback({ val: () => eliminatedSelfGameState }), 0);
      return vi.fn();
    });

    // Act: Render the component
    render(
      <BrowserRouter>
        <Play />
      </BrowserRouter>
    );

    // Assert: Should show the elimination banner
    await waitFor(() => {
      expect(screen.getByText(/You've been eliminated!/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /You can no longer play this round, but may still witness the royal drama/
        )
      ).toBeInTheDocument();
    });
  });

  it("should handle rapid Firebase updates without causing infinite loops", async () => {
    // Arrange: Simulate rapid Firebase updates (the 8 consecutive updates scenario)
    const gameStates = [
      // Initial state
      {
        round: { currentPlayer: "Juan Karlos" },
        players: {
          "Juan Karlos": {
            isOut: false,
            hand: [{ id: 3, name: "Baron" }],
            discard: [],
          },
          "Lady JSOnette": {
            isOut: false,
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
          },
        },
      },
      // Elimination happens
      {
        round: { currentPlayer: "Juan Karlos" },
        players: {
          "Juan Karlos": {
            isOut: true,
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
          },
          "Lady JSOnette": {
            isOut: false,
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
          },
        },
      },
      // Turn should advance (after our fix)
      {
        round: { currentPlayer: "Lady JSOnette" },
        players: {
          "Juan Karlos": {
            isOut: true,
            hand: [],
            discard: [{ id: 3, name: "Baron" }],
          },
          "Lady JSOnette": {
            isOut: false,
            hand: [{ id: 1, name: "Guard" }],
            discard: [],
          },
        },
      },
    ];

    let callCount = 0;
    mockOnValue.mockImplementation((ref, callback) => {
      gameStates.forEach((state, index) => {
        setTimeout(() => {
          callCount++;
          callback({ val: () => state });
        }, index * 50);
      });
      return vi.fn();
    });

    // Act: Render the component
    render(
      <BrowserRouter>
        <Play />
      </BrowserRouter>
    );

    // Assert: Should stabilize after the fix is applied
    await waitFor(
      () => {
        expect(callCount).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );

    // Should not have excessive Firebase update calls
    const updateCalls = mockFirebaseUpdate.mock.calls.filter(
      (call) => call[1] && call[1]["round/currentPlayer"]
    );

    // Should have at most one corrective update call
    expect(updateCalls.length).toBeLessThanOrEqual(1);
  });
});
