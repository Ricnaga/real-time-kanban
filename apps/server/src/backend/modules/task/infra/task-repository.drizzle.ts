import { eq, asc, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../shared/infra/database/drizzle/drizzle.schema';
import type { ITaskRepository } from '../repositories/task-repository.interface';
import { Task } from '../entities/task';

export class DrizzleTaskRepository implements ITaskRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(task: Task) {
    await this.db.insert(schema.tasks).values({
      id: task.id,
      title: task.title,
      description: task.description,
      position: task.position,
      actionId: task.actionId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(schema.tasks)
      .orderBy(asc(schema.tasks.position));
    return rows.map(
      (r) =>
        new Task({
          id: r.id,
          title: r.title,
          description: r.description,
          position: r.position,
          actionId: r.actionId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
    );
  }

  async findById(id: string) {
    const [row] = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .limit(1);

    if (!row) return null;
    return new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      position: row.position,
      actionId: row.actionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByActionId(actionId: string) {
    const rows = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.actionId, actionId))
      .orderBy(asc(schema.tasks.position));
    return rows.map(
      (r) =>
        new Task({
          id: r.id,
          title: r.title,
          description: r.description,
          position: r.position,
          actionId: r.actionId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
    );
  }

  async update(task: Task) {
    await this.db
      .update(schema.tasks)
      .set({
        title: task.title,
        description: task.description,
        position: task.position,
        actionId: task.actionId,
        updatedAt: new Date(),
      })
      .where(eq(schema.tasks.id, task.id));
  }

  async delete(id: string) {
    await this.db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  }

  async updatePositions(items: { id: string; position: number }[]) {
    if (items.length === 0) return;

    const cases = items
      .map((item) => `WHEN '${item.id}' THEN ${item.position}`)
      .join(' ');
    const ids = items.map((item) => `'${item.id}'`).join(', ');

    await this.db.execute(
      sql`UPDATE tasks SET position = CASE id ${sql.raw(cases)} END WHERE id IN (${sql.raw(ids)})`,
    );
  }

  async reindexAfterDelete(actionId: string, deletedPosition: number) {
    await this.db.execute(
      sql`UPDATE tasks SET position = position - 1 WHERE action_id = ${actionId} AND position > ${deletedPosition}`,
    );
  }

  async countByActionId(actionId: string) {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.tasks)
      .where(eq(schema.tasks.actionId, actionId));
    return result.count;
  }
}
