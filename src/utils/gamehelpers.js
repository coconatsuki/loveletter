export function getStartingPlayer(players, roundNumber = 1) {
  if (roundNumber === 1) {
    const names = Object.keys(players);
    return names[Math.floor(Math.random() * names.length)];
  } else {
    const max = Math.max(...Object.values(players).map(p => p.tokens));
    const topScorers = Object.entries(players)
      .filter(([_, p]) => p.tokens === max)
      .map(([name]) => name);
    return topScorers[Math.floor(Math.random() * topScorers.length)];
  }
}

export function shuffleDeck(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
