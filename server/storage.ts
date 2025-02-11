import { readings, type Reading, type InsertReading } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createReading(reading: InsertReading): Promise<Reading>;
  getReadings(): Promise<Reading[]>;
  getDailyReadings(): Promise<Reading[]>;
  getSpreadReadings(): Promise<Reading[]>;
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
}

export const storage = new DatabaseStorage();