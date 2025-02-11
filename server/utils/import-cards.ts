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

// Traditional tarot meanings map
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
  "The Empress": {
    upright: ["Abundance", "Nurturing", "Fertility", "Growth", "Creativity"],
    reversed: ["Dependence", "Smothering", "Creative block", "Neglect"]
  },
  "The Emperor": {
    upright: ["Authority", "Structure", "Leadership", "Stability", "Protection"],
    reversed: ["Control", "Rigidity", "Domination", "Inflexibility"]
  },
  "The Hierophant": {
    upright: ["Tradition", "Spirituality", "Education", "Beliefs", "Conformity"],
    reversed: ["Rebellion", "Subversiveness", "Unconventionality", "New methods"]
  },
  "The Lovers": {
    upright: ["Love", "Harmony", "Choices", "Union", "Relationships"],
    reversed: ["Disharmony", "Imbalance", "Misalignment", "Poor choices"]
  },
  // Minor Arcana - Wands
  "Ace of Wands": {
    upright: ["Creation", "Inspiration", "New opportunities", "Growth", "Potential"],
    reversed: ["Delays", "Blocks", "Lack of motivation", "False starts"]
  },
  "Two of Wands": {
    upright: ["Planning", "Discovery", "Future vision", "Progress", "Decisions"],
    reversed: ["Fear of change", "Playing it safe", "Bad planning", "Lack of direction"]
  },
  // Continue for each card...
};

export async function importCardsFromExcel(fileBuffer: Buffer): Promise<ImportedCardRow[]> {
  try {
    console.log("Starting Excel import process...");

    // Read the Excel file
    const workbook = read(fileBuffer);
    console.log("Excel file read successfully, sheets:", workbook.SheetNames);

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const jsonData = utils.sheet_to_json<ImportedCardRow>(worksheet, {
      header: ['name', 'description', 'upright', 'reversed'],
      range: 1  // Skip header row
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
        ...row,
        upright: traditionalMeaning.upright.join(', '),
        reversed: traditionalMeaning.reversed.join(', ')
      };
    });

    console.log("Valid cards after filtering:", validCards);

    // Insert cards into the database
    const cardsToInsert: InsertImportedCard[] = validCards.map(card => ({
      name: card.name,
      description: card.description,
      meanings: {
        upright: card.upright.split(',').map(m => m.trim()).filter(Boolean),
        reversed: card.reversed.split(',').map(m => m.trim()).filter(Boolean)
      }
    }));

    console.log("Attempting to insert cards:", cardsToInsert);

    // Use a transaction to ensure atomic operation
    await db.transaction(async (tx) => {
      // Clear existing imported cards to avoid duplicates
      await tx.delete(importedCards);

      // Insert new cards
      const insertedCards = await tx.insert(importedCards)
        .values(cardsToInsert)
        .returning();

      console.log("Successfully inserted cards:", insertedCards);
    });

    return validCards;
  } catch (error) {
    console.error("Detailed import error:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    throw new Error('Failed to import cards from Excel file: ' + (error instanceof Error ? error.message : String(error)));
  }
}