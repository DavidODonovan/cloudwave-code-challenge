import { pgTable, varchar, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(),
  busy: boolean('busy').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  name: varchar({ length: 64 }).notNull().unique(),
  online: boolean('online').default(false).notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const messagesTable = pgTable("messages", {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  sender_id: integer().notNull(),
  receiver_id: integer().notNull()
})

export type NewUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;