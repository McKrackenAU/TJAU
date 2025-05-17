import React from 'react';

interface TrackCardLabelProps {
  trackId: number;
  cardId: string;
  index: number;
}

/**
 * A dedicated component to properly display card names for learning tracks
 * This ensures consistent naming across the application
 */
export function TrackCardLabel({ trackId, cardId, index }: TrackCardLabelProps) {
  let displayName = "Card " + (index + 1);

  // Beginner's Journey track
  if (trackId === 1) {
    const beginnerNames: Record<string, string> = {
      "fool": "The Fool",
      "magician": "The Magician",
      "high-priestess": "The High Priestess",
      "empress": "The Empress",
      "emperor": "The Emperor",
      "hierophant": "The Hierophant",
      "lovers": "The Lovers",
      "chariot": "The Chariot",
      "strength": "Strength",
      "hermit": "The Hermit",
      "wheel-of-fortune": "Wheel of Fortune",
      "justice": "Justice",
      "hanged-man": "The Hanged Man",
      "death": "Death",
      "temperance": "Temperance",
      "devil": "The Devil",
      "tower": "The Tower",
      "star": "The Star",
      "moon": "The Moon",
      "sun": "The Sun",
      "judgement": "Judgement",
      "world": "The World"
    };
    
    if (beginnerNames[cardId]) {
      displayName = beginnerNames[cardId];
    }
  }
  // Advanced Symbolism track
  else if (trackId === 11) {
    // First handle Major Arcana numerical IDs
    if (/^\d+$/.test(cardId)) {
      const majorArcana = [
        "The Fool", "The Magician", "The High Priestess", "The Empress",
        "The Emperor", "The Hierophant", "The Lovers", "The Chariot", 
        "Strength", "The Hermit", "Wheel of Fortune", "Justice",
        "The Hanged Man", "Death", "Temperance", "The Devil",
        "The Tower", "The Star", "The Moon", "The Sun",
        "Judgement", "The World"
      ];
      
      const num = parseInt(cardId, 10);
      if (num >= 0 && num < majorArcana.length) {
        displayName = majorArcana[num];
      }
    }
    // Then handle Minor Arcana cards
    else if (cardId.length >= 2) {
      const suit = cardId[0];
      const rank = cardId.substring(1);
      
      let suitName = "";
      if (suit === "w") suitName = "Wands";
      else if (suit === "c") suitName = "Cups";
      else if (suit === "p") suitName = "Pentacles";
      else if (suit === "s") suitName = "Swords";
      
      let rankName = "";
      if (rank === "1") rankName = "Ace";
      else if (rank === "2") rankName = "Two";
      else if (rank === "3") rankName = "Three";
      else if (rank === "4") rankName = "Four";
      else if (rank === "5") rankName = "Five";
      else if (rank === "6") rankName = "Six";
      else if (rank === "7") rankName = "Seven";
      else if (rank === "8") rankName = "Eight";
      else if (rank === "9") rankName = "Nine";
      else if (rank === "10") rankName = "Ten";
      else if (rank === "p") rankName = "Page";
      else if (rank === "n") rankName = "Knight";
      else if (rank === "q") rankName = "Queen";
      else if (rank === "k") rankName = "King";
      
      if (suitName && rankName) {
        displayName = `${rankName} of ${suitName}`;
      }
    }
  }
  // Other tracks would be handled here
  
  return <>{displayName}</>;
}