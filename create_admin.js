import { db } from './database/db.js';
import { users } from './database/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('0987654321', 10);
  const existingUser = db.select().from(users).where(eq(users.username, 'admin')).get();
  if (existingUser) {
    db.update(users).set({ password: hashedPassword, role: 'admin' }).where(eq(users.id, existingUser.id)).run();
    console.log("Admin user already exists. Password has been reset to '0987654321'. ID:", existingUser.id);
    return;
  }
  
  const result = db.insert(users).values({
    email: 'admin@mcloud.local',
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  }).returning().get();
  
  console.log("Admin created with ID:", result.id, "and password '0987654321'");
}

createAdmin().catch(console.error);
