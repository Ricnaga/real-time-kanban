import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const actions = pgTable('actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  step: text('step').notNull(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  actionId: uuid('action_id')
    .notNull()
    .references(() => actions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
