import { checkRoundEndConditions } from "./src/utils/roundEndDetection.js";

// Mock Firebase
const mockGet = {
  exists: () => true,
  val: () => ({
    players: {
      alice: {
        tokens: 2,
        isOut: false,
        name: "Alice",
        hand: [{ id: 2, strength: 2 }],
      },
      bob: {
        tokens: 1,
        isOut: false,
        name: "Bob",
        hand: [{ id: 3, strength: 3 }],
      },
      charlie: {
        tokens: 0,
        isOut: false,
        name: "Charlie",
        hand: [{ id: 4, strength: 4 }],
      },
    },
    gameStats: { currentRound: 3, totalRoundsPlayed: 2 },
    round: {
      deck: [
        { id: 1, strength: 1 },
        { id: 4, strength: 4 },
      ], // 2 cards left
      hiddenCard: { id: 5, strength: 5 },
    },
  }),
};

// Mock the Firebase get function
global.get = () => Promise.resolve(mockGet);
global.ref = () => ({});

async function testRoundEnd() {
  console.log("Testing round end detection with baron scenario...");
  const result = await checkRoundEndConditions("TEST123");
  console.log("Result:", result);
}

testRoundEnd().catch(console.error);
