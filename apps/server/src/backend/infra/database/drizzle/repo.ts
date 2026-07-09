import { eq, asc, inArray } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import type { ActionRepository } from '../../../ports/action-repository.port'
import type { TaskRepository } from '../../../ports/task-repository.port'
import { Action } from '../../../domain/entities/action.entity'
import { Task } from '../../../domain/entities/task.entity'

export class DrizzleActionRepository implements ActionRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    const rows = await this.db
      .select()
      .from(schema.actions)
      .orderBy(asc(schema.actions.position))

    return rows.map((r) => new Action(r.id, r.title, r.position, r.isDefault))
  }

  async findById(id: string) {
    const [row] = await this.db
      .select()
      .from(schema.actions)
      .where(eq(schema.actions.id, id))
      .limit(1)

    if (!row) return null
    return new Action(row.id, row.title, row.position, row.isDefault)
  }

  async save(action: Action) {
    await this.db
      .insert(schema.actions)
      .values({
        id: action.id,
        title: action.title,
        position: action.position,
        isDefault: action.isDefault,
      })
      .onConflictDoUpdate({
        target: schema.actions.id,
        set: { title: action.title, position: action.position },
      })
  }

  async delete(id: string) {
    await this.db.delete(schema.actions).where(eq(schema.actions.id, id))
  }

  async updatePositions(items: Array<{ id: string; position: number }>) {
    await this.db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(schema.actions)
          .set({ position: item.position })
          .where(eq(schema.actions.id, item.id))
      }
    })
  }
}

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findByActionIds(actionIds: string[]) {
    if (actionIds.length === 0) return []

    const rows = await this.db
      .select()
      .from(schema.tasks)
      .where(inArray(schema.tasks.actionId, actionIds))
      .orderBy(asc(schema.tasks.position))

    return rows.map(
      (r) =>
        new Task(
          r.id,
          r.title,
          r.description,
          r.position,
          r.actionId,
          r.createdAt,
          r.updatedAt,
        ),
    )
  }

  async findById(id: string) {
    const [row] = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .limit(1)

    if (!row) return null
    return new Task(
      row.id,
      row.title,
      row.description,
      row.position,
      row.actionId,
      row.createdAt,
      row.updatedAt,
    )
  }

  async save(task: Task) {
    await this.db
      .insert(schema.tasks)
      .values({
        id: task.id,
        title: task.title,
        description: task.description,
        position: task.position,
        actionId: task.actionId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })
      .onConflictDoUpdate({
        target: schema.tasks.id,
        set: {
          title: task.title,
          description: task.description,
          position: task.position,
          actionId: task.actionId,
          updatedAt: task.updatedAt,
        },
      })
  }

  async delete(id: string) {
    await this.db.delete(schema.tasks).where(eq(schema.tasks.id, id))
  }

  async updateActionId(taskId: string, actionId: string, position: number) {
    await this.db
      .update(schema.tasks)
      .set({ actionId, position, updatedAt: new Date() })
      .where(eq(schema.tasks.id, taskId))
  }
}
