import { eq, asc, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../shared/infra/database/drizzle/drizzle.schema';
import type { IActionRepository } from '../repositories/action-repository.interface';
import { Action } from '../entities/action';

export class DrizzleActionRepository implements IActionRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(action: Action) {
    await this.db.insert(schema.actions).values({
      id: action.id,
      title: action.title,
      step: action.step,
      position: action.position,
    });
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(schema.actions)
      .orderBy(asc(schema.actions.position));
    return rows.map(
      (r) =>
        new Action({
          id: r.id,
          title: r.title,
          step: r.step,
          position: r.position,
        }),
    );
  }

  async findById(id: string) {
    const [row] = await this.db
      .select()
      .from(schema.actions)
      .where(eq(schema.actions.id, id))
      .limit(1);

    if (!row) return null;
    return new Action({
      id: row.id,
      title: row.title,
      step: row.step,
      position: row.position,
    });
  }

  async findByName(name: string) {
    const [row] = await this.db
      .select()
      .from(schema.actions)
      .where(eq(schema.actions.title, name))
      .limit(1);

    if (!row) return null;
    return new Action({
      id: row.id,
      title: row.title,
      step: row.step,
      position: row.position,
    });
  }

  async update(action: Action) {
    await this.db
      .update(schema.actions)
      .set({
        title: action.title,
        step: action.step,
        position: action.position,
      })
      .where(eq(schema.actions.id, action.id));
  }

  async delete(id: string) {
    await this.db.delete(schema.actions).where(eq(schema.actions.id, id));
  }

  async updatePositions(items: { id: string; position: number }[]) {
    if (items.length === 0) return;

    const cases = items
      .map((item) => `WHEN '${item.id}' THEN ${item.position}`)
      .join(' ');
    const ids = items.map((item) => `'${item.id}'`).join(', ');

    await this.db.execute(
      sql`UPDATE actions SET position = CASE id ${sql.raw(cases)} END WHERE id IN (${sql.raw(ids)})`,
    );
  }

  async reindexAfterDelete(deletedPosition: number) {
    await this.db.execute(
      sql`UPDATE actions SET position = position - 1 WHERE position > ${deletedPosition}`,
    );
  }

  async count() {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.actions);
    return result.count;
  }
}
