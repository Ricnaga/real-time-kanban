import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../../shared/infra/database/drizzle/drizzle.schema'
import type { IActionRepository } from '../domain/repositories/action-repository.interface'
import { Action, Step } from '../domain/entities/action'
import { ActionId } from '../domain/value-objects/action-id'

export class DrizzleActionRepository implements IActionRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(action: Action) {
    await this.db.insert(schema.actions).values({
      id: action.id.value,
      title: action.title,
      step: action.step,
    })
  }

  async findAll() {
    const rows = await this.db.select().from(schema.actions)
    return rows.map(
      (r) =>
        new Action({
          id: new ActionId(r.id),
          title: r.title,
          step: r.step as Step,
        }),
    )
  }

  async findById(id: ActionId) {
    const [row] = await this.db
      .select()
      .from(schema.actions)
      .where(eq(schema.actions.id, id.value))
      .limit(1)

    if (!row) return null
    return new Action({
      id: new ActionId(row.id),
      title: row.title,
      step: row.step as Step,
    })
  }

  async findByName(name: string) {
    const [row] = await this.db
      .select()
      .from(schema.actions)
      .where(eq(schema.actions.title, name))
      .limit(1)

    if (!row) return null
    return new Action({
      id: new ActionId(row.id),
      title: row.title,
      step: row.step as Step,
    })
  }

  async update(action: Action) {
    await this.db
      .update(schema.actions)
      .set({ title: action.title, step: action.step })
      .where(eq(schema.actions.id, action.id.value))
  }

  async delete(id: ActionId) {
    await this.db.delete(schema.actions).where(eq(schema.actions.id, id.value))
  }
}
