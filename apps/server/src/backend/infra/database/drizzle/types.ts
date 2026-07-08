import type { InferSelectModel } from 'drizzle-orm'
import { boards, columns, cards } from './schema'

export type BoardRow = InferSelectModel<typeof boards>
export type ColumnRow = InferSelectModel<typeof columns>
export type CardRow = InferSelectModel<typeof cards>
