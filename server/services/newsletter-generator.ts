import { format, addDays, startOfWeek } from 'date-fns';
import { OpenAI } from 'openai';
import { InsertNewsletter } from '@shared/schema';
import { storage } from '../storage';
import { initializeEmailService, sendNewsletterToSubscribers } from './email-service';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Array of all zodiac signs
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Generate horoscopes for all zodiac signs
 */
async function generateZodiacHoroscopes(weekStartDate: Date): Promise<string> {
  try {
    const formattedDate = format(weekStartDate, 'MMMM d, yyyy');
    const weekEndDate = format(addDays(weekStartDate, 6), 'MMMM d, yyyy');
    
    const prompt = `Generate concise weekly horoscopes for all 12 zodiac signs for the week of ${formattedDate} to ${weekEndDate}.
    
    For each sign, provide:
    1. A 3-4 sentence prediction covering love, career, and personal growth
    2. One key day to watch for
    3. A single piece of practical advice
    
    Format each horoscope with the sign name as a heading (e.g., ## Aries) followed by the predictions.
    Keep each sign's horoscope to about 80-100 words.
    
    Include all 12 signs in this order: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional astrologer who specializes in writing engaging and insightful weekly horoscopes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Get the generated content
    const generatedContent = response.choices[0].message.content || '';
    
    // Format the horoscopes for HTML display
    let formattedHoroscopes = '';
    
    // Replace markdown headings with HTML headings and wrap paragraphs
    const horoscopesBySign = generatedContent.split(/^## /m).filter(section => section.trim().length > 0);
    
    formattedHoroscopes += '<div class="horoscopes-container">';
    
    // Process each sign's horoscope
    horoscopesBySign.forEach(section => {
      const lines = section.split('\n');
      const signName = lines[0].trim();
      const horoscopeContent = lines.slice(1).join('\n').trim();
      
      formattedHoroscopes += `
        <div class="horoscope-card">
          <h3>${signName}</h3>
          <div class="horoscope-content">
            <p>${horoscopeContent.replace(/\n\n/g, '</p><p>')}</p>
          </div>
        </div>
      `;
    });
    
    formattedHoroscopes += '</div>';
    
    return formattedHoroscopes;
  } catch (error) {
    console.error('Error generating zodiac horoscopes:', error);
    
    // Create a fallback response if there's an error
    let fallbackHoroscopes = '<div class="horoscopes-container">';
    
    ZODIAC_SIGNS.forEach(sign => {
      fallbackHoroscopes += `
        <div class="horoscope-card">
          <h3>${sign}</h3>
          <div class="horoscope-content">
            <p>This week brings opportunities for growth and reflection. Pay attention to your intuition and be open to unexpected connections. Your key day this week is Wednesday.</p>
          </div>
        </div>
      `;
    });
    
    fallbackHoroscopes += '</div>';
    
    return fallbackHoroscopes;
  }
}

/**
 * Generate the weekly astrological content
 */
async function generateWeeklyAstrologyContent(weekStartDate: Date): Promise<string> {
  try {
    const formattedDate = format(weekStartDate, 'MMMM d, yyyy');
    const weekEndDate = format(addDays(weekStartDate, 6), 'MMMM d, yyyy');
    
    const prompt = `Generate a comprehensive weekly astrology newsletter for the week of ${formattedDate} to ${weekEndDate}. 
    
    Include the following sections:
    
    1. This Week's Cosmic Overview: Provide a general summary of the astrological energies for the upcoming week
    2. Key Planetary Movements: Detail any significant planetary movements, transits, or aspects
    3. How the Week Unfolds: Break down key astrological influences for each day of the week
    4. Tarot Card of the Week: Suggest a tarot card that represents the energy of the week and explain its significance
    5. Practical Guidance: Offer 3-5 practical tips for working with this week's energies
    
    The content should be informative, encouraging, and accessible to readers with various levels of astrological knowledge. 
    Format the newsletter with clear section headings, proper spacing, and a conversational tone.
    
    Make the newsletter content complete, detailed, and ready to send without needing further editing.
    
    DO NOT include individual zodiac sign horoscopes as these will be added separately.
    
    Today's date is ${format(new Date(), 'MMMM d, yyyy')}.`;

    // Generate the main content
    const generalContentResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional astrologer and tarot expert who writes engaging weekly newsletters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Get the generated content
    const generalContent = generalContentResponse.choices[0].message.content || '';
    
    // Format as HTML
    const formattedGeneralContent = generalContent
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '$1');
    
    // Generate horoscopes for all zodiac signs
    console.log('Generating horoscopes for all zodiac signs...');
    const horoscopesContent = await generateZodiacHoroscopes(weekStartDate);
    
    // Combine the general content with the horoscopes
    return `
      <div class="newsletter-content">
        <p>${formattedGeneralContent}</p>
        
        <div class="horoscopes-section">
          <h2>Your Weekly Horoscopes: ${format(weekStartDate, 'MMM d')} - ${format(addDays(weekStartDate, 6), 'MMM d')}</h2>
          <p>See what the stars have in store for your sign this week...</p>
          
          ${horoscopesContent}
          
          <p class="horoscope-footnote">
            <i>Remember, these horoscopes are based on your sun sign. For a more complete picture, 
            consider reading for your moon and rising signs as well.</i>
          </p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error generating astrology content:', error);
    return '<p>We apologize, but we encountered an issue generating this week\'s astrological insights. Please check back later.</p>';
  }
}

/**
 * Generate newsletter title
 */
async function generateNewsletterTitle(weekStartDate: Date): Promise<string> {
  try {
    const formattedDate = format(weekStartDate, 'MMMM d, yyyy');
    
    const prompt = `Create an engaging title for a weekly astrology newsletter for the week starting ${formattedDate}. 
    The title should be catchy, relevant to current astrological events, and entice readers to open the email.
    The title should be no more than 10 words.
    Only return the title text without any explanation or additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You create concise, engaging email newsletter titles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 50,
    });

    const generatedTitle = response.choices[0].message.content?.trim() || '';
    return generatedTitle || `Weekly Astrology Insights: ${format(weekStartDate, 'MMM d')} - ${format(addDays(weekStartDate, 6), 'MMM d')}`;
  } catch (error) {
    console.error('Error generating newsletter title:', error);
    return `Weekly Astrology Insights: ${format(weekStartDate, 'MMM d')} - ${format(addDays(weekStartDate, 6), 'MMM d')}`;
  }
}

