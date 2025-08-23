import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import RoundScoring from "../../pages/RoundScoring";
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
    useParams: () => ({ id: "TEST123" }),
    useLocation: () => ({
      state: { nickname: "testPlayer", realName: "Test Player" },
    }),
  };
});

describe("RoundScoring Component", () => {
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

  describe("Component Rendering", () => {
    it("should render loading state initially", () => {
      mockOnValue.mockImplementation(() => vi.fn());

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      expect(screen.getByText("Loading round results...")).toBeInTheDocument();
    });

    it("should render round scoring board with room data", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: {
            name: "testPlayer",
            realName: "Test Player",
            tokens: 2,
            isOut: false,
          },
          otherPlayer: {
            name: "otherPlayer",
            realName: "Other Player",
            tokens: 1,
            isOut: true,
          },
        },
        roundResult: {
          roundNumber: 2,
          type: "lastPlayerStanding",
          winner: "testPlayer",
          winners: ["testPlayer"],
          winnerNames: ["Test Player"],
          timestamp: Date.now(),
        },
        host: "testPlayer",
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(screen.getByText("Round Scoring Board")).toBeInTheDocument();
        expect(screen.getByText("Room: TEST123")).toBeInTheDocument();
      });
    });

    it("should display round winner information", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          alice: { name: "alice", realName: "Alice", tokens: 3 },
          bob: { name: "bob", realName: "Bob", tokens: 1 },
        },
        roundResult: {
          roundNumber: 3,
          type: "lastPlayerStanding",
          winner: "alice",
          winners: ["alice"],
          winnerNames: ["Alice"],
        },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(screen.getByText("Round 3 Winner: Alice")).toBeInTheDocument();
      });
    });

    it("should display multiple winners for tie", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          alice: { name: "alice", realName: "Alice", tokens: 2 },
          bob: { name: "bob", realName: "Bob", tokens: 2 },
        },
        roundResult: {
          roundNumber: 1,
          type: "deckEmpty",
          winners: ["alice", "bob"],
          winnerNames: ["Alice", "Bob"],
        },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(
          screen.getByText("Round 1 Winners: Alice, Bob")
        ).toBeInTheDocument();
      });
    });

    it("should show player leaderboard with tokens", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          alice: { name: "alice", realName: "Alice", tokens: 3 },
          bob: { name: "bob", realName: "Bob", tokens: 1 },
          charlie: { name: "charlie", realName: "Charlie", tokens: 2 },
        },
        roundResult: {
          winner: "alice",
          roundNumber: 1,
        },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        // Check for leaderboard content
        expect(screen.getByText("Love Tokens Leaderboard")).toBeInTheDocument();
        expect(screen.getByText("Alice: 3 tokens")).toBeInTheDocument();
        expect(screen.getByText("Charlie: 2 tokens")).toBeInTheDocument();
        expect(screen.getByText("Bob: 1 token")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Actions", () => {
    it("should show 'Play Another Round' button for host", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        host: "testPlayer", // Current user is host
        players: {
          testPlayer: { tokens: 2 },
          otherPlayer: { tokens: 1 },
        },
        roundResult: { winner: "testPlayer" },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(screen.getByText("Play Another Round")).toBeInTheDocument();
      });
    });

    it("should show 'End Game Now' button for host", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        host: "testPlayer",
        players: {
          testPlayer: { tokens: 2 },
          otherPlayer: { tokens: 1 },
        },
        roundResult: { winner: "testPlayer" },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(screen.getByText("End Game Now")).toBeInTheDocument();
      });
    });

    it("should not show host buttons for non-host players", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        host: "otherPlayer", // Current user is NOT host
        players: {
          testPlayer: { tokens: 2 },
          otherPlayer: { tokens: 1 },
        },
        roundResult: { winner: "testPlayer" },
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(
          screen.queryByText("Play Another Round")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("End Game Now")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle missing room data gracefully", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      // Simulate missing room data
      firebaseCallback({ val: () => null });

      await waitFor(() => {
        expect(
          screen.getByText("Loading round results...")
        ).toBeInTheDocument();
      });
    });

    it("should handle missing roundResult gracefully", async () => {
      let firebaseCallback;
      mockOnValue.mockImplementation((ref, callback) => {
        firebaseCallback = callback;
        return vi.fn();
      });

      render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      const roomData = {
        gameState: "roundScoring",
        players: {
          testPlayer: { tokens: 1 },
        },
        // Missing roundResult
      };

      firebaseCallback({ val: () => roomData });

      await waitFor(() => {
        expect(screen.getByText("Round Scoring Board")).toBeInTheDocument();
        // Should still render basic board even without round result
      });
    });
  });

  describe("Firebase Cleanup", () => {
    it("should cleanup Firebase listener on unmount", () => {
      const mockUnsubscribe = vi.fn();
      mockOnValue.mockImplementation(() => mockUnsubscribe);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/round_scoring/TEST123"]}>
          <RoundScoring />
        </MemoryRouter>
      );

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
