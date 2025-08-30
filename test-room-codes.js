import { generateRoomCode } from "./src/utils/room.js";

console.log("🏰 Testing Epic Room Codes:");
for (let i = 0; i < 8; i++) {
  console.log(`${i + 1}. ${generateRoomCode()}`);
}
