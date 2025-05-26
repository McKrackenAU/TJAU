import React from 'react';
import { tarotCards } from "@shared/tarot-data";

interface TrackCardLabelProps {
  trackId: number;
  cardId: string;
  index: number;
}

// Map numeric Major Arcana IDs to their names
const majorArcanaByNumber = [
  "The Fool", "The Magician", "The High Priestess", "The Empress",
  "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
  "Strength", "The Hermit", "Wheel of Fortune", "Justice",
  "The Hanged Man", "Death", "Temperance", "The Devil",
  "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

// Map Major Arcana text IDs to their names
const majorArcanaByName: Record<string, string> = {
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

// Map suits and ranks for Minor Arcana
const suitNames: Record<string, string> = {
  'w': 'Wands',
  'c': 'Cups',
  'p': 'Pentacles',
  's': 'Swords'
};

const rankNames: Record<string, string> = {
  '1': 'Ace',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  'p': 'Page',
  'n': 'Knight',
  'q': 'Queen',
  'k': 'King'
};

/**
 * A dedicated component to properly display card names for learning tracks
 * This ensures consistent naming across the application
 */
export function TrackCardLabel({ trackId, cardId, index }: TrackCardLabelProps) {
  // Debug log to understand what's being received
  console.log(`TrackCardLabel: trackId=${trackId}, cardId=${cardId}, index=${index}`);
  
  // First try to find the card in the tarot deck
  const tarotCard = tarotCards.find(c => c.id === cardId);
  if (tarotCard?.name) {
    return <>{tarotCard.name}</>;
  }
  
  // Special case for intro card
  if (cardId === "intro") {
    return <>Introduction</>;
  }
  
  // Advanced Symbolism (Track ID 11) - Major Arcana by number (0-21)
  if (trackId === 11 && /^\d+$/.test(cardId)) {
    const cardNumber = parseInt(cardId);
    if (cardNumber >= 0 && cardNumber < majorArcanaByNumber.length) {
      return <>{majorArcanaByNumber[cardNumber]}</>;
    }
  }
  
  // Beginner's Journey (Track ID 1) - Major Arcana by name (fool, magician, etc.)
  if (trackId === 1 && majorArcanaByName[cardId]) {
    return <>{majorArcanaByName[cardId]}</>;
  }
  
  // Minor Arcana card codes for all tracks (e.g., w1, c2, s10, etc.)
  if (cardId.length >= 2) {
    const suit = cardId[0];
    const rank = cardId.substring(1);
    
    if (suitNames[suit] && rankNames[rank]) {
      return <>{rankNames[rank]} of {suitNames[suit]}</>;
    }
  }
  
  // Fallback - format card ID as readable name when possible
  if (cardId) {
    // Try to format card ID as a readable name
    return <>{cardId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')}</>;
  }
  
  // Last resort fallback - card number
  return <>Card {index + 1}</>;
}