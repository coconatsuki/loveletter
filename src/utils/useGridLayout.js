import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to calculate dynamic grid layout for players
 * Determines how many players can fit per row and which should show popover on left
 */
export const useGridLayout = (totalPlayers) => {
  const [playersPerRow, setPlayersPerRow] = useState(4); // Default fallback
  const [rightmostIndices, setRightmostIndices] = useState(new Set());
  const gridRef = useRef(null);

  const calculateLayout = () => {
    if (!gridRef.current) return;

    const gridElement = gridRef.current;
    const containerRect = gridElement.getBoundingClientRect();

    // Get computed styles to account for padding
    const computedStyle = window.getComputedStyle(gridElement);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

    // Calculate available width for players (subtract horizontal padding)
    const availableWidth = containerRect.width - paddingLeft - paddingRight;

    // Player constants from CSS
    const playerWidth = 250; // .royal-player-section width
    const gapSize = 48; // 3rem = 48px (assuming 1rem = 16px)

    // Calculate how many players can fit in one row
    // Formula: availableWidth >= (playerWidth * n) + (gapSize * (n-1))
    // Solving for n: n = (availableWidth + gapSize) / (playerWidth + gapSize)
    const maxPlayersInRow = Math.floor(
      (availableWidth + gapSize) / (playerWidth + gapSize)
    );

    // Ensure at least 1 player per row, max reasonable limit
    const actualPlayersPerRow = Math.max(1, Math.min(maxPlayersInRow, 6));

    setPlayersPerRow(actualPlayersPerRow);

    // Calculate which player indices are in the rightmost position of each row
    const rightmostSet = new Set();

    for (let i = 0; i < totalPlayers; i++) {
      const positionInRow = i % actualPlayersPerRow;
      const isLastInRow = positionInRow === actualPlayersPerRow - 1;
      const isActuallyLast = i === totalPlayers - 1; // Last player overall

      // Add to rightmost if it's the last position in its row OR the very last player
      if (isLastInRow || isActuallyLast) {
        rightmostSet.add(i);
      }
    }

    console.log(
      `Players showing popover on LEFT (indices):`,
      Array.from(rightmostSet)
    );
    setRightmostIndices(rightmostSet);
  };

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateLayout, 100);
    };

    window.addEventListener("resize", handleResize);

    // Initial calculation
    calculateLayout();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [totalPlayers]);

  // Recalculate when totalPlayers changes
  useEffect(() => {
    calculateLayout();
  }, [totalPlayers]);

  return {
    gridRef,
    playersPerRow,
    shouldShowPopoverOnLeft: (playerIndex) => rightmostIndices.has(playerIndex),
  };
};
