import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const boards = pgTable('boards', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const columns = pgTable('columns', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  position: integer('position').notNull(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
})

export const cards = pgTable('cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull(),
  columnId: uuid('column_id')
    .notNull()
    .references(() => columns.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
