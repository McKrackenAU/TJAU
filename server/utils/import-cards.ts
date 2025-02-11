import { read, utils } from 'xlsx';

interface ImportedCard {
  name: string;
  description: string;
}

export async function importCardsFromExcel(fileBuffer: Buffer): Promise<ImportedCard[]> {
  try {
    // Read the Excel file
    const workbook = read(fileBuffer);
    
    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert to JSON
    const jsonData = utils.sheet_to_json<ImportedCard>(worksheet, {
      header: ['name', 'description'],
      range: 1  // Skip header row
    });

    return jsonData.filter(card => card.name && card.description);
  } catch (error) {
    console.error('Error importing cards:', error);
    throw new Error('Failed to import cards from Excel file');
  }
}
