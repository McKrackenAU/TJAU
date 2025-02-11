import { readings, studyProgress, type Reading, type InsertReading, type StudyProgress, type InsertStudyProgress } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte } from "drizzle-orm";

export interface IStorage {
  createReading(reading: InsertReading): Promise<Reading>;
  getReadings(): Promise<Reading[]>;
  getDailyReadings(): Promise<Reading[]>;
  getSpreadReadings(): Promise<Reading[]>;
  getStudyProgress(cardId: string): Promise<StudyProgress | undefined>;
  updateStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress>;
  getDueCards(): Promise<StudyProgress[]>;
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
}

export const storage = new DatabaseStorage();