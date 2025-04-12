import { db } from '../server/db';
import { angelNumbers } from '../shared/schema';
import { AngelNumberData } from '../shared/angel-numbers-data';

// Base meanings for different number patterns
const numberMeanings = {
  '0': 'Connection to divine source, potential, wholeness, infinity, eternity',
  '1': 'New beginnings, leadership, independence, uniqueness, progress',
  '2': 'Balance, harmony, partnerships, diplomacy, cooperation',
  '3': 'Creative expression, communication, growth, expansion, optimism',
  '4': 'Stability, foundation, practicality, determination, hard work',
  '5': 'Change, freedom, adventure, versatility, learning through experience',
  '6': 'Harmony, responsibility, nurturing, service, compassion',
  '7': 'Spiritual awakening, introspection, wisdom, analysis, mysticism',
  '8': 'Abundance, power, success, achievement, material and spiritual balance',
  '9': 'Completion, humanitarianism, higher perspective, letting go'
};

// Patterns in angel numbers and their significance
const patterns = {
  same: 'amplification, intensification, mastery',
  ascending: 'progress, growth, evolution, moving forward',
  descending: 'release, simplification, focusing energy',
  alternating: 'balance, harmony between different energies',
  mirror: 'reflection, duality, balance between two aspects',
  sequential: 'orderly progress, step-by-step development'
};

// Function to generate meaningful interpretation based on digits
function generateMeaning(number: string): string {
  const digits = number.padStart(3, '0').split('');
  
  // Identify pattern
  let pattern = '';
  if (digits[0] === digits[1] && digits[1] === digits[2]) {
    pattern = 'same';
  } else if (Number(digits[0]) < Number(digits[1]) && Number(digits[1]) < Number(digits[2])) {
    pattern = 'ascending';
  } else if (Number(digits[0]) > Number(digits[1]) && Number(digits[1]) > Number(digits[2])) {
    pattern = 'descending';
  } else if ((digits[0] === digits[2]) && digits[0] !== digits[1]) {
    pattern = 'mirror';
  } else if (
    (Number(digits[1]) - Number(digits[0]) === 1 && Number(digits[2]) - Number(digits[1]) === 1) ||
    (Number(digits[0]) === 9 && Number(digits[1]) === 0 && Number(digits[2]) === 1) ||
    (Number(digits[0]) === 8 && Number(digits[1]) === 9 && Number(digits[2]) === 0)
  ) {
    pattern = 'sequential';
  } else if (
    (Number(digits[0]) % 2 === 0 && Number(digits[1]) % 2 === 1 && Number(digits[2]) % 2 === 0) ||
    (Number(digits[0]) % 2 === 1 && Number(digits[1]) % 2 === 0 && Number(digits[2]) % 2 === 1)
  ) {
    pattern = 'alternating';
  }
  
  // Generate interpretations based on digits and pattern
  const individualMeanings = digits.map(d => numberMeanings[d]).join(', ');
  const patternDesc = pattern ? patterns[pattern] : 'unique combination of energies';
  
  return `Angel number ${number} combines the energies of ${individualMeanings}. This number exhibits a ${pattern ? pattern + ' pattern' : 'unique pattern'}, representing ${patternDesc}. It encourages alignment with your higher purpose and divine guidance.`;
}

// Function to generate spiritual meaning
function generateSpiritualMeaning(number: string): string {
  const digits = number.padStart(3, '0').split('');
  const uniqueDigits = [...new Set(digits)];
  const spiritualThemes = uniqueDigits.map(d => {
    switch (d) {
      case '0': return 'divine oneness and infinite potential';
      case '1': return 'creative manifestation and spiritual awakening';
      case '2': return 'faith, trust, and spiritual partnerships';
      case '3': return 'ascended masters\' guidance and creative spiritual expression';
      case '4': return 'angelic protection and spiritual foundation';
      case '5': return 'spiritual transformation and divine changes';
      case '6': return 'unconditional love and spiritual harmony';
      case '7': return 'spiritual wisdom and divine truth';
      case '8': return 'spiritual abundance and karmic balance';
      case '9': return 'spiritual enlightenment and higher consciousness';
      default: return '';
    }
  }).join(', ');
  
  return `From a spiritual perspective, angel number ${number} resonates with ${spiritualThemes}. This number appears when your spiritual guides are encouraging you to align more deeply with your soul's purpose. It signals a time for spiritual growth and heightened awareness of the divine guidance available to you.`;
}

