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

    // Filter out invalid rows and transform the data
    const validCards = jsonData.filter(row => row.name && row.description).map(row => ({
      ...row,
      upright: row.upright || '',
      reversed: row.reversed || ''
    }));

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