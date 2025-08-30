// Noble medieval words for epic room codes
const NOBLE_WORDS = [
  // ⚔️ Weapons & Combat
  "SWORD",
  "BLADE",
  "SHIELD",
  "LANCE",
  "MACE",
  "DAGGER",
  "BOW",
  "ARROW",

  // 🏰 Castles & Architecture
  "CASTLE",
  "TOWER",
  "THRONE",
  "COURT",
  "HALL",
  "CHAMBER",
  "GATE",
  "BRIDGE",

  // 👑 Royalty & Nobility
  "CROWN",
  "ROYAL",
  "NOBLE",
  "KING",
  "QUEEN",
  "PRINCE",
  "LORD",
  "LADY",

  // ⚔️ Knights & Chivalry
  "KNIGHT",
  "HONOR",
  "VALOR",
  "GLORY",
  "QUEST",
  "COURAGE",
  "FAITH",
  "OATH",

  // 🐲 Mystical & Magic
  "DRAGON",
  "MAGIC",
  "SPELL",
  "RUNE",
  "CRYSTAL",
  "POTION",
  "ENCHANT",
  "MYSTIC",

  // 🌟 Elements & Nature
  "FLAME",
  "STORM",
  "SHADOW",
  "LIGHT",
  "DAWN",
  "MOON",
  "STAR",
  "SUN",
  "WIND",
  "EARTH",
  "FIRE",
  "WATER",
  "ICE",
  "THUNDER",
  "FROST",
  "MIST",

  // 💎 Treasures & Materials
  "GOLD",
  "SILVER",
  "RUBY",
  "PEARL",
  "DIAMOND",
  "STEEL",
  "IRON",
  "BRONZE",

  // 🦅 Creatures & Beasts
  "WOLF",
  "EAGLE",
  "LION",
  "BEAR",
  "STAG",
  "RAVEN",
  "FALCON",
  "PHOENIX",

  // 🌹 Nature & Beauty
  "ROSE",
  "OAK",
  "THORN",
  "LILY",
  "VINE",
  "FOREST",
  "RIVER",
  "MOUNTAIN",

  // ⭐ Mystical Concepts
  "REALM",
  "DESTINY",
  "LEGEND",
  "MYTH",
  "SAGA",
  "TALE",
  "DREAM",
  "SPIRIT",
];

export function generateRoomCode() {
  // Pick 3 random noble words
  const shuffled = [...NOBLE_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).join("-");
}

// Fallback to original system if needed
export function generateSimpleRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
