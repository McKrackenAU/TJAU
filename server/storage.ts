import { readings, studyProgress, journalEntries, learningTracks, userProgress, quizResults, users, newsletters, angelNumbers, type Reading, type InsertReading, type StudyProgress, type InsertStudyProgress, type JournalEntry, type InsertJournalEntry, type LearningTrack, type InsertLearningTrack, type UserProgress, type InsertUserProgress, type QuizResult, type InsertQuizResult, type ImportedCard, type InsertImportedCard, type User, type InsertUser, type Newsletter, type InsertNewsletter, type AngelNumber, type InsertAngelNumber, importedCards } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, sql } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";

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
  createImportedCard(card: InsertImportedCard): Promise<ImportedCard>;
  getImportedCards(): Promise<ImportedCard[]>;
  getImportedCard(cardId: number): Promise<ImportedCard | undefined>;
  updateCardImage(cardId: number, imageUrl: string): Promise<ImportedCard>;
  createLearningTrack(track: InsertLearningTrack): Promise<LearningTrack>;
  getLearningTracks(): Promise<LearningTrack[]>;
  getLearningTrack(id: number): Promise<LearningTrack | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  getUserProgress(trackId: number): Promise<UserProgress | undefined>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResults(trackId: number): Promise<QuizResult[]>;
  getRecentQuizResults(limit?: number): Promise<QuizResult[]>;
  // User authentication
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  // Stripe integration
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<User>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  updateUserSubscription(userId: number, subscription: { isSubscribed: boolean, stripeSubscriptionId: string }): Promise<User>;
  // Admin functionality
  setUserAsAdmin(userId: number): Promise<User>;
  // Newsletter functionality
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletters(): Promise<Newsletter[]>;
  getNewsletter(id: number): Promise<Newsletter | undefined>;
  getSubscribedUsers(): Promise<User[]>;
  updateUserNewsletterPreference(userId: number, subscribed: boolean): Promise<User>;
  getUserByUnsubscribeToken(token: string): Promise<User | undefined>;
  // Angel Numbers functionality
  createAngelNumber(angelNumber: InsertAngelNumber): Promise<AngelNumber>;
  getAngelNumbers(): Promise<AngelNumber[]>;
  getAngelNumberByNumber(number: string): Promise<AngelNumber | undefined>;
  getAngelNumberById(id: number): Promise<AngelNumber | undefined>;
  // Session store
  sessionStore: session.Store;
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

  async getImportedCard(cardId: number): Promise<ImportedCard | undefined> {
    const [card] = await db
      .select()
      .from(importedCards)
      .where(eq(importedCards.id, cardId));
    return card;
  }
  
  async updateCardImage(cardId: number, imageUrl: string): Promise<ImportedCard> {
    const [updated] = await db
      .update(importedCards)
      .set({ imageUrl })
      .where(eq(importedCards.id, cardId))
      .returning();
    return updated;
  }
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
      .from(learningTracks)
      .orderBy(learningTracks.id);
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
  
  // User authentication methods
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db
      .insert(users)
      .values(user)
      .returning();
    return created;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  // Stripe integration methods
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
        isSubscribed: true
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId));
    return user;
  }

  async updateUserSubscription(userId: number, subscription: { isSubscribed: boolean, stripeSubscriptionId: string }): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        isSubscribed: subscription.isSubscribed,
        stripeSubscriptionId: subscription.stripeSubscriptionId
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }
  
  async setUserAsAdmin(userId: number): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        isAdmin: true,
        isSubscribed: true // Admin users are automatically subscribed
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // Newsletter functionality
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const [created] = await db
      .insert(newsletters)
      .values(newsletter)
      .returning();
    return created;
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return db
      .select()
      .from(newsletters)
      .orderBy(desc(newsletters.sentAt));
  }

  async getNewsletter(id: number): Promise<Newsletter | undefined> {
    const [newsletter] = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.id, id));
    return newsletter;
  }

  async getSubscribedUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.newsletterSubscribed, true));
  }

  async updateUserNewsletterPreference(userId: number, subscribed: boolean): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ newsletterSubscribed: subscribed })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getUserByUnsubscribeToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.unsubscribeToken, token));
    return user;
  }

  // Angel Numbers functionality
  async createAngelNumber(angelNumber: InsertAngelNumber): Promise<AngelNumber> {
    const [created] = await db
      .insert(angelNumbers)
      .values(angelNumber)
      .returning();
    return created;
  }

  async getAngelNumbers(): Promise<AngelNumber[]> {
    return db
      .select()
      .from(angelNumbers)
      .orderBy(angelNumbers.number);
  }

  async getAngelNumberByNumber(number: string): Promise<AngelNumber | undefined> {
    const [angelNumber] = await db
      .select()
      .from(angelNumbers)
      .where(eq(angelNumbers.number, number));
    return angelNumber;
  }

  async getAngelNumberById(id: number): Promise<AngelNumber | undefined> {
    const [angelNumber] = await db
      .select()
      .from(angelNumbers)
      .where(eq(angelNumbers.id, id));
    return angelNumber;
  }

  // Session store setup
  sessionStore = new (connectPg(session))({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true
  });
}

export const storage = new DatabaseStorage();