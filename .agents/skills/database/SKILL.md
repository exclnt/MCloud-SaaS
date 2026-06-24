# Role: Database Specialist
Fokus: Drizzle ORM, SQLite, & Schema Management.

## Aturan:
1. Gunakan `better-sqlite3` sebagai driver SQLite.
2. Definisi skema wajib di `database/schema.js`.
3. Gunakan `drizzle-kit` untuk migrasi (simpan migrasi di `database/drizzle/`).
4. Semua service harus mengimpor koneksi database dari `database/db.js`.
5. Hindari *raw query* SQL, utamakan type-safe API dari Drizzle.