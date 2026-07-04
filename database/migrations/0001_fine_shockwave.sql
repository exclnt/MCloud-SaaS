CREATE TABLE `activity_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`details` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `banned_players` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer NOT NULL,
	`player_name` text NOT NULL,
	`reason` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`ram` text NOT NULL,
	`price` integer NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_name_unique` ON `plans` (`name`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ticket_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`sender_role` text NOT NULL,
	`message` text NOT NULL,
	`attachment` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`server_id` integer,
	`subject` text NOT NULL,
	`category` text NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`attachment` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `servers` ADD `seed` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `difficulty` text DEFAULT 'easy' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `gamemode` text DEFAULT 'survival' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `version` text DEFAULT 'latest' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `visibility` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `tags` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `motd` text DEFAULT 'A Minecraft Server' NOT NULL;--> statement-breakpoint
ALTER TABLE `servers` ADD `expires_at` integer;--> statement-breakpoint
ALTER TABLE `transactions` ADD `config` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email` text;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;