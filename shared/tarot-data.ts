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
  },
  {
    id: "w5",
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    number: 5,
    meanings: {
      upright: ["Competition", "Conflict", "Creative tension"],
      reversed: ["Avoiding conflict", "Tension release", "Resisting change"]
    },
    description: "The Five of Wands represents competition, conflict, and creative tension. It suggests growth through challenge and the productive clash of different ideas.",
    element: "Fire"
  },
  {
    id: "c5",
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    number: 5,
    meanings: {
      upright: ["Loss", "Grief", "Disappointment", "Regret"],
      reversed: ["Acceptance", "Moving on", "Finding what remains"]
    },
    description: "The Five of Cups represents emotional disappointment, grief, and loss. It also reminds us that not everything is lost, and that recovery begins with acknowledging what remains.",
    element: "Water"
  },
  {
    id: "s5",
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    number: 5,
    meanings: {
      upright: ["Conflict", "Defeat", "Win at all costs", "Disagreement"],
      reversed: ["Reconciliation", "Making amends", "Release from conflict"]
    },
    description: "The Five of Swords represents conflict, tension, and the aftermath of battles. It suggests the hollow nature of some victories and the importance of perspective.",
    element: "Air"
  },
  {
    id: "p5",
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 5,
    meanings: {
      upright: ["Hardship", "Poverty", "Isolation", "Worry"],
      reversed: ["Recovery", "Finding help", "Spiritual growth despite material loss"]
    },
    description: "The Five of Pentacles represents material hardship, health challenges, or feelings of exclusion. It reminds us that help and resources may be available even when overlooked.",
    element: "Earth"
  },
  {
    id: "w6",
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    number: 6,
    meanings: {
      upright: ["Victory", "Recognition", "Public reward", "Progress"],
      reversed: ["Fall from grace", "Egotism", "Self-doubt", "Excessive pride"]
    },
    description: "The Six of Wands represents achievement, recognition, and the rewards of effort. It suggests victory and public acknowledgment of success.",
    element: "Fire"
  },
  {
    id: "c6",
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    number: 6,
    meanings: {
      upright: ["Nostalgia", "Childhood memories", "Innocence", "Joy"],
      reversed: ["Stuck in the past", "Unrealistic memories", "Moving forward"]
    },
    description: "The Six of Cups represents nostalgia, innocence, and reunion with people or elements from the past. It suggests finding joy in simple pleasures and positive memories.",
    element: "Water"
  },
  {
    id: "s6",
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    number: 6,
    meanings: {
      upright: ["Transition", "Moving on", "Leaving behind", "Mental progress"],
      reversed: ["Emotional baggage", "Resistance to change", "Unfinished business"]
    },
    description: "The Six of Swords represents transition, moving away from difficulty, and gradual progress toward healing. It suggests the journey from turbulent to calmer waters.",
    element: "Air"
  },
  {
    id: "p6",
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 6,
    meanings: {
      upright: ["Generosity", "Charity", "Giving", "Receiving"],
      reversed: ["Strings attached", "Power imbalance", "Self-interest"]
    },
    description: "The Six of Pentacles represents generosity, sharing wealth, and the balance of giving and receiving. It suggests material support flowing where it is needed.",
    element: "Earth"
  },
  {
    id: "w7",
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    number: 7,
    meanings: {
      upright: ["Defense", "Perseverance", "Standing your ground", "Conviction"],
      reversed: ["Exhaustion", "Giving up", "Overwhelmed", "Surrender"]
    },
    description: "The Seven of Wands represents standing your ground, defending your position, and persevering against challenges or opposition. It suggests the courage to maintain your stance despite pressure.",
    element: "Fire"
  },
  {
    id: "c7",
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    number: 7,
    meanings: {
      upright: ["Choices", "Fantasy", "Illusion", "Possibilities"],
      reversed: ["Clarity", "Focus", "Commitment", "Reality check"]
    },
    description: "The Seven of Cups represents choices, fantasy, and multiple possibilities that may not all be realistic. It suggests the need to distinguish between illusion and achievable options.",
    element: "Water"
  },
  {
    id: "s7",
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    number: 7,
    meanings: {
      upright: ["Deception", "Strategy", "Sneakiness", "Mental agility"],
      reversed: ["Confession", "Exposure", "Rethinking approach", "Coming clean"]
    },
    description: "The Seven of Swords represents strategic thinking, but also potential deception or taking shortcuts. It suggests employing cleverness while considering ethical implications.",
    element: "Air"
  },
  {
    id: "p7",
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 7,
    meanings: {
      upright: ["Patience", "Assessment", "Investment", "Long-term view"],
      reversed: ["Poor planning", "Lack of progress", "Impatience", "Missed opportunities"]
    },
    description: "The Seven of Pentacles represents assessment, patience, and the evaluation of long-term investments. It suggests the importance of reviewing progress and considering future growth.",
    element: "Earth"
  },
  {
    id: "w8",
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    number: 8,
    meanings: {
      upright: ["Speed", "Action", "Movement", "Quick decisions"],
      reversed: ["Delays", "Frustration", "Slowing down", "Obstacles"]
    },
    description: "The Eight of Wands represents swift action, movement, and decision-making. It suggests a time of acceleration, progress, and things coming together quickly.",
    element: "Fire"
  },
  {
    id: "c8",
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    number: 8,
    meanings: {
      upright: ["Walking away", "Abandonment", "Seeking more", "Moving on"],
      reversed: ["Fear of change", "Clinging to the past", "Avoidance"]
    },
    description: "The Eight of Cups represents emotional detachment, walking away from something that no longer serves you, and seeking deeper meaning or fulfillment in life.",
    element: "Water"
  },
  {
    id: "s8",
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    number: 8,
    meanings: {
      upright: ["Restriction", "Imprisonment", "Self-victimization", "Mental traps"],
      reversed: ["Self-acceptance", "Freedom", "New perspective"]
    },
    description: "The Eight of Swords represents feeling trapped, restricted, and victimized by circumstances. It suggests mental imprisonment and the inability to see solutions.",
    element: "Air"
  },
  {
    id: "p8",
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 8,
    meanings: {
      upright: ["Skill development", "Craftsmanship", "Diligence", "Quality work"],
      reversed: ["Lack of focus", "Shortcuts", "Perfectionism"]
    },
    description: "The Eight of Pentacles represents dedication to craftsmanship, skill development, and focused work. It suggests a time of learning, apprenticeship, and perfecting your trade.",
    element: "Earth"
  },
  {
    id: "w9",
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    number: 9,
    meanings: {
      upright: ["Resilience", "Persistence", "Last stand", "Boundaries"],
      reversed: ["Exhaustion", "Giving up", "Overwhelmed"]
    },
    description: "The Nine of Wands represents resilience, perseverance, and defensive strength when nearing the completion of a challenging journey. It embodies standing firm despite fatigue.",
    element: "Fire"
  },
  {
    id: "c9",
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    number: 9,
    meanings: {
      upright: ["Emotional fulfillment", "Wishes coming true", "Contentment", "Satisfaction"],
      reversed: ["Dissatisfaction", "Materialism", "Overindulgence"]
    },
    description: "The Nine of Cups represents emotional satisfaction, wish fulfillment, and the contentment that comes from manifesting our desires. Often called the 'Wish Card' in tarot.",
    element: "Water"
  },
  {
    id: "s9",
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    number: 9,
    meanings: {
      upright: ["Anxiety", "Worry", "Fear", "Depression"],
      reversed: ["Hopelessness", "Releasing fear", "Facing anxiety"]
    },
    description: "The Nine of Swords represents mental anguish, anxiety, and the suffering created when worried thoughts dominate our minds. It shows that problems often seem magnified in darkness.",
    element: "Air"
  },
  {
    id: "p9",
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 9,
    meanings: {
      upright: ["Self-sufficiency", "Financial independence", "Luxury", "Self-discipline"],
      reversed: ["Codependence", "Financial setback", "Overindependence"]
    },
    description: "The Nine of Pentacles represents self-sufficiency, cultivated abundance, and the refined rewards that come through discipline and patience. It embodies material independence.",
    element: "Earth"
  },
  {
    id: "w10",
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    number: 10,
    meanings: {
      upright: ["Burden", "Responsibility", "Hard work", "Completion"],
      reversed: ["Inability to delegate", "Overwhelmed", "Collapse"]
    },
    description: "The Ten of Wands represents the burdens and responsibilities we carry when we've taken on too much. It shows the final stage of a journey but with the weight of accumulated obligations.",
    element: "Fire"
  },
  {
    id: "c10",
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    number: 10,
    meanings: {
      upright: ["Harmony", "Emotional fulfillment", "Family contentment", "Perfect love"],
      reversed: ["Broken home", "Dysfunctional family", "Disconnection"]
    },
    description: "The Ten of Cups represents emotional fulfillment, particularly in family and community bonds. It embodies the happiness and contentment that come from harmonious relationships and shared values.",
    element: "Water"
  },
  {
    id: "s10",
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    number: 10,
    meanings: {
      upright: ["Painful endings", "Deep wounds", "Betrayal", "Loss", "Crisis"],
      reversed: ["Recovery", "Regeneration", "Resisting an inevitable end"]
    },
    description: "The Ten of Swords represents a painful ending or rock bottom moment. It signifies the completion of a difficult situation, suggesting that while this ending may be painful, it also creates space for renewal.",
    element: "Air"
  },
  {
    id: "p10",
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 10,
    meanings: {
      upright: ["Wealth", "Family", "Establishment", "Inheritance", "Long-term success"],
      reversed: ["Financial failure", "Family problems", "Loss of legacy"]
    },
    description: "The Ten of Pentacles represents long-term wealth, family legacy, and the establishment of permanent foundations. It embodies the culmination of material efforts into lasting prosperity across generations.",
    element: "Earth"
  },
  {
    id: "wp",
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    number: 11,
    meanings: {
      upright: ["Enthusiasm", "Exploration", "Discovery", "Free spirit"],
      reversed: ["Lack of direction", "Procrastination", "Hastiness"]
    },
    description: "The Page of Wands represents the spark of a new idea or passion, the initial enthusiasm of starting a creative journey, and the adventurous exploration of new possibilities.",
    element: "Fire"
  },
  {
    id: "cp",
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    number: 11,
    meanings: {
      upright: ["Creativity", "Intuition", "Sensitivity", "New feelings"],
      reversed: ["Emotional immaturity", "Insecurity", "Blocked creativity"]
    },
    description: "The Page of Cups represents new emotional beginnings, creative inspiration from the unconscious, and the innocent, open-hearted approach to emotional experiences.",
    element: "Water"
  },
  {
    id: "sp",
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    number: 11,
    meanings: {
      upright: ["Curiosity", "Mental agility", "New ideas", "Vigilance"],
      reversed: ["Deception", "Gossip", "Scattered thoughts", "Harsh words"]
    },
    description: "The Page of Swords represents intellectual curiosity, mental alertness, and the beginnings of new ways of thinking. It embodies the energy of seeking truth and gathering information.",
    element: "Air"
  },
  {
    id: "pp",
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 11,
    meanings: {
      upright: ["Manifestation", "Study", "Patience", "New opportunity"],
      reversed: ["Lack of progress", "Procrastination", "Laziness"]
    },
    description: "The Page of Pentacles represents the initial stages of manifesting material goals, the patient student approach to practical matters, and the discovery of new opportunities for growth and prosperity.",
    element: "Earth"
  },
  {
    id: "wk",
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    number: 14,
    meanings: {
      upright: ["Leadership", "Vision", "Entrepreneurship", "Honor"],
      reversed: ["Impulsiveness", "Domination", "Harshness", "Ruthlessness"]
    },
    description: "The King of Wands represents visionary leadership, creative authority, and the mastery of inspiration and passion. He embodies the energy of bold action guided by experience and charismatic influence.",
    element: "Fire"
  },
  {
    id: "ck",
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    number: 14,
    meanings: {
      upright: ["Emotional balance", "Compassion", "Diplomacy", "Wisdom"],
      reversed: ["Emotional manipulation", "Moodiness", "Coldness"]
    },
    description: "The King of Cups represents emotional wisdom, compassionate leadership, and the mastery of feelings. He embodies the balance of heart and head, showing how to remain in control while still being connected to emotions.",
    element: "Water"
  },
  {
    id: "sk",
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    number: 14,
    meanings: {
      upright: ["Intellectual power", "Authority", "Truth", "Mental clarity"],
      reversed: ["Abuse of power", "Manipulation", "Cruelty", "Dogmatism"]
    },
    description: "The King of Swords represents intellectual authority, clear judgment, and the mastery of thought and communication. He embodies the power of objective truth and ethical decision-making based on impartial wisdom.",
    element: "Air"
  },
  {
    id: "pk",
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 14,
    meanings: {
      upright: ["Abundance", "Security", "Business acumen", "Wealth"],
      reversed: ["Greed", "Materialism", "Stubbornness", "Inflexibility"]
    },
    description: "The King of Pentacles represents material mastery, practical wisdom, and accomplished prosperity. He embodies security, reliability, and the ability to create lasting wealth through methodical effort and sound management.",
    element: "Earth"
  },
  {
    id: "wq",
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    number: 13,
    meanings: {
      upright: ["Confidence", "Independence", "Social butterfly", "Determination"],
      reversed: ["Demanding", "Jealous", "Insecure", "Selfish"]
    },
    description: "The Queen of Wands represents confident self-expression, passionate independence, and the nurturing of creative potential. She embodies the balance of fiery determination with warmth and social magnetism.",
    element: "Fire"
  },
  {
    id: "cq",
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    number: 13,
    meanings: {
      upright: ["Compassionate", "Caring", "Emotionally stable", "Intuitive", "Nurturing"],
      reversed: ["Overly emotional", "Insecure", "Dependent", "Martyr mentality"]
    },
    description: "The Queen of Cups represents emotional nurturing, intuitive wisdom, and the flowing depths of compassion. She embodies the balance of deep feeling with healthy boundaries, showing how to care for others while honoring one's own emotional needs.",
    element: "Water"
  },
  {
    id: "sq",
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    number: 13,
    meanings: {
      upright: ["Independent", "Objective", "Clear-minded", "Perceptive"],
      reversed: ["Cold", "Bitter", "Harsh", "Sharp-tongued"]
    },
    description: "The Queen of Swords represents clear perception, independent thinking, and the ability to separate truth from illusion. She embodies the balance of sharp intellect with compassionate wisdom, cutting through confusion with both honesty and grace.",
    element: "Air"
  },
  {
    id: "pq",
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 13,
    meanings: {
      upright: ["Nurturing", "Practical", "Providing", "Security-focused", "Abundance"],
      reversed: ["Smothering", "Materialistic", "Status-focused", "Worrying"]
    },
    description: "The Queen of Pentacles represents nurturing abundance, practical wisdom, and the creation of comfort and security. She embodies the balance of material competence with generous care, showing how to build prosperity that sustains both self and others.",
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