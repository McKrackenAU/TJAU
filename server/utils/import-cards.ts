import { read, utils } from 'xlsx';
import { db } from "../db";
import { importedCards } from "@shared/schema";
import type { InsertImportedCard } from "@shared/schema";

interface ImportedCardRow {
  name: string;
  description: string;
  upright: string;
  reversed: string;
}

// Traditional tarot meanings map with proper array format
const traditionalMeanings: Record<string, { upright: string[], reversed: string[] }> = {
  "The Fool": {
    upright: ["New beginnings", "Innocence", "Spontaneity", "Free spirit", "Adventure"],
    reversed: ["Recklessness", "Risk-taking", "Foolishness", "Naivety", "Inconsideration"]
  },
  "The Magician": {
    upright: ["Manifestation", "Power", "Action", "Resourcefulness", "Inspired action"],
    reversed: ["Manipulation", "Poor planning", "Untapped talents", "Wasted energy"]
  },
  "The High Priestess": {
    upright: ["Intuition", "Mystery", "Inner knowledge", "Divine feminine", "Subconscious mind"],
    reversed: ["Secrets", "Disconnection", "Withdrawal", "Repressed intuition"]
  },
  // Add meanings for all cards including Minor Arcana
  "Ace of Pentacles": {
    upright: ["New opportunities", "Prosperity", "Abundance", "Material gain", "Financial security"],
    reversed: ["Missed opportunities", "Financial loss", "Scarcity mindset", "Poor planning"]
  },
  "Two of Pentacles": {
    upright: ["Balance", "Adaptability", "Time management", "Prioritization", "Flexibility"],
    reversed: ["Imbalance", "Disorganization", "Overwhelm", "Poor priorities"]
  },
  "Three of Pentacles": {
    upright: ["Teamwork", "Collaboration", "Learning", "Mastery", "Excellence"],
    reversed: ["Lack of teamwork", "Disharmony", "Competition", "Mediocrity"]
  },
  "Four of Pentacles": {
    upright: ["Security", "Stability", "Conservation", "Frugality", "Protection"],
    reversed: ["Greed", "Materialism", "Possession", "Insecurity", "Hoarding"]
  }
};

// Default meanings for cards not in the traditional map
const defaultMeanings = {
  upright: ["Wisdom", "Growth", "Understanding", "Potential", "Harmony"],
  reversed: ["Challenge", "Resistance", "Imbalance", "Blocked energy", "Need for reflection"]
};

function getMeaningsForCard(cardName: string): { upright: string[], reversed: string[] } {
  // Remove any text after the colon and trim whitespace
  const baseCardName = cardName.split(':')[0].trim();

  // Try to find traditional meanings
  const meanings = traditionalMeanings[baseCardName];

  // If not found, use default meanings
  if (!meanings) {
    console.log(`No traditional meanings found for ${baseCardName}, using defaults`);
    return defaultMeanings;
  }

  console.log(`Found traditional meanings for ${baseCardName}:`, meanings);
  return meanings;
}

export async function importCardsFromExcel(fileBuffer: Buffer): Promise<ImportedCardRow[]> {
  try {
    console.log("Starting Excel import process...");

    const workbook = read(fileBuffer);
    console.log("Excel file read successfully, sheets:", workbook.SheetNames);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json<ImportedCardRow>(worksheet, {
      header: ['name', 'description', 'upright', 'reversed'],
      range: 1
    });

    console.log("Parsed JSON data:", jsonData);

    // Transform data and explicitly type it as InsertImportedCard[]
    const validCards: InsertImportedCard[] = jsonData
      .filter(row => row.name && row.description)
      .map(row => {
        const cardMeanings = getMeaningsForCard(row.name);

        console.log(`Processing card: ${row.name}`);
        console.log('Assigned meanings:', cardMeanings);

        const card: InsertImportedCard = {
          name: row.name,
          description: row.description,
          meanings: {
            upright: cardMeanings.upright,
            reversed: cardMeanings.reversed
          }
        };

        return card;
      });

    console.log("Prepared cards for insertion:", validCards);

    // Use a transaction to ensure atomic operation
    await db.transaction(async (tx) => {
      // Clear existing imported cards
      await tx.delete(importedCards);

      // Insert new cards with proper JSONB structure
      const insertedCards = await tx.insert(importedCards)
        .values(validCards)
        .returning();

      console.log("Successfully inserted cards:", insertedCards);
    });

    return validCards;
  } catch (error) {
    console.error("Import error:", error);
    throw error;
  }
}