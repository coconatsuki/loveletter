import { cards } from './cardsData';

export function buildDeck(mode = 'normal') {
  const fullDeck = [];

  cards.forEach(card => {
    const count = mode === 'premium' ? card.countPremium : card.countNormal;
    for (let i = 0; i < count; i++) {
      fullDeck.push({
        id: card.id,
        name: card.name,
        strength: card.strength,
        effect: card.effect
      });
    }
  });

  // Shuffle
  for (let i = fullDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }

  return fullDeck;
}
