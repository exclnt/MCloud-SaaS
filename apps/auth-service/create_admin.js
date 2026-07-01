import { db } from '../../database/db.js';
import { users } from '../../database/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  const existingUser = db.select().from(users).where(eq(users.username, 'admin')).get();
  if (existingUser) {
    console.log("Admin user already exists. ID:", existingUser.id);
    return;
  }
  
  const hashedPassword = await bcrypt.hash('0987654321', 10);
  const result = db.insert(users).values({
    email: 'admin@mcloud.local',
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  }).returning().get();
  
  console.log("Admin created with ID:", result.id);
}

createAdmin().catch(console.error);
