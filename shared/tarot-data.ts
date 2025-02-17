export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: string;
  number?: number;
  meanings: {
    upright: string[];
    reversed: string[];
  };
  description: string;
  element?: string;
}

export const tarotCards: TarotCard[] = [
  {
    id: "0",
    name: "The Fool",
    arcana: "major",
    number: 0,
    meanings: {
      upright: ["New beginnings", "Innocence", "Adventure"],
      reversed: ["Recklessness", "Risk-taking", "Foolishness"]
    },
    description: "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.",
    element: "Air"
  },
  {
    id: "w1",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    number: 1,
    meanings: {
      upright: ["Creation", "Willpower", "Inspiration", "Desire"],
      reversed: ["Lack of energy", "Lack of passion", "Delays"]
    },
    description: "The Ace of Wands represents new opportunities, inspiration, and growth potential. It suggests a spark of creativity or the beginning of a new venture.",
    element: "Fire"
  },
  {
    id: "c1",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    number: 1,
    meanings: {
      upright: ["Love", "Compassion", "Creativity"],
      reversed: ["Blocked emotions", "Loss of love", "Emptiness"]
    },
    description: "The Ace of Cups represents emotional new beginnings, intuition, and the flowing of creative energies.",
    element: "Water"
  },
  {
    id: "s1",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    number: 1,
    meanings: {
      upright: ["Clarity", "Truth", "Breakthrough"],
      reversed: ["Confusion", "Brutality", "Chaos"]
    },
    description: "The Ace of Swords represents mental clarity, truth, and new ideas. It suggests breakthrough moments and clear thinking.",
    element: "Air"
  },
  {
    id: "p1",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 1,
    meanings: {
      upright: ["Prosperity", "Abundance", "Security"],
      reversed: ["Loss", "Missed opportunity", "Scarcity"]
    },
    description: "The Ace of Pentacles represents material abundance, prosperity, and new financial or career opportunities.",
    element: "Earth"
  }
];

export const spreads = {
  threeCard: {
    id: "three-card",
    name: "Past-Present-Future",
    positions: ["Past", "Present", "Future"],
    description: "A simple spread that gives insight into the flow of events."
  },
  celticCross: {
    id: "celtic-cross",
    name: "Celtic Cross",
    positions: ["Present", "Challenge", "Past", "Future", "Above", "Below", "Advice", "External", "Hopes/Fears", "Outcome"],
    description: "A comprehensive spread that examines multiple aspects of a situation."
  }
};