import { readings, studyProgress, journalEntries, learningTracks, userProgress, quizResults, users, newsletters, angelNumbers, type Reading, type InsertReading, type StudyProgress, type InsertStudyProgress, type JournalEntry, type InsertJournalEntry, type LearningTrack, type InsertLearningTrack, type UserProgress, type InsertUserProgress, type QuizResult, type InsertQuizResult, type ImportedCard, type InsertImportedCard, type User, type InsertUser, type Newsletter, type InsertNewsletter, type AngelNumber, type InsertAngelNumber, importedCards } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, sql } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  createReading(userId: number, reading: InsertReading): Promise<Reading>;
  getReadings(userId: number): Promise<Reading[]>;
  getDailyReadings(userId: number): Promise<Reading[]>;
  getSpreadReadings(userId: number): Promise<Reading[]>;
  getStudyProgress(userId: number, cardId: string): Promise<StudyProgress | undefined>;
  updateStudyProgress(userId: number, progress: InsertStudyProgress): Promise<StudyProgress>;
  getDueCards(userId: number): Promise<StudyProgress[]>;
  createJournalEntry(userId: number, entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  getJournalEntry(userId: number, id: number): Promise<JournalEntry | undefined>;
  getJournalEntriesByCard(userId: number, cardId: string): Promise<JournalEntry[]>;
  getJournalEntriesByTag(userId: number, tag: string): Promise<JournalEntry[]>;
  createImportedCard(userId: number, card: InsertImportedCard): Promise<ImportedCard>;
  getImportedCards(userId: number): Promise<ImportedCard[]>;
  getImportedCard(userId: number, cardId: number): Promise<ImportedCard | undefined>;
  updateCardImage(userId: number, cardId: number, imageUrl: string): Promise<ImportedCard>;
  createLearningTrack(track: InsertLearningTrack): Promise<LearningTrack>;
  getLearningTracks(): Promise<LearningTrack[]>;
  getLearningTrack(id: number): Promise<LearningTrack | undefined>;
  createUserProgress(userId: number, progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  getUserProgress(userId: number, trackId: number): Promise<UserProgress | undefined>;
  createQuizResult(userId: number, result: InsertQuizResult): Promise<QuizResult>;
  getQuizResults(userId: number, trackId: number): Promise<QuizResult[]>;
  getRecentQuizResults(userId: number, limit?: number): Promise<QuizResult[]>;
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
  updateUserTrialStatus(userId: number, hasUsedTrial: boolean): Promise<User>;
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
  async createReading(userId: number, insertReading: InsertReading): Promise<Reading> {
    const [reading] = await db
      .insert(readings)
      .values({
        ...insertReading,
        userId
      })
      .returning();
    return reading;
  }

  async getReadings(userId: number): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .where(eq(readings.userId, userId))
      .orderBy(desc(readings.date));
  }

  async getDailyReadings(userId: number): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .where(and(
        eq(readings.type, 'daily'), 
        eq(readings.userId, userId)
      ))
      .orderBy(desc(readings.date));
  }

  async getSpreadReadings(userId: number): Promise<Reading[]> {
    return db
      .select()
      .from(readings)
      .where(and(
        eq(readings.type, 'spread'),
        eq(readings.userId, userId)
      ))
      .orderBy(desc(readings.date));
  }

  async getStudyProgress(userId: number, cardId: string): Promise<StudyProgress | undefined> {
    const [progress] = await db
      .select()
      .from(studyProgress)
      .where(and(
        eq(studyProgress.cardId, cardId),
        eq(studyProgress.userId, userId)
      ));
    return progress;
  }

  async updateStudyProgress(userId: number, progress: InsertStudyProgress): Promise<StudyProgress> {
    const [updated] = await db
      .insert(studyProgress)
      .values({
        ...progress,
        userId
      })
      .onConflictDoUpdate({
        target: [studyProgress.cardId, studyProgress.userId],
        set: progress,
      })
      .returning();
    return updated;
  }

  async getDueCards(userId: number): Promise<StudyProgress[]> {
    return db
      .select()
      .from(studyProgress)
      .where(and(
        lte(studyProgress.nextReviewDue, new Date()),
        eq(studyProgress.userId, userId)
      ))
      .orderBy(studyProgress.nextReviewDue);
  }

  async createJournalEntry(userId: number, entry: InsertJournalEntry): Promise<JournalEntry> {
    const [result] = await db
      .insert(journalEntries)
      .values({
        ...entry,
        userId
      })
      .returning();
    return result;
  }

  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.date));
  }

  async getJournalEntry(userId: number, id: number): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.id, id),
        eq(journalEntries.userId, userId)
      ));
    return entry;
  }

  async getJournalEntriesByCard(userId: number, cardId: string): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(and(
        sql`${cardId} = ANY(${journalEntries.cards})`,
        eq(journalEntries.userId, userId)
      ))
      .orderBy(desc(journalEntries.date));
  }

  async getJournalEntriesByTag(userId: number, tag: string): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(and(
        sql`${tag} = ANY(${journalEntries.tags})`,
        eq(journalEntries.userId, userId)
      ))
      .orderBy(desc(journalEntries.date));
  }

  async createImportedCard(userId: number, card: InsertImportedCard): Promise<ImportedCard> {
    const [created] = await db
      .insert(importedCards)
      .values({
        ...card,
        userId
      })
      .returning();
    return created;
  }

  async getImportedCards(userId: number): Promise<ImportedCard[]> {
    return db
      .select()
      .from(importedCards)
      .where(eq(importedCards.userId, userId))
      .orderBy(desc(importedCards.dateImported));
  }

  async getImportedCard(userId: number, cardId: number): Promise<ImportedCard | undefined> {
    const [card] = await db
      .select()
      .from(importedCards)
      .where(and(
        eq(importedCards.id, cardId),
        eq(importedCards.userId, userId)
      ));
    return card;
  }
  
  async updateCardImage(userId: number, cardId: number, imageUrl: string): Promise<ImportedCard> {
    const [updated] = await db
      .update(importedCards)
      .set({ imageUrl })
      .where(and(
        eq(importedCards.id, cardId),
        eq(importedCards.userId, userId)
      ))
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

  async createUserProgress(userId: number, progress: InsertUserProgress): Promise<UserProgress> {
    const [result] = await db
      .insert(userProgress)
      .values({
        ...progress,
        userId
      })
      .returning();
    return result;
  }

  async updateUserProgress(userId: number, id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [updated] = await db
      .update(userProgress)
      .set({
        ...progress,
        lastActive: new Date()
      })
      .where(and(
        eq(userProgress.id, id),
        eq(userProgress.userId, userId)
      ))
      .returning();
    return updated;
  }

  async getUserProgress(userId: number, trackId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(
        eq(userProgress.trackId, trackId),
        eq(userProgress.userId, userId)
      ));
    return progress;
  }

  async createQuizResult(userId: number, result: InsertQuizResult): Promise<QuizResult> {
    const [created] = await db
      .insert(quizResults)
      .values({
        ...result,
        userId
      })
      .returning();
    return created;
  }

  async getQuizResults(userId: number, trackId: number): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .where(and(
        eq(quizResults.trackId, trackId),
        eq(quizResults.userId, userId)
      ))
      .orderBy(desc(quizResults.date));
  }

  async getRecentQuizResults(userId: number, limit: number = 10): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
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
  
  async updateUserTrialStatus(userId: number, hasUsedTrial: boolean): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ hasUsedFreeTrial: hasUsedTrial })
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