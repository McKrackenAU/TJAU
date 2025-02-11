import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'daily' or 'spread'
  cards: text("cards").array().notNull(),
  notes: text("notes").notNull().default(''),
  date: timestamp("date").defaultNow().notNull(),
  spreadType: text("spread_type"), // null for daily draws
});

export const studyProgress = pgTable("study_progress", {
  id: serial("id").primaryKey(),
  cardId: text("card_id").notNull(),
  lastReviewed: timestamp("last_reviewed").defaultNow().notNull(),
  confidenceLevel: integer("confidence_level").notNull().default(0), // 0-5
  nextReviewDue: timestamp("next_review_due").notNull(),
  correctStreak: integer("correct_streak").notNull().default(0),
});

export const insertReadingSchema = createInsertSchema(readings).omit({ 
  id: true,
  date: true 
});

export const insertStudyProgressSchema = createInsertSchema(studyProgress).omit({
  id: true,
  lastReviewed: true,
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;