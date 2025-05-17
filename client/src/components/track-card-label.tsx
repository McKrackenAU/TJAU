import React from 'react';
import { tarotCards } from "@shared/tarot-data";

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
  // Try to find the card in the tarot deck first
  const tarotCard = tarotCards.find(c => c.id === cardId);
  
  // If we have a card from the tarot deck, use its name
  if (tarotCard?.name) {
    return <>{tarotCard.name}</>;
  }
  
  // Otherwise handle by track type
  // ========== BEGINNER'S JOURNEY (Major Arcana by name) ==========
  if (trackId === 1) {
    const majorArcanaNames: Record<string, string> = {
      // Direct mapping for Beginner's Journey track
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

    // Direct lookup for Beginner's Journey
    if (majorArcanaNames[cardId]) {
      return <>{majorArcanaNames[cardId]}</>;
    }
  }
  
  // ========== MINOR ARCANA JOURNEY (Intro + Cards by Suit/Rank) ==========
  else if (trackId === 2) {
    // Special case for intro card
    if (cardId === "intro") {
      return <>Introduction</>;
    }
    
    // Handle Minor Arcana card codes (e.g., w1, c2, etc.)
    if (cardId.length >= 2) {
      const suit = cardId[0];
      const rank = cardId.substring(1);
      
      // Maps for suits and ranks
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
      
      if (suitNames[suit] && rankNames[rank]) {
        return <>{rankNames[rank]} of {suitNames[suit]}</>;
      }
    }
  }
  
  // ========== ADVANCED SYMBOLISM (Major Arcana by number + Minor Arcana) ==========
  else if (trackId === 11) {
    // Major Arcana - Handle by number (0-21)
    if (/^\d+$/.test(cardId)) {
      // Explicit array for major arcana names
      const majorArcanaNames = [
        "The Fool", "The Magician", "The High Priestess", "The Empress",
        "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
        "Strength", "The Hermit", "Wheel of Fortune", "Justice",
        "The Hanged Man", "Death", "Temperance", "The Devil",
        "The Tower", "The Star", "The Moon", "The Sun",
        "Judgement", "The World"
      ];
      
      const cardNumber = parseInt(cardId);
      if (cardNumber >= 0 && cardNumber < majorArcanaNames.length) {
        return <>{majorArcanaNames[cardNumber]}</>;
      }
    }
    
    // Handle Minor Arcana cards (e.g., w1, c2, etc.)
    if (cardId.length >= 2) {
      const suit = cardId[0];
      const rank = cardId.substring(1);
      
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
      
      if (suitNames[suit] && rankNames[rank]) {
        return <>{rankNames[rank]} of {suitNames[suit]}</>;
      }
    }
  }
  
  // ========== INTUITIVE READING (Minor Arcana) ==========
  else if (trackId === 10) {
    // Handle Minor Arcana cards
    if (cardId.length >= 2) {
      const suit = cardId[0];
      const rank = cardId.substring(1);
      
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
      
      if (suitNames[suit] && rankNames[rank]) {
        return <>{rankNames[rank]} of {suitNames[suit]}</>;
      }
    }
  }
  
  // For any other tracks or if no match was found, format the card ID nicely or use a fallback
  if (cardId) {
    // Try to format card ID as a readable name
    return <>{cardId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')}</>;
  }
  
  // Last resort fallback - card number
  return <>Card {index + 1}</>;
}