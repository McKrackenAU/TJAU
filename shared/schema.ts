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

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  cards: text("cards").array(), // Optional linked cards
  tags: text("tags").array().default([]).notNull(),
  mood: text("mood"), // Optional mood tracking
});

export const insertReadingSchema = createInsertSchema(readings).omit({ 
  id: true,
  date: true 
});

export const insertStudyProgressSchema = createInsertSchema(studyProgress).omit({
  id: true,
  lastReviewed: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  date: true
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;