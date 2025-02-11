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
    // Read the Excel file
    const workbook = read(fileBuffer);

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const jsonData = utils.sheet_to_json<ImportedCardRow>(worksheet, {
      header: ['name', 'description', 'upright', 'reversed'],
      range: 1  // Skip header row
    });

    // Filter out invalid rows and transform the data
    const validCards = jsonData.filter(row => row.name && row.description).map(row => ({
      ...row,
      upright: row.upright || '',
      reversed: row.reversed || ''
    }));

    // Insert cards into the database
    const cardsToInsert = validCards.map(card => ({
      name: card.name,
      description: card.description,
      meanings: {
        upright: card.upright.split(',').map(m => m.trim()).filter(Boolean),
        reversed: card.reversed.split(',').map(m => m.trim()).filter(Boolean)
      }
    }));

    await db.insert(importedCards).values(cardsToInsert);

    return validCards;
  } catch (error) {
    console.error('Error importing cards:', error);
    throw new Error('Failed to import cards from Excel file');
  }
}