import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Play from "../../pages/Play";
import * as Firebase from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  off: vi.fn(),
}));

vi.mock("../../utils/firebase", () => ({
  db: {},
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "TEST123" }),
    useLocation: () => ({
      state: { nickname: "testPlayer", realName: "Test Player" },
    }),
  };
});

// Mock card effects
vi.mock("../../utils/cardEffects", () => ({
  playGuard: vi.fn(),
  playPriest: vi.fn(),
  playBaron: vi.fn(),
  playHandmaid: vi.fn(),
  playPrince: vi.fn(),
  playPhantomKing: vi.fn(),
  playCountess: vi.fn(),
  playPrincess: vi.fn(),
}));

// Mock other utilities
vi.mock("../../utils/pushNotification", () => ({
  pushNotification: vi.fn(),
}));

vi.mock("../../utils/roundEndDetection", () => ({
  logRoundEndCheck: vi.fn(),
}));

describe("Play Component - Round Scoring Integration", () => {
  let mockOnValue;
  let mockUpdate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    mockOnValue = vi.fn();
    mockUpdate = vi.fn();

    Firebase.onValue = mockOnValue;
    Firebase.update = mockUpdate;
    Firebase.ref = vi.fn(() => ({}));
    Firebase.set = vi.fn();
    Firebase.off = vi.fn();
  });

  describe("Round End Redirection", () => {
    it("should redirect to round scoring when gameState becomes roundScoring", async () => {
      // Mock Firebase listener that will trigger gameState change
      let roomDataCallback;
      const callbacks = [];

      mockOnValue.mockImplementation((ref, callback) => {
        // Capture the first callback as the room data listener
        if (callbacks.length === 0) {
          roomDataCallback = callback;
        }
        callbacks.push(callback);
        return vi.fn(); // unsubscribe function
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      // Wait for component to mount and Firebase listener to be set up
      await waitFor(() => {
        expect(mockOnValue).toHaveBeenCalled();
        expect(roomDataCallback).toBeDefined();
      });

      // Simulate initial room data (game in progress)
      const initialRoomData = {
        gameState: "inRound",
        players: {
          testPlayer: {
            hand: [{ id: 5, strength: 5 }],
            isOut: false,
            tokens: 1,
          },
          otherPlayer: {
            hand: [{ id: 3, strength: 3 }],
            isOut: false,
            tokens: 0,
          },
        },
        round: {
          currentPlayer: "testPlayer",
          deck: [{ id: 1, strength: 1 }],
        },
      };

      roomDataCallback({ val: () => initialRoomData });

      // Wait for component to process the initial data and render
      await waitFor(() => {
        expect(
          screen.queryByText("⏳ Loading game state...")
        ).not.toBeInTheDocument();
      });

      // Verify no navigation yet
      expect(mockNavigate).not.toHaveBeenCalled();

      // Simulate round end (gameState changes to roundScoring)
      const roundEndRoomData = {
        ...initialRoomData,
        gameState: "roundScoring",
        roundResult: {
          winner: "testPlayer",
          type: "lastPlayerStanding",
          roundNumber: 1,
        },
      };

      roomDataCallback({ val: () => roundEndRoomData });

      // Verify navigation to round scoring
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/round_scoring/TEST123", {
          state: { nickname: "testPlayer", realName: "Test Player" },
        });
      });
    });

    it("should not redirect if gameState is not roundScoring", async () => {
      let roomDataCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        if (!roomDataCallback) {
          roomDataCallback = callback;
        }
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      // Simulate room data with different game states
      const gameStates = ["waiting", "inRound", "gameEnd"];

      for (const gameState of gameStates) {
        const roomData = {
          gameState,
          players: {
            testPlayer: { hand: [{ id: 5, strength: 5 }], isOut: false },
          },
          round: { currentPlayer: "testPlayer", deck: [] },
        };

        firebaseCallback({ val: () => roomData });
      }

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Gameplay Blocking After Round End", () => {
    it("should block drawCard when gameState is roundScoring", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      // Set up room data with round ended
      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: {
            hand: [{ id: 5, strength: 5 }], // Has only 1 card (would normally allow draw)
            isOut: false,
            tokens: 1,
          },
        },
        round: {
          currentPlayer: "testPlayer", // It's player's turn
          deck: [{ id: 1, strength: 1 }], // Deck has cards
        },
      };

      firebaseCallback({ val: () => roomData });

      // Find and click draw card button
      const drawButton = screen.getByText("Draw Card");
      fireEvent.click(drawButton);

      // Verify Firebase update was NOT called (draw was blocked)
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should block playCard when gameState is roundScoring", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      // Set up room data with round ended
      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: {
            hand: [
              { id: 7, strength: 7 }, // Countess (no target needed)
              { id: 4, strength: 4 }, // Handmaid (no target needed)
            ],
            isOut: false,
            tokens: 1,
          },
        },
        round: {
          currentPlayer: "testPlayer",
          deck: [],
        },
      };

      firebaseCallback({ val: () => roomData });

      // Try to click on cards to play them
      const cardButtons = screen.getAllByText(/Play|Countess|Handmaid/);

      if (cardButtons.length > 0) {
        fireEvent.click(cardButtons[0]);

        // Verify no card effects were triggered (blocked)
        expect(mockUpdate).not.toHaveBeenCalled();
      }
    });

    it("should allow normal gameplay when gameState is inRound", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      // Set up room data with round in progress
      const roomData = {
        gameState: "inRound", // Round still active
        players: {
          testPlayer: {
            hand: [{ id: 5, strength: 5 }], // Has only 1 card
            isOut: false,
            tokens: 1,
          },
        },
        round: {
          currentPlayer: "testPlayer", // It's player's turn
          deck: [{ id: 1, strength: 1 }], // Deck has cards
        },
      };

      firebaseCallback({ val: () => roomData });

      // Find and click draw card button
      const drawButton = screen.getByText("Draw Card");
      fireEvent.click(drawButton);

      // Verify Firebase update WAS called (draw was allowed)
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("Console Logging", () => {
    it("should log when draw card is blocked", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: {
            hand: [{ id: 5, strength: 5 }],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "testPlayer",
          deck: [{ id: 1, strength: 1 }],
        },
      };

      firebaseCallback({ val: () => roomData });

      const drawButton = screen.getByText("Draw Card");
      fireEvent.click(drawButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        "🛑 DRAW CARD blocked - Round has ended"
      );

      consoleSpy.mockRestore();
    });

    it("should log when play card is blocked", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: {
            hand: [
              { id: 7, strength: 7 },
              { id: 4, strength: 4 },
            ],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "testPlayer",
          deck: [],
        },
      };

      firebaseCallback({ val: () => roomData });

      // Simulate clicking on a card
      const cardButtons = screen.getAllByText(/Play|Countess|Handmaid/);
      if (cardButtons.length > 0) {
        fireEvent.click(cardButtons[0]);

        expect(consoleSpy).toHaveBeenCalledWith(
          "🛑 PLAY CARD blocked - Round has ended"
        );
      }

      consoleSpy.mockRestore();
    });

    it("should log redirection to round scoring", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/play/TEST123"]}>
          <Play />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: { hand: [], isOut: false },
        },
        roundResult: { winner: "testPlayer" },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "🏆 ROUND ENDED - Redirecting to Round Scoring Board"
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
