import { db } from "../server/db";
import { eq } from "drizzle-orm";
import { learningTracks } from "../shared/schema";

async function main() {
  console.log("Updating learning tracks...");
  
  // Update the Intuitive Reading track (ID 10)
  // Include all the Cups, Wands, and Pentacles cards, including the Knights
  const intuitiveReadingCards = [
    // Cups suit
    "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "cp", "cn", "ck", "cq",
    // Wands suit
    "w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10", "wp", "wn", "wk", "wq",
    // Pentacles suit
    "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "pp", "pn", "pk", "pq"
  ];
  
  // Update the track in the database
  await db.update(learningTracks)
    .set({ 
      requiredCards: intuitiveReadingCards,
      description: "Develop your intuitive tarot reading skills with the Cups, Wands, and Pentacles suits."
    })
    .where(eq(learningTracks.id, 10));
  
  console.log("Learning tracks updated successfully!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error updating learning tracks:", error);
    process.exit(1);
  });