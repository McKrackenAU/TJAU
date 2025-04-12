import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, newsletters, insertNewsletterSchema, InsertNewsletter, Newsletter } from '@shared/schema';
import { storage } from '../storage';

// We need to set up environment variables for email credentials
// For development, we'll use a test account
let transporter: nodemailer.Transporter;

// Initialize the email transporter
export async function initializeEmailService() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use provided SMTP credentials
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Email service initialized with provided SMTP credentials');
  } else {
    // For development, use ethereal.email test account
    console.log('No email credentials found, creating test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Email service initialized with test account:', testAccount.user);
  }
}

// Generate a unique unsubscribe token for a user
export async function generateUnsubscribeToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  
  // Update user with the unsubscribe token
  await db.update(users)
    .set({ unsubscribeToken: token })
    .where(eq(users.id, userId));
  
  return token;
}

// Send an email to a single recipient
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Tarot Journey" <tarotjourney@jmvirtualbusinessservices.com.au>',
      to,
      subject,
      html,
    });
    
    console.log('Message sent: %s', info.messageId);
    
    // Preview URL only available when using ethereal.email test accounts
    if (info.messageId.includes('ethereal')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Save a newsletter to the database
export async function saveNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
  const result = await db.insert(newsletters)
    .values(newsletter)
    .returning();
  
  return result[0];
}

// Send a newsletter to all subscribed users
export async function sendNewsletterToSubscribers(newsletter: Newsletter): Promise<number> {
  // Get all users who are subscribed to the newsletter
  const subscribedUsers = await db.select()
    .from(users)
    .where(eq(users.newsletterSubscribed, true));
  
  let successCount = 0;
  
  for (const user of subscribedUsers) {
    // Only send if email available
    if (!user.email) continue;
    
    // Generate unsubscribe token if not already set
    const unsubscribeToken = user.unsubscribeToken || await generateUnsubscribeToken(user.id);
    
    // Create unsubscribe link
    const unsubscribeLink = `${process.env.BASE_URL || 'http://localhost:3000'}/unsubscribe?token=${unsubscribeToken}`;
    
    // Add unsubscribe footer to the newsletter content
    const fullContent = `
      ${newsletter.content}
      <hr style="margin-top: 30px; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        You're receiving this email because you subscribed to our weekly astrology newsletter.
        <br>
        <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">Unsubscribe</a> from these emails.
        <br>
        Contact us: <a href="mailto:tarotjourney@jmvirtualbusinessservices.com.au" style="color: #666; text-decoration: underline;">tarotjourney@jmvirtualbusinessservices.com.au</a>
      </p>
    `;
    
    // Send the newsletter
    const success = await sendEmail(
      user.email,
      newsletter.title,
      fullContent
    );
    
    if (success) {
      successCount++;
    }
  }
  
  // Update the newsletter with the count of recipients
  await db.update(newsletters)
    .set({ recipientCount: successCount })
    .where(eq(newsletters.id, newsletter.id));
  
  return successCount;
}

// Get all past newsletters
export async function getAllNewsletters(): Promise<Newsletter[]> {
  return db.select().from(newsletters).orderBy(newsletters.sentAt);
}

// Unsubscribe a user from the newsletter using their token
export async function unsubscribeUserByToken(token: string): Promise<boolean> {
  if (!token) return false;
  
  const result = await db.update(users)
    .set({ newsletterSubscribed: false })
    .where(eq(users.unsubscribeToken, token))
    .returning();
  
  return result.length > 0;
}

// Subscribe or unsubscribe a user
export async function updateUserNewsletterPreference(userId: number, subscribed: boolean): Promise<boolean> {
  try {
    const result = await db.update(users)
      .set({ newsletterSubscribed: subscribed })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error('Error updating user newsletter preference:', error);
    return false;
  }
}