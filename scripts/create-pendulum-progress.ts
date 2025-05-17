import { db } from "../server/db";
import { userProgress } from "../shared/schema";

async function createPendulumProgress() {
  try {
    // Insert progress for user ID 1 for the pendulum course (track ID 5)
    const result = await db.insert(userProgress).values({
      userId: 1,
      trackId: 5,
      completedLessons: [],
      achievements: [],
      currentLesson: 1,
      startDate: new Date(),
      lastActive: new Date()
    }).returning();

    console.log("Created pendulum progress:", result);
  } catch (error) {
    console.error("Failed to create pendulum progress:", error);
  }
}

createPendulumProgress()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Script error:", err);
    process.exit(1);
  });