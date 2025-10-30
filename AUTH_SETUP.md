# 🔐 Room Creation Authentication Setup

## Overview

The CreateRoom page now requires authentication to prevent unauthorized room creation. This uses SHA-256 hashing to obscure credentials.

## How It Works

1. **User enters name + password** on the CreateRoom page
2. **User clicks a game mode** (Classic or Premium)
3. **System validates** by hashing "name:password" and checking against allowed hashes
4. **If valid**: Mode is selected, "Create Room" button becomes active
5. **If invalid**: Error message shown, mode not selected

## Setting Up Your Credentials

### Step 1: Generate Your Hash

Open your browser console (F12) and run:

```javascript
await window.generateCredentialHash("YourRealName", "YourPassword");
```

Example:

```javascript
await window.generateCredentialHash("Amandine", "mySecretPass123");
// Returns: "a1b2c3d4e5f6..." (a long hex string)
```

### Step 2: Add Hash to auth.js

1. Open `src/utils/auth.js`
2. Find the `ALLOWED_CREATORS` array
3. Replace the placeholder hash with your generated hash:

```javascript
const ALLOWED_CREATORS = [
  "a1b2c3d4e5f6...", // Amandine's credentials
  "x9y8z7w6v5u4...", // Another trusted friend's credentials
];
```

### Step 3: Document Your Credentials (Optional)

Add comments so you remember who each hash belongs to:

```javascript
const ALLOWED_CREATORS = [
  // Amandine:mySecretPass123
  "a1b2c3d4e5f6...",

  // John:anotherPassword
  "x9y8z7w6v5u4...",
];
```

**IMPORTANT**: Don't commit the actual passwords to git! Only store them privately.

## Adding New Trusted Friends

1. Ask them for their desired realName and password
2. Generate hash using console: `await window.generateCredentialHash("TheirName", "TheirPassword")`
3. Add hash to `ALLOWED_CREATORS` array in `src/utils/auth.js`
4. Rebuild and redeploy the app

## Security Notes

### What This Protects Against:

✅ Casual users creating rooms
✅ Accidental room creation by teammates
✅ Simple bypasses or URL manipulation

### What This Doesn't Protect Against:

❌ Determined hackers with technical skills
❌ Someone who inspects your source code thoroughly
❌ Brute force attacks (though very difficult)

### Why This Is Good Enough:

- Your use case is limiting access for colleagues, not preventing sophisticated attacks
- Upgrading to Firebase Functions would cost money and add complexity
- This provides "security through obscurity" which is fine for private team tools

## Testing

1. Try entering **wrong credentials** → Should show error
2. Try entering **correct credentials** → Should allow mode selection
3. Try clicking mode **without filling fields** → Should show warning
4. Try clicking "Create Room" **before selecting mode** → Button should be disabled

## Deployment Checklist

Before deploying to production:

- [ ] Replace the placeholder hash in `auth.js` with your real hash
- [ ] Test with correct credentials locally
- [ ] Test with incorrect credentials locally
- [ ] Remove any console.log statements with sensitive info
- [ ] Consider removing the `window.generateCredentialHash` helper in production (line 59-63 in auth.js)

## Troubleshooting

**"Authentication fails even with correct credentials"**

- Check if realName has extra spaces (it's automatically trimmed)
- Ensure password is typed correctly (case-sensitive!)
- Verify the hash was generated with exact same realName and password

**"I forgot my password"**

- No recovery mechanism - you'll need to generate a new hash with a new password
- Update the hash in `auth.js` and redeploy

**"Can I have different passwords for different users?"**

- Yes! Each entry in `ALLOWED_CREATORS` is a unique realName:password combination
- One person could be "Amandine:pass123", another "John:differentPass"

## Example: Complete Setup

```javascript
// src/utils/auth.js

const ALLOWED_CREATORS = [
  // Amandine:secretPassword123
  "e8d1a9f2b3c4567890abcdef1234567890abcdef1234567890abcdef12345678",

  // John:anotherPass456
  "f9e2b0c3d4567890abcdef1234567890abcdef1234567890abcdef123456789a",

  // Sarah:mysafeword789
  "a0f3e4d5c6789012bcdef3456789012bcdef3456789012bcdef3456789012bc",
];
```

Now Amandine, John, and Sarah can each create rooms with their respective credentials!

## Future Improvements

If you need stronger security later, consider:

- **Firebase Cloud Functions**: Move validation to server-side
- **Firebase Authentication**: Use proper user accounts
- **Database Rules**: Control room creation via Firebase security rules

For now, enjoy your protected game! 🎮👑