/**
 * Generate and send the weekly newsletter
 */
export async function generateAndSendWeeklyNewsletter(): Promise<void> {
  try {
    console.log('Starting weekly newsletter generation...');
    
    // Initialize email service if not already initialized
    await initializeEmailService();
    
    // Get the start of the current week (Sunday)
    const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 0 });
    
    // Generate title and content
    const title = await generateNewsletterTitle(weekStartDate);
    const content = await generateWeeklyAstrologyContent(weekStartDate);
    
    // Create newsletter object
    const newsletter: InsertNewsletter = {
      title,
      content,
      weekStartDate: weekStartDate.toISOString().split('T')[0],
    };
    
    // Save to database
    const savedNewsletter = await storage.createNewsletter(newsletter);
    
    console.log(`Newsletter created with ID: ${savedNewsletter.id}`);
    
    // Send to all subscribed users
    const recipientCount = await sendNewsletterToSubscribers(savedNewsletter);
    
    console.log(`Newsletter sent to ${recipientCount} subscribers`);
  } catch (error) {
    console.error('Error generating or sending newsletter:', error);
  }
}

/**
 * Check if it's time to send a weekly newsletter
 * This function should be called daily to check if it's time to send
 */
export function checkAndSendWeeklyNewsletter(): void {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Send newsletter every Sunday
  if (dayOfWeek === 0) {
    console.log('It\'s Sunday - time to send the weekly newsletter!');
    generateAndSendWeeklyNewsletter();
  } else {
    console.log(`Today is day ${dayOfWeek}, not sending newsletter (newsletters are sent on Sundays)`);
  }
}