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
  // Add more traditional meanings as needed...
};

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

    // Filter out invalid rows and transform the data with traditional meanings
    const validCards = jsonData.filter(row => row.name && row.description).map(row => {
      const cardName = row.name.split(':')[0].trim();
      const traditionalMeaning = traditionalMeanings[cardName] || {
        upright: ["Wisdom", "Growth", "Understanding", "Inner knowledge"],
        reversed: ["Blockages", "Resistance", "Hidden aspects", "Need for reflection"]
      };

      return {
        name: row.name,
        description: row.description,
        meanings: {
          upright: traditionalMeaning.upright,
          reversed: traditionalMeaning.reversed
        }
      };
    });

    console.log("Valid cards after filtering:", validCards);

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