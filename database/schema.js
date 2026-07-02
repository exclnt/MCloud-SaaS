import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'user' or 'admin'
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
  expiresAt: integer("expires_at", { mode: 'timestamp' }),
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

export const plans = sqliteTable("plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  ram: text("ram").notNull(), // e.g. '500m', '1g'
  price: integer("price").notNull(),
  discount: integer("discount").notNull().default(0), // percentage 0-100
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const activity_logs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  serverId: integer("server_id").references(() => servers.id),
  subject: text("subject").notNull(),
  category: text("category").notNull(), // 'teknis', 'pembayaran', 'pertanyaan', 'lainnya'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high'
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  attachment: text("attachment"), // Base64 data URL for image attachment
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const ticket_messages = sqliteTable("ticket_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  senderRole: text("sender_role").notNull(), // 'user' or 'admin'
  message: text("message").notNull(),
  attachment: text("attachment"), // Base64 data URL for image attachment
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

