import type { InferSelectModel } from 'drizzle-orm'
import { actions, tasks } from './schema'

export type ActionRow = InferSelectModel<typeof actions>
export type TaskRow = InferSelectModel<typeof tasks>
