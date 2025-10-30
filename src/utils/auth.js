/**
 * 🔐 ROOM CREATOR AUTHENTICATION
 *
 * This file validates credentials for creating new game rooms.
 * Uses SHA-256 hashing to obscure credentials from casual inspection.
 *
 * NOTE: This is client-side validation - provides good protection against
 * casual users but not against determined hackers. For your team use case,
 * this should be sufficient.
 */

/**
 * Hash a string using SHA-256
 * @param {string} text - Text to hash
 * @returns {Promise<string>} - Hex string of hash
 */
async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Allowed room creators (hashed credentials)
 *
 * Format: hash of "realName:password"
 *
 * TO ADD A NEW TRUSTED CREATOR:
 * 1. Open browser console
 * 2. Run: await crypto.subtle.digest("SHA-256", new TextEncoder().encode("YourName:YourPassword"))
 *         .then(buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join(""))
 * 3. Add the resulting hash to the array below
 *
 * CURRENT ALLOWED CREATORS:
 * - Add your name and password hash below
 */
const ALLOWED_CREATORS = [
  // TODO: Replace with your actual hashed credentials
  "f56fc0760d7e4db95ee0ec1f4ab8a3e7e22fff7ae51b6476dc8db6a4704a8c6c", // Main host
];

/**
 * Validate if a user is allowed to create rooms
 * @param {string} realName - The user's real name
 * @param {string} password - The user's password
 * @returns {Promise<boolean>} - True if credentials are valid
 */
export async function validateCreator(realName, password) {
  if (!realName || !password) {
    return false;
  }

  // Create the credential string (case-insensitive for name)
  const credentialString = `${realName.toLowerCase().trim()}:${password}`;

  // Hash it
  const hash = await hashText(credentialString);

  // Check if it matches any allowed creator
  return ALLOWED_CREATORS.includes(hash);
}

/**
 * Helper function to generate a hash for new credentials
 * (Useful for adding new trusted creators)
 */
export async function generateCredentialHash(realName, password) {
  const credentialString = `${realName.toLowerCase().trim()}:${password}`;
  return await hashText(credentialString);
}

// Export for debugging purposes (remove in production if desired)
if (process.env.NODE_ENV === "development") {
  window.generateCredentialHash = generateCredentialHash;
  console.log(
    "🔑 Auth utility loaded. Use window.generateCredentialHash('Name', 'Password') to generate hashes for new creators."
  );
}
