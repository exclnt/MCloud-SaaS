import { db } from './db.js';
import { plans, settings } from './schema.js';
import { eq } from 'drizzle-orm';

const defaultPlans = [
  { name: 'Villager', ram: '500m', price: 15000, discount: 0 },
  { name: 'Spider', ram: '1g', price: 25000, discount: 0 },
  { name: 'Slime', ram: '2g', price: 50000, discount: 10 },
  { name: 'Wither', ram: '4g', price: 100000, discount: 20 },
];

async function seed() {
  console.log('Seeding plans...');
  for (const p of defaultPlans) {
    const existing = db.select().from(plans).where(eq(plans.name, p.name)).get();
    if (!existing) {
      db.insert(plans).values(p).run();
      console.log(`Inserted ${p.name}`);
    } else {
      console.log(`${p.name} already exists`);
    }
  }

  console.log('Seeding settings...');
  const existingRam = db.select().from(settings).where(eq(settings.key, 'total_available_ram')).get();
  if (!existingRam) {
    db.insert(settings).values({ key: 'total_available_ram', value: '8192' }).run();
    console.log('Inserted default total_available_ram = 8192 MB');
  } else {
    console.log(`total_available_ram already set to ${existingRam.value} MB`);
  }

  console.log('Done!');
}

seed().catch(console.error);
