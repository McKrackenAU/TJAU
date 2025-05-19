import { TarotCard } from '@shared/tarot-data';

/**
 * This utility provides a consistent way to get card images
 * without depending on expensive API calls or unreliable cache directories
 */

// Images that we know exist in the public directory
const ORACLE_IMAGE = "/Oracle of Illusion.png";
const CARD_BACK = "/card-back.png";

/**
 * Get the image path for a tarot card
 * Uses the oracle-of-illusion.png image we know exists
 * as a reliable fallback that matches the card style
 * 
 * @param card The tarot card to get an image for
 * @returns Path to the card image
 */
export function getCardFrontImagePath(card: TarotCard): string {
  // For this implementation, we'll use the Oracle of Illusion image for all cards
  // This ensures that we have a consistent, reliable image for all cards
  // that matches the existing design aesthetic
  return ORACLE_IMAGE;
}

/**
 * Get detailed information about a card image
 * 
 * @param card The tarot card
 * @returns Card image info including path and description
 */
export function getCardImageInfo(card: TarotCard) {
  return {
    path: getCardFrontImagePath(card),
    description: `${card.name} - ${card.description?.substring(0, 100)}...`
  };
}