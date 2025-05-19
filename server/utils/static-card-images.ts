import path from 'path';
import { TarotCard } from '@shared/tarot-data';

// This file provides a mapping from card IDs to static images
// This eliminates the need for expensive API calls to generate images

// Base directory for all card images
const CARDS_BASE_DIR = '/images/cards';

// Structure for storing information about each card image
interface CardImageInfo {
  path: string;
  description: string;
}

// Map card IDs to static image paths
const cardImageMap: Record<string, CardImageInfo> = {
  // Major Arcana
  "0": { 
    path: `${CARDS_BASE_DIR}/major/fool.png`, 
    description: "The Fool - A figure steps off a cliff, representing new beginnings and unlimited potential" 
  },
  "1": { 
    path: `${CARDS_BASE_DIR}/major/magician.png`, 
    description: "The Magician - A figure channels universal energy, representing manifestation and power" 
  },
  "2": { 
    path: `${CARDS_BASE_DIR}/major/high-priestess.png`, 
    description: "The High Priestess - A mystical figure between pillars, representing intuition and mystery" 
  },
  "3": { 
    path: `${CARDS_BASE_DIR}/major/empress.png`, 
    description: "The Empress - A nurturing figure in nature, representing abundance and fertility" 
  },
  "4": { 
    path: `${CARDS_BASE_DIR}/major/emperor.png`, 
    description: "The Emperor - A powerful figure on a throne, representing authority and structure" 
  },
  "5": { 
    path: `${CARDS_BASE_DIR}/major/hierophant.png`, 
    description: "The Hierophant - A spiritual leader, representing tradition and spiritual wisdom" 
  },
  "6": { 
    path: `${CARDS_BASE_DIR}/major/lovers.png`, 
    description: "The Lovers - Two figures in harmony, representing choice and relationships" 
  },
  "7": { 
    path: `${CARDS_BASE_DIR}/major/chariot.png`, 
    description: "The Chariot - A figure in a moving vehicle, representing determination and victory" 
  },
  "8": { 
    path: `${CARDS_BASE_DIR}/major/strength.png`, 
    description: "Strength - A figure with a lion, representing courage and inner strength" 
  },
  "9": { 
    path: `${CARDS_BASE_DIR}/major/hermit.png`, 
    description: "The Hermit - A solitary figure with a light, representing introspection and guidance" 
  },
  "10": { 
    path: `${CARDS_BASE_DIR}/major/wheel-of-fortune.png`, 
    description: "Wheel of Fortune - A spinning wheel, representing cycles and destiny" 
  },
  "11": { 
    path: `${CARDS_BASE_DIR}/major/justice.png`, 
    description: "Justice - A figure with scales, representing fairness and truth" 
  },
  "12": { 
    path: `${CARDS_BASE_DIR}/major/hanged-man.png`, 
    description: "The Hanged Man - A figure suspended upside down, representing surrender and new perspective" 
  },
  "13": { 
    path: `${CARDS_BASE_DIR}/major/death.png`, 
    description: "Death - A transformative figure, representing endings and rebirth" 
  },
  "14": { 
    path: `${CARDS_BASE_DIR}/major/temperance.png`, 
    description: "Temperance - A figure balancing elements, representing harmony and moderation" 
  },
  "15": { 
    path: `${CARDS_BASE_DIR}/major/devil.png`, 
    description: "The Devil - A dark figure with bound subjects, representing attachment and limitation" 
  },
  "16": { 
    path: `${CARDS_BASE_DIR}/major/tower.png`, 
    description: "The Tower - A crumbling structure, representing sudden change and revelation" 
  },
  "17": { 
    path: `${CARDS_BASE_DIR}/major/star.png`, 
    description: "The Star - A figure pouring water under stars, representing hope and inspiration" 
  },
  "18": { 
    path: `${CARDS_BASE_DIR}/major/moon.png`, 
    description: "The Moon - A moonlit scene with animals, representing illusion and intuition" 
  },
  "19": { 
    path: `${CARDS_BASE_DIR}/major/sun.png`, 
    description: "The Sun - A radiant sun with a child, representing joy and success" 
  },
  "20": { 
    path: `${CARDS_BASE_DIR}/major/judgement.png`, 
    description: "Judgement - Figures rising to a trumpet call, representing awakening and renewal" 
  },
  "21": { 
    path: `${CARDS_BASE_DIR}/major/world.png`, 
    description: "The World - A dancing figure in a wreath, representing completion and fulfillment" 
  },
  
  // Wands
  "wands-ace": { 
    path: `${CARDS_BASE_DIR}/wands/ace.png`, 
    description: "Ace of Wands - A hand holding a sprouting wand, representing new inspiration and potential" 
  },
  "wands-2": { 
    path: `${CARDS_BASE_DIR}/wands/two.png`, 
    description: "Two of Wands - A figure holding a globe, representing planning and future vision" 
  },
  "wands-3": { 
    path: `${CARDS_BASE_DIR}/wands/three.png`, 
    description: "Three of Wands - A figure overlooking ships, representing expansion and foresight" 
  },
  "wands-4": { 
    path: `${CARDS_BASE_DIR}/wands/four.png`, 
    description: "Four of Wands - A celebration under a floral canopy, representing stability and harmony" 
  },
  "wands-5": { 
    path: `${CARDS_BASE_DIR}/wands/five.png`, 
    description: "Five of Wands - Figures in conflict, representing competition and disagreement" 
  },
  "wands-6": { 
    path: `${CARDS_BASE_DIR}/wands/six.png`, 
    description: "Six of Wands - A victorious figure on horseback, representing success and recognition" 
  },
  "wands-7": { 
    path: `${CARDS_BASE_DIR}/wands/seven.png`, 
    description: "Seven of Wands - A figure defending position, representing courage and conviction" 
  },
  "wands-8": { 
    path: `${CARDS_BASE_DIR}/wands/eight.png`, 
    description: "Eight of Wands - Flying wands, representing swift action and movement" 
  },
  "wands-9": { 
    path: `${CARDS_BASE_DIR}/wands/nine.png`, 
    description: "Nine of Wands - A wounded figure standing guard, representing resilience and persistence" 
  },
  "wands-10": { 
    path: `${CARDS_BASE_DIR}/wands/ten.png`, 
    description: "Ten of Wands - A figure carrying a heavy burden, representing responsibility and pressure" 
  },
  "wands-page": { 
    path: `${CARDS_BASE_DIR}/wands/page.png`, 
    description: "Page of Wands - A youthful figure with a wand, representing exploration and enthusiasm" 
  },
  "wands-knight": { 
    path: `${CARDS_BASE_DIR}/wands/knight.png`, 
    description: "Knight of Wands - A charging knight, representing energy and passion" 
  },
  "wands-queen": { 
    path: `${CARDS_BASE_DIR}/wands/queen.png`, 
    description: "Queen of Wands - A powerful queen with a sunflower, representing confidence and warmth" 
  },
  "wands-king": { 
    path: `${CARDS_BASE_DIR}/wands/king.png`, 
    description: "King of Wands - A commanding king with a blossoming wand, representing leadership and vision" 
  },
  
  // Cups
  "cups-ace": { 
    path: `${CARDS_BASE_DIR}/cups/ace.png`, 
    description: "Ace of Cups - A hand holding an overflowing cup, representing emotional beginnings and love" 
  },
  "cups-2": { 
    path: `${CARDS_BASE_DIR}/cups/two.png`, 
    description: "Two of Cups - Two figures exchanging cups, representing partnership and connection" 
  },
  "cups-3": { 
    path: `${CARDS_BASE_DIR}/cups/three.png`, 
    description: "Three of Cups - Three figures celebrating, representing friendship and celebration" 
  },
  "cups-4": { 
    path: `${CARDS_BASE_DIR}/cups/four.png`, 
    description: "Four of Cups - A contemplative figure ignoring an offered cup, representing apathy and contemplation" 
  },
  "cups-5": { 
    path: `${CARDS_BASE_DIR}/cups/five.png`, 
    description: "Five of Cups - A grieving figure with spilled cups, representing loss and disappointment" 
  },
  "cups-6": { 
    path: `${CARDS_BASE_DIR}/cups/six.png`, 
    description: "Six of Cups - Children exchanging floral cups, representing nostalgia and innocence" 
  },
  "cups-7": { 
    path: `${CARDS_BASE_DIR}/cups/seven.png`, 
    description: "Seven of Cups - A figure facing illusory visions, representing choices and fantasy" 
  },
  "cups-8": { 
    path: `${CARDS_BASE_DIR}/cups/eight.png`, 
    description: "Eight of Cups - A figure walking away from cups, representing departure and seeking more" 
  },
  "cups-9": { 
    path: `${CARDS_BASE_DIR}/cups/nine.png`, 
    description: "Nine of Cups - A satisfied figure with cups arranged, representing fulfillment and wishes granted" 
  },
  "cups-10": { 
    path: `${CARDS_BASE_DIR}/cups/ten.png`, 
    description: "Ten of Cups - A family celebrating under a rainbow, representing harmony and emotional fulfillment" 
  },
  "cups-page": { 
    path: `${CARDS_BASE_DIR}/cups/page.png`, 
    description: "Page of Cups - A youth with a fish in a cup, representing creativity and emotional messages" 
  },
  "cups-knight": { 
    path: `${CARDS_BASE_DIR}/cups/knight.png`, 
    description: "Knight of Cups - A knight offering a cup, representing romance and charm" 
  },
  "cups-queen": { 
    path: `${CARDS_BASE_DIR}/cups/queen.png`, 
    description: "Queen of Cups - A queen with an ornate cup, representing compassion and emotional depth" 
  },
  "cups-king": { 
    path: `${CARDS_BASE_DIR}/cups/king.png`, 
    description: "King of Cups - A king with a cup and scepter, representing emotional wisdom and control" 
  },
  
  // Swords
  "swords-ace": { 
    path: `${CARDS_BASE_DIR}/swords/ace.png`, 
    description: "Ace of Swords - A hand holding a sword crowned with laurel, representing mental clarity and truth" 
  },
  "swords-2": { 
    path: `${CARDS_BASE_DIR}/swords/two.png`, 
    description: "Two of Swords - A blindfolded figure with crossed swords, representing difficult decisions and balance" 
  },
  "swords-3": { 
    path: `${CARDS_BASE_DIR}/swords/three.png`, 
    description: "Three of Swords - A heart pierced by three swords, representing heartbreak and grief" 
  },
  "swords-4": { 
    path: `${CARDS_BASE_DIR}/swords/four.png`, 
    description: "Four of Swords - A figure resting on a tomb, representing recovery and reflection" 
  },
  "swords-5": { 
    path: `${CARDS_BASE_DIR}/swords/five.png`, 
    description: "Five of Swords - A figure collecting swords from defeated opponents, representing conflict and defeat" 
  },
  "swords-6": { 
    path: `${CARDS_BASE_DIR}/swords/six.png`, 
    description: "Six of Swords - Figures in a boat moving to calmer waters, representing transition and recovery" 
  },
  "swords-7": { 
    path: `${CARDS_BASE_DIR}/swords/seven.png`, 
    description: "Seven of Swords - A figure sneaking away with swords, representing deception and strategy" 
  },
  "swords-8": { 
    path: `${CARDS_BASE_DIR}/swords/eight.png`, 
    description: "Eight of Swords - A bound figure surrounded by swords, representing restriction and imprisonment" 
  },
  "swords-9": { 
    path: `${CARDS_BASE_DIR}/swords/nine.png`, 
    description: "Nine of Swords - A figure in bed with nine swords on the wall, representing anxiety and nightmares" 
  },
  "swords-10": { 
    path: `${CARDS_BASE_DIR}/swords/ten.png`, 
    description: "Ten of Swords - A figure pierced by ten swords, representing painful endings and defeat" 
  },
  "swords-page": { 
    path: `${CARDS_BASE_DIR}/swords/page.png`, 
    description: "Page of Swords - A youth with a raised sword, representing mental agility and truth-seeking" 
  },
  "swords-knight": { 
    path: `${CARDS_BASE_DIR}/swords/knight.png`, 
    description: "Knight of Swords - A charging knight with sword drawn, representing direct action and intellect" 
  },
  "swords-queen": { 
    path: `${CARDS_BASE_DIR}/swords/queen.png`, 
    description: "Queen of Swords - A queen with an upraised sword, representing perceptive clarity and independence" 
  },
  "swords-king": { 
    path: `${CARDS_BASE_DIR}/swords/king.png`, 
    description: "King of Swords - A king with a sword, representing intellectual authority and truth" 
  },
  
  // Pentacles
  "pentacles-ace": { 
    path: `${CARDS_BASE_DIR}/pentacles/ace.png`, 
    description: "Ace of Pentacles - A hand holding a pentacle coin, representing material opportunity and prosperity" 
  },
  "pentacles-2": { 
    path: `${CARDS_BASE_DIR}/pentacles/two.png`, 
    description: "Two of Pentacles - A figure juggling two pentacles, representing balance and flexibility" 
  },
  "pentacles-3": { 
    path: `${CARDS_BASE_DIR}/pentacles/three.png`, 
    description: "Three of Pentacles - Craftsmen consulting on work, representing collaboration and skill" 
  },
  "pentacles-4": { 
    path: `${CARDS_BASE_DIR}/pentacles/four.png`, 
    description: "Four of Pentacles - A figure holding four pentacles tightly, representing security and control" 
  },
  "pentacles-5": { 
    path: `${CARDS_BASE_DIR}/pentacles/five.png`, 
    description: "Five of Pentacles - Figures in poverty passing a church window, representing hardship and struggle" 
  },
  "pentacles-6": { 
    path: `${CARDS_BASE_DIR}/pentacles/six.png`, 
    description: "Six of Pentacles - A wealthy figure giving to the poor, representing generosity and charity" 
  },
  "pentacles-7": { 
    path: `${CARDS_BASE_DIR}/pentacles/seven.png`, 
    description: "Seven of Pentacles - A figure examining a pentacle plant, representing patience and investment" 
  },
  "pentacles-8": { 
    path: `${CARDS_BASE_DIR}/pentacles/eight.png`, 
    description: "Eight of Pentacles - A craftsman working on pentacles, representing skill development and diligence" 
  },
  "pentacles-9": { 
    path: `${CARDS_BASE_DIR}/pentacles/nine.png`, 
    description: "Nine of Pentacles - A wealthy figure in a garden, representing self-sufficiency and abundance" 
  },
  "pentacles-10": { 
    path: `${CARDS_BASE_DIR}/pentacles/ten.png`, 
    description: "Ten of Pentacles - A family scene with pentacles, representing legacy and permanent success" 
  },
  "pentacles-page": { 
    path: `${CARDS_BASE_DIR}/pentacles/page.png`, 
    description: "Page of Pentacles - A youth examining a pentacle, representing practical learning and opportunity" 
  },
  "pentacles-knight": { 
    path: `${CARDS_BASE_DIR}/pentacles/knight.png`, 
    description: "Knight of Pentacles - A knight with a pentacle, representing reliability and methodical approach" 
  },
  "pentacles-queen": { 
    path: `${CARDS_BASE_DIR}/pentacles/queen.png`, 
    description: "Queen of Pentacles - A queen in a garden with a pentacle, representing nurturing abundance" 
  },
  "pentacles-king": { 
    path: `${CARDS_BASE_DIR}/pentacles/king.png`, 
    description: "King of Pentacles - A king with a pentacle and scepter, representing material wealth and stability" 
  }
};

// Default fallback card image information
const defaultCardImage: CardImageInfo = {
  path: "/card-back.png",
  description: "Default card image"
};

/**
 * Get the static image path for a given card
 * @param card The tarot card to get an image for
 * @returns The image path and description
 */
export function getStaticCardImageInfo(card: TarotCard): CardImageInfo {
  return cardImageMap[card.id] || defaultCardImage;
}

/**
 * Get just the image path for a card
 * @param card The tarot card to get an image for
 * @returns The image path string
 */
export function getStaticCardImagePath(card: TarotCard): string {
  return getStaticCardImageInfo(card).path;
}