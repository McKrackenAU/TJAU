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
  // Additional cards would be defined here
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
