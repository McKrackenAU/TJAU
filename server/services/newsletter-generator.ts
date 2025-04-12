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

// Common Angel Numbers and their base meanings
const ANGEL_NUMBERS = [
  '111', '222', '333', '444', '555', '666', '777', '888', '999',
  '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1010', '1212', '1234', '0000', '1222', '2323', '1133', '0101', '0707'
];

/**
 * Generate weekly Angel Number guidance
 */
async function generateAngelNumberGuidance(weekStartDate: Date): Promise<string> {
  try {
    const formattedDate = format(weekStartDate, 'MMMM d, yyyy');
    const weekEndDate = format(addDays(weekStartDate, 6), 'MMMM d, yyyy');
    
    // Randomly select 3 Angel Numbers from our list for this week
    const shuffled = [...ANGEL_NUMBERS].sort(() => 0.5 - Math.random());
    const selectedNumbers = shuffled.slice(0, 3);
    
    const prompt = `Generate interpretations for these Angel Numbers for the week of ${formattedDate} to ${weekEndDate}: ${selectedNumbers.join(', ')}.
    
    For each Angel Number, provide:
    1. What this number sequence symbolizes or represents spiritually
    2. What message the angels might be sending through this number
    3. One practical way to work with this energy in daily life
    
    Format with each Angel Number as a heading (e.g., ## 111) followed by a concise interpretation of 60-80 words.
    
    The content should be encouraging, positive, and accessible to readers with various levels of spiritual knowledge.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a spiritual guide with deep knowledge of numerology and angel numbers. You write insightful, positive interpretations that help people understand the meaning behind number patterns they encounter."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Get the generated content
    const generatedContent = response.choices[0].message.content || '';
    
    // Format the angel number interpretations for HTML display
    let formattedInterpretations = '';
    
    // Replace markdown headings with HTML headings
    const interpretationsByNumber = generatedContent.split(/^## /m).filter(section => section.trim().length > 0);
    
    formattedInterpretations += '<div class="angel-numbers-container">';
    
    // Process each angel number's interpretation
    interpretationsByNumber.forEach(section => {
      const lines = section.split('\n');
      const angelNumber = lines[0].trim();
      const interpretation = lines.slice(1).join('\n').trim();
      
      formattedInterpretations += `
        <div class="angel-number-card">
          <h3>${angelNumber}</h3>
          <div class="angel-number-content">
            <p>${interpretation.replace(/\n\n/g, '</p><p>')}</p>
          </div>
        </div>
      `;
    });
    
    formattedInterpretations += '</div>';
    
    return `
      <div class="angel-numbers-section">
        <h2>Angel Numbers of the Week</h2>
        <p>Pay attention to these special number sequences this week. If you see them repeatedly, the angels may be sending you a message!</p>
        ${formattedInterpretations}
        <p class="angel-number-footnote">
          <i>Angel numbers are sequences that carry divine guidance. If you see other repeating numbers frequently, 
          they may hold personal messages for your unique journey.</i>
        </p>
      </div>
    `;
  } catch (error) {
    console.error('Error generating Angel Number guidance:', error);
    
    // Create a fallback response if there's an error
    const selectedNumbers = ['111', '444', '777'];
    let fallbackContent = '<div class="angel-numbers-container">';
    
    fallbackContent += `
      <div class="angel-number-card">
        <h3>111</h3>
        <div class="angel-number-content">
          <p>This powerful manifestation number reminds you that your thoughts create your reality. Pay attention to your thoughts and focus on what you want to bring into your life, not what you fear. Practice positive affirmations throughout the week.</p>
        </div>
      </div>
      <div class="angel-number-card">
        <h3>444</h3>
        <div class="angel-number-content">
          <p>The angels surround you with protection and support. This number represents stability and encourages you to build solid foundations. You're on the right path, and divine help is available. Take time to connect with your spiritual practice.</p>
        </div>
      </div>
      <div class="angel-number-card">
        <h3>777</h3>
        <div class="angel-number-content">
          <p>This deeply spiritual number carries energies of wisdom and spiritual awakening. The universe is recognizing your growth and encouraging you to trust your intuition. Spend time in contemplation and be open to spiritual insights.</p>
        </div>
      </div>
    `;
    
    fallbackContent += '</div>';
    
    return `
      <div class="angel-numbers-section">
        <h2>Angel Numbers of the Week</h2>
        <p>Pay attention to these special number sequences this week. If you see them repeatedly, the angels may be sending you a message!</p>
        ${fallbackContent}
        <p class="angel-number-footnote">
          <i>Angel numbers are sequences that carry divine guidance. If you see other repeating numbers frequently, 
          they may hold personal messages for your unique journey.</i>
        </p>
      </div>
    `;
  }
}

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
    
    // Generate angel number guidance
    console.log('Generating Angel Number guidance...');
    const angelNumbersContent = await generateAngelNumberGuidance(weekStartDate);
    
    // Combine the general content with the horoscopes and angel numbers
    return `
      <style>
        /* Newsletter Styles */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #4a4a4a;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 20px;
          margin-top: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        p {
          margin-bottom: 15px;
        }
        .horoscopes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .horoscope-card {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          background-color: #f9f9f9;
        }
        .horoscope-content {
          font-size: 14px;
        }
        .horoscope-footnote {
          margin-top: 30px;
          font-size: 13px;
          color: #666;
        }
        /* Angel Number Styles */
        .angel-numbers-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .angel-numbers-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .angel-number-card {
          border: 1px solid #d4d1e4;
          border-radius: 5px;
          padding: 15px;
          background-color: #f8f6ff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .angel-number-card h3 {
          color: #6b5cb3;
          font-size: 20px;
          text-align: center;
          margin-bottom: 12px;
          border-bottom: 1px dashed #d4d1e4;
          padding-bottom: 8px;
        }
        .angel-number-content {
          font-size: 14px;
        }
        .angel-number-footnote {
          margin-top: 30px;
          font-size: 13px;
          color: #666;
          font-style: italic;
        }
      </style>
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
        
        ${angelNumbersContent}
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
    
    const prompt = `Create an engaging title for a weekly astrology and angel numbers newsletter for the week starting ${formattedDate}. 
    The title should be catchy, relevant to current astrological events or spiritual guidance, and entice readers to open the email.
    Consider incorporating terms like "celestial guidance," "angelic messages," or "cosmic wisdom" if appropriate.
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