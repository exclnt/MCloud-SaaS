import { db } from './database/db.js';
import { users } from './database/schema.js';

try {
  const result = db.insert(users).values({
    username: "testuser_" + Date.now(),
    password: "password123"
  }).returning().get();
  console.log("Success with .get():", result);
} catch (e) {
  console.error("Error:", e.message);
}
