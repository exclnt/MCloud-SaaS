import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/schema.js',
  out: './database/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './database/sqlite.db',
  },
});
