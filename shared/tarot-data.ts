export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor' | 'custom';
  suit?: string;
  number?: number;
  meanings: {
    upright: string[];
    reversed: string[];
  };
  description: string;
  element?: string;
  imageUrl?: string;
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
  },
  {
    id: "w2",
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    number: 2,
    meanings: {
      upright: ["Planning", "First steps", "Making decisions", "Future planning"],
      reversed: ["Fear of change", "Disorganization", "Bad planning"]
    },
    description: "The Two of Wands represents planning for the future with a broader perspective and making decisions that will determine the path forward.",
    element: "Fire"
  },
  {
    id: "c2",
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    number: 2,
    meanings: {
      upright: ["Connection", "Partnership", "Mutual attraction"],
      reversed: ["Imbalance", "Broken communication", "Tension"]
    },
    description: "The Two of Cups represents partnership, romantic relationships, and balanced connections between people. It signifies mutual attraction and harmony.",
    element: "Water"
  },
  {
    id: "s2",
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    number: 2,
    meanings: {
      upright: ["Difficult choices", "Stalemate", "Balance"],
      reversed: ["Indecision", "Confusion", "Information overload"]
    },
    description: "The Two of Swords represents difficult decisions, avoidance, and emotional or mental stalemate. It suggests a need to remove blindfolds and face reality.",
    element: "Air"
  },
  {
    id: "p2",
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 2,
    meanings: {
      upright: ["Balance", "Adaptability", "Juggling priorities"],
      reversed: ["Disorganization", "Overwhelm", "Inflexibility"]
    },
    description: "The Two of Pentacles represents juggling multiple responsibilities and adapting to change. It suggests maintaining balance amid fluctuating circumstances.",
    element: "Earth"
  },
  {
    id: "w3",
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    number: 3,
    meanings: {
      upright: ["Expansion", "Foresight", "Overseas opportunities"],
      reversed: ["Obstacles", "Delays", "Limited perspective"]
    },
    description: "The Three of Wands represents expansion, looking to the future, and watching plans unfold. It suggests new horizons and opportunities.",
    element: "Fire"
  },
  {
    id: "c3",
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    number: 3,
    meanings: {
      upright: ["Celebration", "Friendship", "Community"],
      reversed: ["Overindulgence", "Gossip", "Isolation"]
    },
    description: "The Three of Cups represents celebration, friendship, and creative collaborations. It suggests joyful gatherings and emotional support systems.",
    element: "Water"
  },
  {
    id: "s3",
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    number: 3,
    meanings: {
      upright: ["Heartbreak", "Emotional pain", "Grief"],
      reversed: ["Recovery", "Forgiveness", "Moving on"]
    },
    description: "The Three of Swords represents heartbreak, emotional pain, and grief. It suggests difficult truths and the process of working through sorrow.",
    element: "Air"
  },
  {
    id: "p3",
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 3,
    meanings: {
      upright: ["Teamwork", "Collaboration", "Learning"],
      reversed: ["Lack of cohesion", "Disorganization", "Poor workmanship"]
    },
    description: "The Three of Pentacles represents skilled work, collaboration, and learning. It suggests recognition for your skills and working well with others.",
    element: "Earth"
  },
  {
    id: "w4",
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    number: 4,
    meanings: {
      upright: ["Celebration", "Harmony", "Home", "Community"],
      reversed: ["Transition", "Lack of support", "Instability"]
    },
    description: "The Four of Wands represents celebration, harmony, and milestone achievements. It suggests a stable foundation and a sense of belonging.",
    element: "Fire"
  },
  {
    id: "c4",
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    number: 4,
    meanings: {
      upright: ["Apathy", "Contemplation", "Disconnection"],
      reversed: ["New possibilities", "Openness", "Choosing happiness"]
    },
    description: "The Four of Cups represents apathy, disconnection, and introspection. It suggests dissatisfaction with current options and a need for emotional reassessment.",
    element: "Water"
  },
  {
    id: "s4",
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    number: 4,
    meanings: {
      upright: ["Rest", "Contemplation", "Recovery"],
      reversed: ["Restlessness", "Burnout", "Stress"]
    },
    description: "The Four of Swords represents rest, recuperation, and contemplation. It suggests taking time for mental and physical healing.",
    element: "Air"
  },
  {
    id: "p4",
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 4,
    meanings: {
      upright: ["Security", "Control", "Saving money"],
      reversed: ["Greed", "Materialism", "Letting go"]
    },
    description: "The Four of Pentacles represents security, control, and conservation of resources. It suggests a need for balance between holding on and letting go.",
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