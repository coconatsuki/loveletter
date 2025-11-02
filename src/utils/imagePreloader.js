import { useEffect, useState } from "react";
import { cards } from "./cardsData";

/**
 * Custom hook to preload all card images in the background
 * Images are loaded into browser cache for instant display during gameplay
 * Should be called in Room.jsx (lobby) while players are waiting
 */
export const useImagePreloader = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    console.log("🖼️ IMAGE PRELOADER: Starting to preload card images...");

    // Get all unique card image names from cards data
    const imageNames = cards.map((card) => {
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
      return imageMap[card.name];
    });

    // Effect illustration images (for EffectResultModal)
    const effectIllustrations = [
      "01-guard-arrest.png",
      "01-guard-failure.png",
      "01-guard-failure-target.png",
      "01-guard-self-elimination.png",
      "01-guard-success.png",
      "01-guard-assassin-discovered.png",
      "01-guard-assassin-not-discovered.png",
      "02-priest-divination.png",
      "04-handmaid-tea.jpeg",
      "05-prince-angry.png",
      "05-prince-punishment.png",
      "05-prince-help.png",
      "05-prince-disapproving.png",
      "07-countess-furious.png",
      "08-princess-rejection.png",
      "09-inquisitor-investigation.png",
      "10-chamberlain-friend.png",
      "12-court-whisperer-boudoir.png",
      "14-assassin-disappear.png",
      "00-jester-trinket.png",
      "15-baroness-soiree.png",
      "16-duke-favor.png",
    ];

    // Combine card images and effect illustrations
    const allImages = [...imageNames, ...effectIllustrations];

    // Remove duplicates
    const uniqueImages = [...new Set(allImages)];
    let loaded = 0;

    console.log(
      `🖼️ IMAGE PRELOADER: Found ${uniqueImages.length} unique images to preload`
    );

    // Preload each image
    const imagePromises = uniqueImages.map((imageName) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `/img/${imageName}`;

        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          console.log(
            `✅ IMAGE PRELOADER: Loaded ${imageName} (${loaded}/${uniqueImages.length})`
          );
          resolve();
        };

        img.onerror = () => {
          console.warn(`⚠️ IMAGE PRELOADER: Failed to load ${imageName}`);
          loaded++;
          setLoadedCount(loaded);
          resolve(); // Resolve anyway to not block other images
        };
      });
    });

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      console.log(
        `🎉 IMAGE PRELOADER: All ${uniqueImages.length} images preloaded successfully!`
      );
      setImagesLoaded(true);
    });

    // Cleanup function (though images stay in cache)
    return () => {
      console.log("🖼️ IMAGE PRELOADER: Cleanup called");
    };
  }, []);

  return { imagesLoaded, loadedCount, totalImages: cards.length };
};
