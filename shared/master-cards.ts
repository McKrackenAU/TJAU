/**
 * Master Card Database - Single source of truth for all cards
 * This eliminates duplicates and provides permanent image paths
 */

export interface MasterCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor' | 'custom';
  suit?: string;
  number?: number;
  imagePath: string;
  meanings: {
    upright: string[];
    reversed: string[];
  };
  description: string;
  element?: string;
}

export const masterCards: MasterCard[] = [
  // Major Arcana
  {
    id: '0',
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    imagePath: '/assets/cards/the-fool.png',
    meanings: {
      upright: ['New beginnings', 'Innocence', 'Adventure'],
      reversed: ['Recklessness', 'Risk-taking', 'Foolishness']
    },
    description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
    element: 'Air'
  },
  
  // Wands
  {
    id: 'w1',
    name: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 1,
    imagePath: '/assets/cards/ace-of-wands.png',
    meanings: {
      upright: ['Creation', 'Willpower', 'Inspiration', 'Desire'],
      reversed: ['Lack of energy', 'Lack of passion', 'Delays']
    },
    description: 'The Ace of Wands represents new opportunities, inspiration, and growth potential. It suggests a spark of creativity or the beginning of a new venture.',
    element: 'Fire'
  },
  {
    id: 'w2',
    name: 'Two of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 2,
    imagePath: '/assets/cards/two-of-wands.png',
    meanings: {
      upright: ['Planning', 'First steps', 'Making decisions', 'Future planning'],
      reversed: ['Fear of change', 'Disorganization', 'Bad planning']
    },
    description: 'The Two of Wands represents planning for the future with a broader perspective and making decisions that will determine the path forward.',
    element: 'Fire'
  },
  {
    id: 'w3',
    name: 'Three of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 3,
    imagePath: '/assets/cards/three-of-wands.png',
    meanings: {
      upright: ['Expansion', 'Foresight', 'Overseas opportunities'],
      reversed: ['Playing it safe', 'Lack of foresight', 'Unexpected delays']
    },
    description: 'The Three of Wands represents expansion, looking ahead, and long-term planning. It suggests that your efforts are beginning to pay off.',
    element: 'Fire'
  },
  {
    id: 'w4',
    name: 'Four of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 4,
    imagePath: '/assets/cards/four-of-wands.png',
    meanings: {
      upright: ['Celebration', 'Joy', 'Harmony', 'Relaxation'],
      reversed: ['Personal celebration', 'Inner harmony', 'Conflict with others']
    },
    description: 'The Four of Wands represents celebration, harmony, and achievement. It suggests a time of stability and joy.',
    element: 'Fire'
  },
  {
    id: 'w5',
    name: 'Five of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 5,
    imagePath: '/assets/cards/five-of-wands.png',
    meanings: {
      upright: ['Competition', 'Conflict', 'Tension'],
      reversed: ['Inner conflict', 'Conflict avoidance', 'Finding common ground']
    },
    description: 'The Five of Wands represents competition, conflict, and challenges. It suggests a time of struggle and disagreement.',
    element: 'Fire'
  },
  {
    id: 'w6',
    name: 'Six of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 6,
    imagePath: '/assets/cards/six-of-wands.png',
    meanings: {
      upright: ['Success', 'Public recognition', 'Progress'],
      reversed: ['Private achievement', 'Personal definition of success', 'Fall from grace']
    },
    description: 'The Six of Wands represents success, victory, and public recognition. It suggests achievement and progress.',
    element: 'Fire'
  },
  {
    id: 'w7',
    name: 'Seven of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 7,
    imagePath: '/assets/cards/seven-of-wands.png',
    meanings: {
      upright: ['Challenge', 'Competition', 'Perseverance'],
      reversed: ['Exhaustion', 'Giving up', 'Overwhelmed']
    },
    description: 'The Seven of Wands represents challenge, competition, and standing your ground. It suggests defending your position.',
    element: 'Fire'
  },
  {
    id: 'w8',
    name: 'Eight of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 8,
    imagePath: '/assets/cards/eight-of-wands.png',
    meanings: {
      upright: ['Speed', 'Movement', 'Quick decisions'],
      reversed: ['Delays', 'Frustration', 'Resisting change']
    },
    description: 'The Eight of Wands represents swift action, movement, and rapid change. It suggests things are happening quickly.',
    element: 'Fire'
  },
  {
    id: 'w9',
    name: 'Nine of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 9,
    imagePath: '/assets/cards/nine-of-wands.png',
    meanings: {
      upright: ['Persistence', 'Test of faith', 'Resilience'],
      reversed: ['Inner resources', 'Struggle', 'Overwhelm']
    },
    description: 'The Nine of Wands represents persistence, resilience, and standing firm. It suggests you\'re almost at the finish line.',
    element: 'Fire'
  },
  {
    id: 'w10',
    name: 'Ten of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 10,
    imagePath: '/assets/cards/ten-of-wands.png',
    meanings: {
      upright: ['Burden', 'Hard work', 'Accomplishment'],
      reversed: ['Doing it all', 'Carrying the load', 'Delegation']
    },
    description: 'The Ten of Wands represents burden, responsibility, and hard work. It suggests you may be taking on too much.',
    element: 'Fire'
  },
  {
    id: 'wp',
    name: 'Page of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 11,
    imagePath: '/assets/cards/page-of-wands.png',
    meanings: {
      upright: ['Inspiration', 'Ideas', 'Discovery'],
      reversed: ['Lack of direction', 'No clear plan', 'Distractions']
    },
    description: 'The Page of Wands represents inspiration, discovery, and limitless potential. It suggests new creative projects.',
    element: 'Fire'
  },
  {
    id: 'wn',
    name: 'Knight of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 12,
    imagePath: '/assets/cards/knight-of-wands.png',
    meanings: {
      upright: ['Energy', 'Passion', 'Adventure', 'Impulsiveness'],
      reversed: ['Haste', 'Scattered energy', 'Delays', 'Frustration']
    },
    description: 'The Knight of Wands represents energy, passion, and adventurous pursuit. He embodies enthusiasm and bold action.',
    element: 'Fire'
  },
  {
    id: 'wq',
    name: 'Queen of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 13,
    imagePath: '/assets/cards/queen-of-wands.png',
    meanings: {
      upright: ['Confidence', 'Independence', 'Social butterfly', 'Determination'],
      reversed: ['Demanding', 'Jealous', 'Insecure', 'Selfish']
    },
    description: 'The Queen of Wands represents confident self-expression, passionate independence, and the nurturing of creative potential.',
    element: 'Fire'
  },
  {
    id: 'wk',
    name: 'King of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 14,
    imagePath: '/assets/cards/king-of-wands.png',
    meanings: {
      upright: ['Leadership', 'Vision', 'Honor'],
      reversed: ['Impulsiveness', 'Haste', 'Ruthless']
    },
    description: 'The King of Wands represents natural-born leadership, vision, and entrepreneurial spirit.',
    element: 'Fire'
  },

  // Cups
  {
    id: 'c1',
    name: 'Ace of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 1,
    imagePath: '/authentic-cards/minor-arcana/cups/ace-of-cups.png',
    meanings: {
      upright: ['Love', 'Compassion', 'Creativity'],
      reversed: ['Blocked emotions', 'Loss of love', 'Emptiness']
    },
    description: 'The Ace of Cups represents emotional new beginnings, intuition, and the flowing of creative energies.',
    element: 'Water'
  },
  {
    id: 'c2',
    name: 'Two of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 2,
    imagePath: '/authentic-cards/minor-arcana/cups/two-of-cups.png',
    meanings: {
      upright: ['Unity', 'Partnership', 'Connection'],
      reversed: ['Self-love', 'Break-ups', 'Disharmony']
    },
    description: 'The Two of Cups represents partnership, mutual attraction, and unity of hearts and minds.',
    element: 'Water'
  },
  {
    id: 'c3',
    name: 'Three of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 3,
    imagePath: '/authentic-cards/minor-arcana/cups/three-of-cups.png?v=2025',
    meanings: {
      upright: ['Celebration', 'Friendship', 'Creativity', 'Community'],
      reversed: ['Independence', 'Social disconnection']
    },
    description: 'The Three of Cups represents celebration, friendship, and joyous gatherings with loved ones.',
    element: 'Water'
  },
  {
    id: 'c4',
    name: 'Four of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 4,
    imagePath: '/authentic-cards/minor-arcana/cups/four-of-cups.png',
    meanings: {
      upright: ['Meditation', 'Contemplation', 'Apathy'],
      reversed: ['Retreat', 'Withdrawal', 'Checking in']
    },
    description: 'The Four of Cups represents contemplation, apathy, and reevaluating your priorities.',
    element: 'Water'
  },
  {
    id: 'c5',
    name: 'Five of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 5,
    imagePath: '/authentic-cards/minor-arcana/cups/five-of-cups.png',
    meanings: {
      upright: ['Regret', 'Failure', 'Disappointment', 'Pessimism'],
      reversed: ['Personal setbacks', 'Self-forgiveness', 'Moving on']
    },
    description: 'The Five of Cups represents disappointment, regret, and loss. It suggests focusing on what remains.',
    element: 'Water'
  },
  {
    id: 'c6',
    name: 'Six of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 6,
    imagePath: '/authentic-cards/minor-arcana/cups/six-of-cups.png',
    meanings: {
      upright: ['Revisiting the past', 'Childhood memories', 'Innocence'],
      reversed: ['Living in the past', 'Forgiveness', 'Lacking playfulness']
    },
    description: 'The Six of Cups represents nostalgia, childhood memories, and innocence.',
    element: 'Water'
  },
  {
    id: 'c7',
    name: 'Seven of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 7,
    imagePath: '/authentic-cards/minor-arcana/cups/seven-of-cups.png?v=2025',
    meanings: {
      upright: ['Opportunities', 'Choices', 'Wishful thinking', 'Illusion'],
      reversed: ['Alignment', 'Personal values', 'Overwhelmed by choices']
    },
    description: 'The Seven of Cups represents illusion, choices, and wishful thinking. It suggests many options.',
    element: 'Water'
  },
  {
    id: 'c8',
    name: 'Eight of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 8,
    imagePath: '/authentic-cards/minor-arcana/cups/eight-of-cups.png?v=2025',
    meanings: {
      upright: ['Disappointment', 'Abandonment', 'Withdrawal'],
      reversed: ['Trying one more time', 'Indecision', 'Reevaluating goals']
    },
    description: 'The Eight of Cups represents disappointment, abandonment, and walking away from what no longer serves.',
    element: 'Water'
  },
  {
    id: 'c9',
    name: 'Nine of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 9,
    imagePath: '/authentic-cards/minor-arcana/cups/nine-of-cups.png?v=2025',
    meanings: {
      upright: ['Contentment', 'Satisfaction', 'Gratitude'],
      reversed: ['Inner happiness', 'Materialism', 'Dissatisfaction']
    },
    description: 'The Nine of Cups represents contentment, satisfaction, and emotional fulfillment.',
    element: 'Water'
  },
  {
    id: 'c10',
    name: 'Ten of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 10,
    imagePath: '/authentic-cards/minor-arcana/cups/ten-of-cups.png',
    meanings: {
      upright: ['Divine love', 'Blissful relationships', 'Harmony'],
      reversed: ['Disconnection', 'Misaligned values', 'Struggling relationships']
    },
    description: 'The Ten of Cups represents emotional fulfillment, happiness, and harmonious relationships.',
    element: 'Water'
  },
  {
    id: 'cp',
    name: 'Page of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 11,
    imagePath: '/authentic-cards/minor-arcana/cups/page-of-cups.png',
    meanings: {
      upright: ['Creative opportunities', 'Intuitive messages', 'Curiosity'],
      reversed: ['New ideas', 'Doubting intuition', 'Creative blocks']
    },
    description: 'The Page of Cups represents creative opportunities, intuitive messages, and emotional sensitivity.',
    element: 'Water'
  },
  {
    id: 'cn',
    name: 'Knight of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 12,
    imagePath: '/authentic-cards/minor-arcana/cups/knight-of-cups.png',
    meanings: {
      upright: ['Emotional intelligence', 'Romance', 'Charm', 'Idealism'],
      reversed: ['Moodiness', 'Unrealistic expectations', 'Disappointment']
    },
    description: 'The Knight of Cups represents romance, charm, and imaginative action.',
    element: 'Water'
  },
  {
    id: 'cq',
    name: 'Queen of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 13,
    imagePath: '/authentic-cards/minor-arcana/cups/queen-of-cups.png',
    meanings: {
      upright: ['Compassionate', 'Caring', 'Emotionally stable', 'Intuitive', 'Nurturing'],
      reversed: ['Overly emotional', 'Insecure', 'Dependent', 'Martyr mentality']
    },
    description: 'The Queen of Cups represents emotional nurturing, intuitive wisdom, and the flowing depths of compassion.',
    element: 'Water'
  },
  {
    id: 'ck',
    name: 'King of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 14,
    imagePath: '/authentic-cards/minor-arcana/cups/king-of-cups.png',
    meanings: {
      upright: ['Emotional balance', 'Generosity', 'Control'],
      reversed: ['Moodiness', 'Emotional manipulation', 'Overwhelm']
    },
    description: 'The King of Cups represents emotional balance, generosity, and wise leadership through compassion.',
    element: 'Water'
  },

  // Swords (abbreviated for space)
  {
    id: 's1',
    name: 'Ace of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 1,
    imagePath: '/assets/cards/ace-of-swords.png',
    meanings: {
      upright: ['Clarity', 'Truth', 'Breakthrough'],
      reversed: ['Confusion', 'Brutality', 'Chaos']
    },
    description: 'The Ace of Swords represents mental clarity, truth, and new ideas.',
    element: 'Air'
  },
  // ... (other sword cards follow similar pattern)

  // Oracle Cards
  {
    id: 'oracle_001',
    name: 'Element of Air',
    arcana: 'custom',
    imagePath: '/assets/cards/element-of-air.png',
    meanings: {
      upright: ['Mental clarity', 'Communication', 'Intellect'],
      reversed: ['Confusion', 'Miscommunication', 'Overthinking']
    },
    description: 'Embrace the element of air for mental clarity and enhanced communication.',
    element: 'Air'
  },
  {
    id: 'oracle_002',
    name: 'Element of Earth',
    arcana: 'custom',
    imagePath: '/assets/cards/element-of-earth.png',
    meanings: {
      upright: ['Grounding', 'Stability', 'Material success'],
      reversed: ['Instability', 'Materialism', 'Disconnection']
    },
    description: 'Connect with the earth element for grounding and stability.',
    element: 'Earth'
  },
  {
    id: 'oracle_003',
    name: 'Element of Water',
    arcana: 'custom',
    imagePath: '/assets/cards/element-of-water.png',
    meanings: {
      upright: ['Intuition', 'Emotion', 'Flow'],
      reversed: ['Emotional blocks', 'Stagnation', 'Overwhelm']
    },
    description: 'Embrace the element of water for emotional flow and intuitive wisdom.',
    element: 'Water'
  },
  // ... (remaining oracle cards)
];