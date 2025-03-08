import { pgTable, varchar, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferModel } from 'drizzle-orm';

export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(),
  busy: boolean('busy').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  name: varchar({ length: 64 }).notNull().unique(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type User = InferModel<typeof usersTable>;