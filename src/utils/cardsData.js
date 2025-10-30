// Helper function to get the correct card image
export const getCardImage = (cardName) => {
  const imageMap = {
    Jester: "jester1.jpeg",
    Guard: "guard1.jpeg",
    Priest: "priest1.jpeg",
    Baron: "baron1.jpeg",
    Handmaid: "handmaid1.jpeg",
    Prince: "prince1.jpeg",
    "Phantom King": "phantom-king1.jpeg",
    Countess: "countess1.jpeg",
    Princess: "princess-portrait1.jpeg",
    Inquisitor: "inquisitor1.jpeg",
    Chamberlain: "chamberlain1.jpeg",
    "Regent Queen": "regent-queen1.jpeg",
    "Court Whisperer": "court-whisperer1.jpeg",
    "Royal Confessor": "royal-confessor1.jpeg",
    Assassin: "assassin1.jpeg",
    Baroness: "baroness1.jpeg",
    Duke: "duke1.jpeg",
  };

  return imageMap[cardName] || "countess1.jpeg";
};

export const cards = [
  {
    id: 0,
    name: "Jester",
    strength: 0,
    countNormal: 0,
    countPremium: 1,
    effectDetails:
      "Choose another player — ideally, the one you believe is most likely to win the round. If they win, you also gain a Love Token!",
    effect: "Choose a player. If they win, you also gain a love token.",
  },
  {
    id: 1,
    name: "Guard",
    strength: 1,
    countNormal: 5,
    countPremium: 8,
    effectDetails:
      "Guess a strength (≠1). If correct, your target is eliminated.",
    effectDetails:
      "Select a Player and a number (other than 1). If that player has a card with that Strength, they are eliminated. On target selection, if no player can be be chosen, your Guard will be discarded without effect.",
    effect: "Guess a strength (≠1). If correct, target is eliminated.",
  },
  {
    id: 2,
    name: "Priest",
    strength: 2,
    countNormal: 2,
    countPremium: 2,
    effectDetails:
      "Look at another player’s hand (it won't be revealed to any other players).",
    effect: "Look at another player's hand.",
  },
  {
    id: 3,
    name: "Baron",
    strength: 3,
    countNormal: 2,
    countPremium: 2,
    effectDetails:
      "Choose another player, then secretly compare your second card with theirs. The player with the lower number is knocked out of the round. In case of a tie, nothing happens.",
    effect:
      "Compare hands with someone. Player with the lower card is eliminated.",
  },
  {
    id: 4,
    name: "Handmaid",
    strength: 4,
    countNormal: 2,
    countPremium: 2,
    effectDetails:
      "Become immune to the other players’ cards effects until the start of your next turn. If, on someone's turn, all other players are protected, the current player must target themselves, if possible.",
    effect: "You are protected until your next turn.",
  },
  {
    id: 5,
    name: "Prince",
    strength: 5,
    countNormal: 2,
    countPremium: 2,
    effectDetails:
      "Choose a player (or yourself) who must discard their card (without applying its effect, unless it's the Princess) and draw a new one. If everyone is protected, you must choose yourself. If the deck is empty, the Prince won't have any effect.",
    effect: "Choose a target (or yourself) who must renew their hand.",
  },
  {
    id: 6,
    name: "Phantom King",
    strength: 6,
    countNormal: 1,
    countPremium: 1,
    effectDetails:
      "You can trade the card in your hand with the card held by another player of your choice. You cannot trade with a player who is protected by a Handmaid, or eliminated.",
    effect: "You may trade hands with another player.",
  },
  {
    id: 7,
    name: "Countess",
    strength: 7,
    countNormal: 1,
    countPremium: 1,
    effectDetails:
      "This card has no effect when played (better keeping it until the Round ends, as it's powerful!), but you'll be forced to play it if your second card is Phantom King or Prince.",
    effect: "Must be played if you also have a Prince or the Phantom King.",
  },
  {
    id: 8,
    name: "Princess",
    strength: 8,
    countNormal: 1,
    countPremium: 1,
    effectDetails:
      "Try to keep this card until the end of the Round. If you discard it —no matter how or why, you'll immediately be knocked out of the round.",
    effect: "If discarded (by you, or by force), you are eliminated.",
  },
  {
    id: 9,
    name: "Inquisitor",
    strength: 7,
    countNormal: 0,
    countPremium: 1,
    effectDetails:
      "Select a player and a strength number. If you guess well, your target discards their card, draws a new one, and you get a love token. At round-end, only the Princess can beat the Inquisitor.",
    effect:
      "Guess a strength other than 1. If correct, gain an affection token.",
  },
  {
    id: 10,
    name: "Chamberlain",
    strength: 6,
    countNormal: 0,
    countPremium: 1,
    effectDetails:
      "If you're knocked out of the round (eliminated) while having the Chamberlain in your discard pile (from a previous turn), you'll gain a love token when the round ends.",
    effect: "If you're eliminated before round ends, gain 1 love token.",
  },
  {
    id: 11,
    name: "Regent Queen",
    strength: 7,
    countNormal: 0,
    countPremium: 1,
    effectDetails:
      "Secretly compare your hand with another player of your choice. The player with the HIGHER number is knocked out of the round. In case of a tie, nothing happens.",
    effect: "Compare hands. Player with higher strength is eliminated.",
  },
  {
    id: 12,
    name: "Court Whisperer",
    strength: 4,
    countNormal: 0,
    countPremium: 2,
    effectDetails:
      "Select a player (or yourself) as the next turn's target. If the next player (whose turn come after yours) plays a card requiring some target(s) selection, those targets must include the player your selected.",
    effect: "Choose who the next player must target.",
  },
  {
    id: 13,
    name: "Royal Confessor",
    strength: 2,
    countNormal: 0,
    countPremium: 2,
    effectDetails:
      "Choose 2 players (one can be you), who will switch hands. If you didn't include yourself, you can look at one of the cards. If less than 2 players can be chosen, this card has no effect.",
    effect: "2 players (or you and someone else) switch hands.",
  },
  {
    id: 14,
    name: "Assassin",
    strength: 0,
    countNormal: 0,
    countPremium: 1,
    effectDetails:
      "This card has no effect when played. However, if you are targeted with a Guard while holding this card, you can eliminate the attacker as a reaction.",
    effect: "If targeted with Guard, eliminate attacker instead.",
  },

  {
    id: 15,
    name: "Baroness",
    strength: 3,
    countNormal: 0,
    countPremium: 2,
    effectDetails:
      "Look at the hands of up to 2 players (depending on how many other players can be targeted). They will only be revealed to you.",
    effect: "Look at the hands of up to two players.",
  },
  {
    id: 16,
    name: "Duke",
    strength: 5,
    countNormal: 0,
    countPremium: 2,
    effectDetails:
      "If you played/discarded the Duke before the round ends, add +1 to the strength of your last card when comparing it with the other players' hands when the round ends.",
    effect: "If discarded or played, add +1 to your hand strength.",
  },
];
