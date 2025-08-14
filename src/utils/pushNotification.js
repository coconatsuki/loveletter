import { ref, push } from "firebase/database";
import { db } from "./firebase";

export function pushNotification(roomCode, message) {
  const notifRef = ref(db, `rooms/${roomCode}/notifications`);
  push(notifRef, {
    message,
    timestamp: Date.now(),
  });
}
