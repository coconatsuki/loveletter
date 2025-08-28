# 🏰 How to Add Your Beautiful Medieval Artwork 🏰

## Quick Setup Instructions

1. **Save your medieval artwork images** to the `public` folder:

   - Save the first image (Princess with suitors and letters) as:
     `public/love-letter-princess-court.jpg`
   - Save the second image (Princess looking bored) as:
     `public/love-letter-princess-bored.jpg`

2. **Update the artwork paths** in `src/utils/royalArtwork.js`:

   ```javascript
   export const royalArtwork = {
     // Change these to use your actual images:
     princessCourt: "/love-letter-princess-court.jpg",
     princessBored: "/love-letter-princess-bored.jpg",
     // ... rest stays the same
   };
   ```

3. **Update the Landing page** to use the real artwork:
   In `src/pages/Landing.jsx`, change:

   ```javascript
   src={royalArtwork.fallbackLanding}
   ```

   to:

   ```javascript
   src={royalArtwork.princessCourt}
   ```

4. **Update the CreateRoom page** to use the real artwork:
   In `src/pages/CreateRoom.jsx`, change:
   ```javascript
   src={royalArtwork.fallbackCreate}
   ```
   to:
   ```javascript
   src={royalArtwork.princessBored}
   ```

## 🎨 What You'll See

### Landing Page (`/`)

- **Left side**: Royal form for joining a game
- **Right side**: Your beautiful medieval artwork of the Princess with suitors
- **Theme**: "Enter the Royal Court" - for players joining games

### Create Room Page (`/create`)

- **Left side**: Royal form for game masters
- **Right side**: Your medieval artwork of the Princess looking bored
- **Theme**: "Establish Royal Court" - for game masters creating games

## 🏰 Royal Features Added

✨ **Medieval Typography**: Cinzel font family for that royal feel
🎨 **Royal Color Palette**: Deep crimson, royal gold, burgundy, and ivory
🌟 **Animations**: Floating titles, shimmering gold text, hover effects
📱 **Responsive**: Looks amazing on desktop and mobile
🎭 **Accessibility**: Proper contrast, focus states, semantic HTML
⚡ **Performance**: Optimized CSS with fallback SVG graphics

## 🎪 Special Effects

- **Shimmer Animation**: The title text has a golden shimmer effect
- **Floating Animation**: The main title gently floats up and down
- **Hover Effects**: Buttons and inputs have royal hover animations
- **Success Feedback**: Name generation button glows when clicked
- **Royal Backgrounds**: Gradient backgrounds with subtle pattern overlays

Your medieval artwork will be the perfect centerpiece for these royal landing pages! 👑