// Function to generate practical guidance
function generatePracticalGuidance(number: string): string {
  const digits = number.padStart(3, '0').split('');
  const mainDigit = digits.sort((a, b) => 
    digits.filter(d => d === a).length - digits.filter(d => d === b).length
  ).pop() || '0';
  
  let guidance = '';
  switch (mainDigit) {
    case '0':
      guidance = 'meditate regularly to connect with your inner wisdom, pay attention to intuitive insights, embrace the limitless potential of your spiritual journey';
      break;
    case '1':
      guidance = 'take initiative in new projects, trust your leadership abilities, focus on positive thoughts and intentions, stay independent in your thinking';
      break;
    case '2':
      guidance = 'nurture important relationships, practice patience and diplomacy, seek balance in all areas of life, collaborate with others for mutual growth';
      break;
    case '3':
      guidance = 'express yourself creatively, communicate your truth clearly, seek joy in daily activities, expand your horizons through learning';
      break;
    case '4':
      guidance = 'build solid foundations for your future, create stable routines, approach challenges methodically, stay grounded and practical';
      break;
    case '5':
      guidance = 'embrace change instead of resisting it, seek new experiences, adapt to shifting circumstances, maintain personal freedom while accepting responsibility';
      break;
    case '6':
      guidance = 'create harmony in your home environment, nurture loved ones, find balance between giving and receiving, serve others from your heart';
      break;
    case '7':
      guidance = 'study spiritual topics that resonate with you, spend time in contemplation, trust your inner wisdom, analyze situations before acting';
      break;
    case '8':
      guidance = 'recognize your personal power, create material and spiritual abundance, establish healthy boundaries, work toward meaningful achievements';
      break;
    case '9':
      guidance = 'release what no longer serves you, practice forgiveness, serve humanity in ways aligned with your skills, maintain a higher perspective';
      break;
  }
  
  return `When angel number ${number} appears in your life, consider these practical steps: ${guidance}. Pay attention to recurring thoughts and feelings when this number appears, as they contain additional guidance specific to your situation.`;
}

// Function to generate name based on digits and pattern
function generateName(number: string): string {
  const digits = number.padStart(3, '0').split('');
  
  // Identify pattern
  if (digits[0] === digits[1] && digits[1] === digits[2]) {
    const meanings: {[key: string]: string} = {
      '000': 'Infinite Potential',
      '111': 'Manifestation Portal',
      '222': 'Divine Balance',
      '333': 'Creative Ascension',
      '444': 'Angelic Protection',
      '555': 'Divine Transformation',
      '666': 'Harmonic Healing',
      '777': 'Mystical Awakening',
      '888': 'Infinite Abundance',
      '999': 'Complete Awakening'
    };
    return meanings[number] || 'Spiritual Mastery';
  }
  
  if (Number(digits[0]) < Number(digits[1]) && Number(digits[1]) < Number(digits[2])) {
    return 'Ascending Growth';
  }
  
  if (Number(digits[0]) > Number(digits[1]) && Number(digits[1]) > Number(digits[2])) {
    return 'Divine Release';
  }
  
  if ((digits[0] === digits[2]) && digits[0] !== digits[1]) {
    return 'Mirrored Reflection';
  }
  
  // Define some common themes based on the sum of digits
  const sum = digits.reduce((a, b) => a + parseInt(b), 0);
  const themes = [
    'Spiritual Guidance',
    'Divine Alignment',
    'Soul Purpose',
    'Angelic Message',
    'Cosmic Connection',
    'Harmonic Balance',
    'Sacred Journey',
    'Divine Timing',
    'Mystical Insight',
    'Celestial Wisdom'
  ];
  
  return themes[sum % themes.length];
}

// Main function to generate all angel numbers
async function generateAngelNumbers() {
  // Get existing angel numbers to avoid duplicates
  const existingNumbers = await db.select().from(angelNumbers);
  const existingNumberValues = existingNumbers.map(n => n.number);
  
  console.log(`Found ${existingNumberValues.length} existing angel numbers`);
  
  const newAngelNumbers: AngelNumberData[] = [];
  
  // Generate numbers from 000 to 999
  for (let i = 0; i <= 999; i++) {
    const number = i.toString().padStart(3, '0');
    if (existingNumberValues.includes(number)) {
      console.log(`Skipping existing number ${number}`);
      continue;
    }
    
    const angelNumber: AngelNumberData = {
      number,
      name: generateName(number),
      meaning: generateMeaning(number),
      spiritualMeaning: generateSpiritualMeaning(number),
      practicalGuidance: generatePracticalGuidance(number)
    };
    
    newAngelNumbers.push(angelNumber);
  }
  
  console.log(`Generated ${newAngelNumbers.length} new angel numbers`);
  
  // Insert the new angel numbers into the database
  if (newAngelNumbers.length > 0) {
    console.log(`Inserting ${newAngelNumbers.length} new angel numbers into the database...`);
    let inserted = 0;
    
    // Process in smaller batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < newAngelNumbers.length; i += batchSize) {
      const batch = newAngelNumbers.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(newAngelNumbers.length/batchSize)}...`);
      
      for (const angelNumber of batch) {
        try {
          await db.insert(angelNumbers).values({
            number: angelNumber.number,
            name: angelNumber.name,
            meaning: angelNumber.meaning,
            spiritualMeaning: angelNumber.spiritualMeaning,
            practicalGuidance: angelNumber.practicalGuidance
          });
          inserted++;
        } catch (error) {
          console.error(`Error inserting angel number ${angelNumber.number}:`, error);
        }
      }
      
      console.log(`Inserted ${inserted} angel numbers so far...`);
    }
    
    console.log(`Angel numbers successfully inserted! (${inserted} total)`);
  } else {
    console.log('No new angel numbers to insert.');
  }
}

// Execute the main function
generateAngelNumbers()
  .then(() => {
    console.log('Angel numbers generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error generating angel numbers:', error);
    process.exit(1);
  });