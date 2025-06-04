const names = [
  { name: "Sir Lancelint", gender: "male" },
  { name: "Lady Scriptoria", gender: "female" },
  { name: "Dame JSONette", gender: "female" },
  { name: "Lord Loopalot", gender: "male" },
  { name: "Count Bracket", gender: "male" },
  { name: "Baroness Backendia", gender: "female" },
  { name: "Sir Bugslay", gender: "male" },
  { name: "Duchess Deploya", gender: "female" },
  { name: "The Null Knight", gender: "neutral" },
  { name: "Captain Callback", gender: "neutral" },
  { name: "Baroness Booleania", gender: "female" },
  { name: "Duke of Debugshire", gender: "male" },
  { name: "Dame Dotenv", gender: "female" },
  { name: "Lady Lambda", gender: "female" },
  { name: "Sir Console.log", gender: "male" },
  { name: "Countess Cloudflare", gender: "female" },
  { name: "Lord Semicolin", gender: "male" },
  { name: "Madame Mergeconflict", gender: "female" },
  { name: "The Rogue of Regex", gender: "neutral" },
  { name: "Princess Patchnote", gender: "female" },
  { name: "Sir Gitpullalot", gender: "male" },
  { name: "Monk of Markdown", gender: "neutral" },
  { name: "Viscount VanillaJS", gender: "male" },
  { name: "Lady Lintalot", gender: "female" },
  { name: "The Earl of Else", gender: "male" },
  { name: "Duchess APIria", gender: "female" },
];

export function generateNickname(preferredGender = null) {
  const filtered = preferredGender
    ? names.filter(
        (n) => n.gender === preferredGender || n.gender === "neutral"
      )
    : names;
  const choice = filtered[Math.floor(Math.random() * filtered.length)];
  return choice.name;
}
