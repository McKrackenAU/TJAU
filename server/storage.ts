import { readings, type Reading, type InsertReading } from "@shared/schema";

export interface IStorage {
  createReading(reading: InsertReading): Promise<Reading>;
  getReadings(): Promise<Reading[]>;
  getDailyReadings(): Promise<Reading[]>;
  getSpreadReadings(): Promise<Reading[]>;
}

export class MemStorage implements IStorage {
  private readings: Map<number, Reading>;
  private currentId: number;

  constructor() {
    this.readings = new Map();
    this.currentId = 1;
  }

  async createReading(insertReading: InsertReading): Promise<Reading> {
    const id = this.currentId++;
    const reading: Reading = {
      ...insertReading,
      id,
      date: new Date()
    };
    this.readings.set(id, reading);
    return reading;
  }

  async getReadings(): Promise<Reading[]> {
    return Array.from(this.readings.values());
  }

  async getDailyReadings(): Promise<Reading[]> {
    return Array.from(this.readings.values())
      .filter(reading => reading.type === 'daily')
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getSpreadReadings(): Promise<Reading[]> {
    return Array.from(this.readings.values())
      .filter(reading => reading.type === 'spread')
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const storage = new MemStorage();
