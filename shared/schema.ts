import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
  type: text("type").notNull(), // 'daily' or 'spread'
  cards: text("cards").array().notNull(),
  notes: text("notes").notNull().default(''),
  date: timestamp("date").defaultNow().notNull(),
  spreadType: text("spread_type"), // null for daily draws
});

export const studyProgress = pgTable("study_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
  cardId: text("card_id").notNull(),
  lastReviewed: timestamp("last_reviewed").defaultNow().notNull(),
  confidenceLevel: integer("confidence_level").notNull().default(0), // 0-5
  nextReviewDue: timestamp("next_review_due").notNull(),
  correctStreak: integer("correct_streak").notNull().default(0),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
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

export const learningTracks = pgTable("learning_tracks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  tags: text("tags").array().default([]).notNull(),
  requiredCards: text("required_cards").array().notNull(),
  achievements: text("achievements").array().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
  trackId: integer("track_id").notNull(),
  completedLessons: text("completed_lessons").array().default([]).notNull(),
  achievements: text("achievements").array().default([]).notNull(),
  currentLesson: integer("current_lesson").default(1).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
  trackId: integer("track_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  difficulty: text("difficulty").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  cards: text("cards").array().notNull(),
  incorrectAnswers: jsonb("incorrect_answers").notNull(),
});

export const insertLearningTrackSchema = createInsertSchema(learningTracks).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startDate: true,
  lastActive: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  date: true,
});

export const importedCards = pgTable("imported_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Associate with user
  name: text("name").notNull(),
  description: text("description").notNull(),
  meanings: jsonb("meanings").notNull(),
  dateImported: timestamp("date_imported").defaultNow().notNull(),
  imageUrl: text("image_url"), // New column for card front images
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  weekStartDate: date("week_start_date").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  recipientCount: integer("recipient_count").default(0).notNull(),
});

export const angelNumbers = pgTable("angel_numbers", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  name: text("name").notNull(),
  meaning: text("meaning").notNull(),
  spiritualMeaning: text("spiritual_meaning").notNull(),
  practicalGuidance: text("practical_guidance").notNull(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

export const voices = pgTable("voices", {
  id: serial("id").primaryKey(),
  voiceId: text("voice_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("cloned"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type LearningTrack = typeof learningTracks.$inferSelect;
export type InsertLearningTrack = z.infer<typeof insertLearningTrackSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isSubscribed: boolean("is_subscribed").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id").default(''),
  stripeSubscriptionId: text("stripe_subscription_id").default(''),
  newsletterSubscribed: boolean("newsletter_subscribed").default(true).notNull(),
  unsubscribeToken: text("unsubscribe_token"),
  hasUsedFreeTrial: boolean("has_used_free_trial").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
}).extend({
  isAdmin: z.boolean().optional().default(false),
  isSubscribed: z.boolean().optional().default(false),
  hasUsedFreeTrial: z.boolean().optional().default(false)
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  sentAt: true,
  recipientCount: true,
});

export const insertAngelNumberSchema = createInsertSchema(angelNumbers).omit({
  id: true,
  dateAdded: true,
});

export type ImportedCard = typeof importedCards.$inferSelect;
export type InsertImportedCard = typeof importedCards.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type AngelNumber = typeof angelNumbers.$inferSelect;
export type InsertAngelNumber = z.infer<typeof insertAngelNumberSchema>;