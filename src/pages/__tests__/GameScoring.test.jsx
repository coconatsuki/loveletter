import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameScoring from "../GameScoring";
import * as Firebase from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  update: vi.fn(),
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
    useParams: () => ({ id: "GAME123" }),
    useLocation: () => ({
      state: { nickname: "testPlayer", realName: "Test Player" },
    }),
  };
});

describe("GameScoring Component", () => {
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
    Firebase.off = vi.fn();
  });

  // Helper function to setup Firebase mocks for GameScoring component
  const setupFirebaseMocks = () => {
    let roomDataCallback;
    let notificationCallback;
    let callCount = 0;

    mockOnValue.mockImplementation((ref, callback) => {
      callCount++;
      if (callCount === 1) {
        // First call is for room data
        roomDataCallback = callback;
      } else {
        // Second call is for notifications
        notificationCallback = callback;
      }
      return vi.fn();
    });

    const triggerCallbacks = (roomData, notifications = null) => {
      // Trigger room data callback
      roomDataCallback({ val: () => roomData });

      // Trigger notifications callback
      if (notificationCallback) {
        notificationCallback({ val: () => notifications });
      }
    };

    return { triggerCallbacks };
  };

  describe("Component Rendering", () => {
    it("should render loading state initially", () => {
      mockOnValue.mockImplementation(() => vi.fn());

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Preparing the royal coronation ceremony/)
      ).toBeInTheDocument();
    });

    it("should render game scoring board with final results", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        host: "testPlayer",
        players: {
          testPlayer: { tokens: 5, name: "Test Player" },
          alice: { tokens: 3, name: "Alice" },
          bob: { tokens: 2, name: "Bob" },
        },
        finalResults: {
          completedRounds: 8,
          finalWinner: "testPlayer",
          timestamp: Date.now(),
        },
        gameStats: {
          totalRoundsPlayed: 8,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(screen.getByText(/ROYAL TOURNAMENT FINALE/)).toBeInTheDocument();
        expect(
          screen.getByText(/The Princess's heart belongs to/)
        ).toBeInTheDocument();
      });
    });
    it("should display final winner information", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        players: {
          testPlayer: { tokens: 7, name: "Test Player" },
          alice: { tokens: 3, name: "Alice" },
        },
        finalResults: {
          finalWinner: "testPlayer",
          completedRounds: 12,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(
          screen.getByText(/The Princess's heart belongs to/)
        ).toBeInTheDocument();
        // Check for champion name in the winner announcement section
        const winnerAnnouncement = screen.getByText(
          /The Princess's heart belongs to/
        ).parentElement;
        expect(winnerAnnouncement).toHaveTextContent("Test Player");
      });
    });

    it("should show final leaderboard with all players", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        players: {
          winner: { tokens: 7, name: "Winner Player" },
          second: { tokens: 4, name: "Second Player" },
          third: { tokens: 2, name: "Third Player" },
        },
        finalResults: {
          finalWinner: "winner",
          completedRounds: 15,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        // Check that all player names appear in the leaderboard
        const leaderboard = screen.getByText(
          "🏆 Final Court Rankings 🏆"
        ).parentElement;
        expect(leaderboard).toHaveTextContent("Winner Player");
        expect(leaderboard).toHaveTextContent("Second Player");
        expect(leaderboard).toHaveTextContent("Third Player");
        expect(screen.getByText(/7.*love token/)).toBeInTheDocument();
      });
    });
  });

  describe("Game Statistics", () => {
    it("should display game duration and rounds played", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        players: {
          player1: { tokens: 5, name: "Player 1" },
        },
        finalResults: {
          finalWinner: "player1",
          completedRounds: 8,
          timestamp: Date.now(),
        },
        gameStats: {
          totalRoundsPlayed: 8,
          gameStartTime: Date.now() - 1800000, // 30 minutes ago
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(screen.getByText(/Total Rounds Played/)).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
      });
    });
  });

  describe("Host Actions", () => {
    it("should show host action buttons for host", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        host: "testPlayer", // Current user is host
        players: {
          testPlayer: { tokens: 5, name: "Test Player" },
        },
        finalResults: {
          finalWinner: "testPlayer",
          completedRounds: 5,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(screen.getByText(/Return to Royal Court/)).toBeInTheDocument();
      });
    });

    it("should not show host buttons for non-host players", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        host: "otherPlayer", // Different host
        players: {
          testPlayer: { tokens: 3, name: "Test Player" },
          otherPlayer: { tokens: 5, name: "Other Player" },
        },
        finalResults: {
          finalWinner: "otherPlayer",
          completedRounds: 6,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(
          screen.queryByText(/Return to Royal Court/)
        ).not.toBeInTheDocument();
        expect(screen.getByText(/Awaiting the host/)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle missing room data gracefully", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      // Simulate missing room data
      triggerCallbacks(null);

      await waitFor(() => {
        expect(
          screen.getByText(/royal court has vanished/)
        ).toBeInTheDocument();
      });
    });

    it("should handle missing final results gracefully", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        players: {
          testPlayer: { tokens: 3, name: "Test Player" },
        },
        // Missing finalResults
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        // Should still render basic game end screen
        expect(screen.getByText(/ROYAL TOURNAMENT FINALE/)).toBeInTheDocument();
      });
    });
  });

  describe("Button Actions", () => {
    it("should handle return to royal court button click for host", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();
      mockUpdate.mockResolvedValue();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        host: "testPlayer",
        players: {
          testPlayer: { tokens: 5, name: "Test Player" },
        },
        finalResults: {
          finalWinner: "testPlayer",
          completedRounds: 5,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(screen.getByText(/Return to Royal Court/)).toBeInTheDocument();
      });

      const returnButton = screen.getByText(/Return to Royal Court/);
      fireEvent.click(returnButton);

      expect(mockUpdate).toHaveBeenCalled();
    });

    it("should handle return to royal court button click", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "gameEnd",
        host: "testPlayer",
        players: {
          testPlayer: { tokens: 5, name: "Test Player" },
        },
        finalResults: {
          finalWinner: "testPlayer",
          completedRounds: 5,
        },
      };

      triggerCallbacks(roomData);

      await waitFor(() => {
        expect(screen.getByText(/Return to Royal Court/)).toBeInTheDocument();
      });

      const returnButton = screen.getByText(/Return to Royal Court/);
      fireEvent.click(returnButton);

      // First, expect Firebase update to be called
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          gameState: "returnToLanding",
          redirectMessage: expect.stringContaining(
            "royal tournament has concluded"
          ),
        })
      );

      // Then, after timeout, expect navigation to /create
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith("/create");
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Navigation", () => {
    it("should redirect to landing when gameState is not gameEnd", async () => {
      const { triggerCallbacks } = setupFirebaseMocks();

      render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      // Trigger with invalid game state
      triggerCallbacks({
        gameState: "inRound", // Not "gameEnd"
        players: { testPlayer: { tokens: 5 } },
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Firebase Cleanup", () => {
    it("should cleanup Firebase listeners on unmount", () => {
      const mockUnsubscribe = vi.fn();
      mockOnValue.mockImplementation(() => mockUnsubscribe);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/game_scoring/GAME123"]}>
          <GameScoring />
        </MemoryRouter>
      );

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
