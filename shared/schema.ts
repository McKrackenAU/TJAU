import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'daily' or 'spread'
  cards: text("cards").array().notNull(),
  notes: text("notes"),
  date: timestamp("date").defaultNow().notNull(),
  spreadType: text("spread_type"), // null for daily draws
});

export const insertReadingSchema = createInsertSchema(readings).omit({ 
  id: true,
  date: true 
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;
