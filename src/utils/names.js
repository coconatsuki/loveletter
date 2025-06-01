const names = [
  'Sir Lancelint',
  'Lady Scriptoria',
  'Dame JSONette',
  'Lord Loopalot',
  'Count Bracket',
  'Baroness Backendia',
  'Sir Bugslay',
  'Duchess Deploya'
];

export function generateNickname() {
  return names[Math.floor(Math.random() * names.length)];
}