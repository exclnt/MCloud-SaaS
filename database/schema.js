import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const servers = sqliteTable("servers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  status: text("status").notNull().default("stopped"), // stopped, running, starting
  ip: text("ip").notNull().default("127.0.0.1"),
  port: integer("port").notNull().unique(),
  memoryLimit: text("memory_limit").notNull().default("2g"),
  seed: text("seed").notNull().default(""),
  difficulty: text("difficulty").notNull().default("easy"),
  gamemode: text("gamemode").notNull().default("survival"),
  version: text("version").notNull().default("latest"),
  visibility: text("visibility").notNull().default("public"),
  tags: text("tags").notNull().default(""),
  motd: text("motd").notNull().default("A Minecraft Server"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, success, failed
  snapToken: text("snap_token"),
  config: text("config"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const banned_players = sqliteTable("banned_players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serverId: integer("server_id").notNull().references(() => servers.id),
  playerName: text("player_name").notNull(),
  reason: text("reason"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
