import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const actions = pgTable('actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  step: text('step').notNull(),
  position: integer('position').notNull().default(0),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull().default(0),
  actionId: uuid('action_id')
    .notNull()
    .references(() => actions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
