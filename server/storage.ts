import { readings, studyProgress, journalEntries, learningTracks, userProgress, quizResults, type Reading, type InsertReading, type StudyProgress, type InsertStudyProgress, type JournalEntry, type InsertJournalEntry, type LearningTrack, type InsertLearningTrack, type UserProgress, type InsertUserProgress, type QuizResult, type InsertQuizResult, type ImportedCard, type InsertImportedCard, importedCards } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Existing methods
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

  // New methods for imported cards
  createImportedCard(card: InsertImportedCard): Promise<ImportedCard>;
  getImportedCards(): Promise<ImportedCard[]>;
  // New methods for learning paths
  createLearningTrack(track: InsertLearningTrack): Promise<LearningTrack>;
  getLearningTracks(): Promise<LearningTrack[]>;
  getLearningTrack(id: number): Promise<LearningTrack | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  getUserProgress(trackId: number): Promise<UserProgress | undefined>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResults(trackId: number): Promise<QuizResult[]>;
  getRecentQuizResults(limit?: number): Promise<QuizResult[]>;
}

export class DatabaseStorage implements IStorage {
  // Existing methods remain unchanged
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

  // New methods for imported cards
  async createImportedCard(card: InsertImportedCard): Promise<ImportedCard> {
    const [created] = await db
      .insert(importedCards)
      .values(card)
      .returning();
    return created;
  }

  async getImportedCards(): Promise<ImportedCard[]> {
    return db
      .select()
      .from(importedCards)
      .orderBy(desc(importedCards.dateImported));
  }
  // New methods for learning paths
  async createLearningTrack(track: InsertLearningTrack): Promise<LearningTrack> {
    const [result] = await db
      .insert(learningTracks)
      .values(track)
      .returning();
    return result;
  }

  async getLearningTracks(): Promise<LearningTrack[]> {
    return db
      .select()
      .from(learningTracks);
  }

  async getLearningTrack(id: number): Promise<LearningTrack | undefined> {
    const [track] = await db
      .select()
      .from(learningTracks)
      .where(eq(learningTracks.id, id));
    return track;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [result] = await db
      .insert(userProgress)
      .values(progress)
      .returning();
    return result;
  }

  async updateUserProgress(id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [updated] = await db
      .update(userProgress)
      .set({
        ...progress,
        lastActive: new Date()
      })
      .where(eq(userProgress.id, id))
      .returning();
    return updated;
  }

  async getUserProgress(trackId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.trackId, trackId));
    return progress;
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [created] = await db
      .insert(quizResults)
      .values(result)
      .returning();
    return created;
  }

  async getQuizResults(trackId: number): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.trackId, trackId))
      .orderBy(desc(quizResults.date));
  }

  async getRecentQuizResults(limit: number = 10): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .orderBy(desc(quizResults.date))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();