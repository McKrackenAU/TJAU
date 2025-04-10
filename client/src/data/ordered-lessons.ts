// Temporary file to map out the correct order of lessons

// The correct card order should be:
// Cups: Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King
// Wands: Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King
// Pentacles: Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King
// Swords: Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King

// Cups lessons - cardIds c1 through c10, cp, cn, ck, cq
const cupsLessons = [
  "c1", // Ace of Cups - intuitive-1
  "c2", // Two of Cups - intuitive-2
  "c3", // Three of Cups - intuitive-3
  "c4", // Four of Cups - intuitive-4
  "c5", // Five of Cups - intuitive-5
  "c6", // Six of Cups - intuitive-6
  "c7", // Seven of Cups - intuitive-7
  "c8", // Eight of Cups - intuitive-8
  "c9", // Nine of Cups - intuitive-9
  "c10", // Ten of Cups - intuitive-10
  "cp", // Page of Cups - intuitive-11
  "cn", // Knight of Cups - intuitive-12
  "cq", // Queen of Cups - intuitive-13
  "ck", // King of Cups - intuitive-14
];

// Wands lessons - cardIds w1 through w10, wp, wn, wk, wq
const wandsLessons = [
  "w1", // Ace of Wands - intuitive-15
  "w2", // Two of Wands - intuitive-16
  "w3", // Three of Wands - intuitive-17
  "w4", // Four of Wands - intuitive-18
  "w5", // Five of Wands - intuitive-19
  "w6", // Six of Wands - intuitive-20
  "w7", // Seven of Wands - intuitive-21
  "w8", // Eight of Wands - intuitive-22
  "w9", // Nine of Wands - intuitive-23
  "w10", // Ten of Wands - intuitive-24
  "wp", // Page of Wands - intuitive-25
  "wn", // Knight of Wands - intuitive-26
  "wq", // Queen of Wands - intuitive-27
  "wk", // King of Wands - intuitive-28
];

// Pentacles lessons - cardIds p1 through p10, pp, pn, pk, pq
const pentaclesLessons = [
  "p1", // Ace of Pentacles - intuitive-29
  "p2", // Two of Pentacles - intuitive-30
  "p3", // Three of Pentacles - intuitive-31
  "p4", // Four of Pentacles - intuitive-32
  "p5", // Five of Pentacles - intuitive-33
  "p6", // Six of Pentacles - intuitive-34
  "p7", // Seven of Pentacles - intuitive-35
  "p8", // Eight of Pentacles - intuitive-36
  "p9", // Nine of Pentacles - intuitive-37
  "p10", // Ten of Pentacles - intuitive-38
  "pp", // Page of Pentacles - intuitive-39
  "pn", // Knight of Pentacles - intuitive-40
  "pq", // Queen of Pentacles - intuitive-41
  "pk", // King of Pentacles - intuitive-42
];

// Swords lessons - cardIds s1 through s10, sp, sn, sk, sq (not fully implemented in this version)
const swordsLessons = [
  "s1", // Ace of Swords - intuitive-43 (not implemented)
  "s2", // Two of Swords - intuitive-44 (not implemented)
  "s3", // Three of Swords - intuitive-45 (not implemented)
  "s4", // Four of Swords - intuitive-46 (not implemented)
  "s5", // Five of Swords - intuitive-47 (not implemented)
  "s6", // Six of Swords - intuitive-48 (not implemented)
  "s7", // Seven of Swords - intuitive-49 (not implemented)
  "s8", // Eight of Swords - intuitive-50 (not implemented)
  "s9", // Nine of Swords - intuitive-51 (not implemented)
  "s10", // Ten of Swords - intuitive-52 (not implemented)
  "sp", // Page of Swords - intuitive-53 (not implemented)
  "sn", // Knight of Swords - intuitive-54
  "sq", // Queen of Swords - intuitive-55 (not implemented)
  "sk", // King of Swords - intuitive-56 (not implemented)
];

// Complete ordered card list
export const orderedCards = [
  ...cupsLessons,
  ...wandsLessons,
  ...pentaclesLessons,
  ...swordsLessons
];

// ID mapping function - converts cardId to lessonId
export function getOrderedLessonId(cardId: string): string | undefined {
  const index = orderedCards.indexOf(cardId);
  if (index >= 0) {
    return `intuitive-${index + 1}`;
  }
  return undefined;
}