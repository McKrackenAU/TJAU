import { storage } from "../server/storage";
import { db } from "../server/db";
import { eq } from "drizzle-orm";
import { learningTracks } from "../shared/schema";

async function main() {
  console.log("Starting initialization of learning tracks...");
  
  // Check if tracks already exist
  const existingTracks = await storage.getLearningTracks();
  if (existingTracks.length > 0) {
    console.log(`Found ${existingTracks.length} existing tracks. Skipping initialization.`);
    return;
  }
  
  // Create beginner track
  console.log("Creating Beginner's Journey track...");
  await storage.createLearningTrack({
    name: "Beginner's Journey",
    description: "Master all 22 Major Arcana cards with detailed lessons on their symbolism and meanings.",
    difficulty: "beginner",
    requiredCards: [
      "fool", "magician", "high-priestess", "empress", "emperor", 
      "hierophant", "lovers", "chariot", "strength", "hermit", 
      "wheel-of-fortune", "justice", "hanged-man", "death", "temperance", 
      "devil", "tower", "star", "moon", "sun", 
      "judgement", "world"
    ],
    // The first image will be used as the track thumbnail
    cardImages: ["/api/card/image/fool", "/api/card/image/magician", "/api/card/image/high-priestess"],
    estimatedHours: 22,
    // No prerequisites for beginner track
    prerequisites: []
  });
  
  // Create intermediate track
  console.log("Creating Intuitive Reading track...");
  await storage.createLearningTrack({
    name: "Intuitive Reading",
    description: "Develop your intuitive tarot reading skills with the emotional Cups suit.",
    difficulty: "intermediate",
    requiredCards: ["ace-of-cups", "two-of-cups", "three-of-cups", "four-of-cups", "five-of-cups"],
    cardImages: ["/api/card/image/ace-of-cups", "/api/card/image/two-of-cups", "/api/card/image/three-of-cups"],
    estimatedHours: 8,
    // Require completion of beginner track
    prerequisites: [1]
  });
  
  // Create advanced track
  console.log("Creating Advanced Symbolism track...");
  await storage.createLearningTrack({
    name: "Advanced Symbolism",
    description: "Master the deep symbolic language of tarot with powerful Major Arcana cards.",
    difficulty: "advanced",
    requiredCards: ["wheel-of-fortune", "hanged-man", "death", "tower", "star"],
    cardImages: ["/api/card/image/wheel-of-fortune", "/api/card/image/death", "/api/card/image/star"],
    estimatedHours: 10,
    // Require completion of both previous tracks
    prerequisites: [1, 2]
  });
  
  console.log("Learning tracks initialized successfully!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error initializing learning tracks:", error);
    process.exit(1);
  });