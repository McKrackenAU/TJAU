import { readings, studyProgress, journalEntries, type Reading, type InsertReading, type StudyProgress, type InsertStudyProgress, type JournalEntry, type InsertJournalEntry } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, sql } from "drizzle-orm";

export interface IStorage {
  createReading(reading: InsertReading): Promise<Reading>;
  getReadings(): Promise<Reading[]>;
  getDailyReadings(): Promise<Reading[]>;
  getSpreadReadings(): Promise<Reading[]>;
  getStudyProgress(cardId: string): Promise<StudyProgress | undefined>;
  updateStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress>;
  getDueCards(): Promise<StudyProgress[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  getJournalEntriesByCard(cardId: string): Promise<JournalEntry[]>;
  getJournalEntriesByTag(tag: string): Promise<JournalEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async createReading(insertReading: InsertReading): Promise<Reading> {
    const [reading] = await db
      .insert(readings)
      .values(insertReading)
      .returning();
    return reading;
  }

  async getReadings(): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .orderBy(desc(readings.date));
  }

  async getDailyReadings(): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .where(eq(readings.type, 'daily'))
      .orderBy(desc(readings.date));
  }

  async getSpreadReadings(): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .where(eq(readings.type, 'spread'))
      .orderBy(desc(readings.date));
  }

  async getStudyProgress(cardId: string): Promise<StudyProgress | undefined> {
    const [progress] = await db
      .select()
      .from(studyProgress)
      .where(eq(studyProgress.cardId, cardId));
    return progress;
  }

  async updateStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress> {
    const [updated] = await db
      .insert(studyProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [studyProgress.cardId],
        set: progress,
      })
      .returning();
    return updated;
  }

  async getDueCards(): Promise<StudyProgress[]> {
    return db
      .select()
      .from(studyProgress)
      .where(lte(studyProgress.nextReviewDue, new Date()))
      .orderBy(studyProgress.nextReviewDue);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [result] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return result;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.date));
  }

  async getJournalEntry(id: number): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id));
    return entry;
  }

  async getJournalEntriesByCard(cardId: string): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(sql`${cardId} = ANY(${journalEntries.cards})`)
      .orderBy(desc(journalEntries.date));
  }

  async getJournalEntriesByTag(tag: string): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(sql`${tag} = ANY(${journalEntries.tags})`)
      .orderBy(desc(journalEntries.date));
  }
}

export const storage = new DatabaseStorage();