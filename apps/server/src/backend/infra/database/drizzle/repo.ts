import { eq, asc, desc, and } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import type { BoardRepository } from '../../../ports/board-repository.port'
import { Board } from '../../../domain/entities/board.entity'

export class DrizzleBoardRepository implements BoardRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findById(id: string): Promise<Board | null> {
    const boardRows = await this.db
      .select()
      .from(schema.boards)
      .where(eq(schema.boards.id, id))
      .limit(1)

    if (boardRows.length === 0) return null
    const boardRow = boardRows[0]

    const columnRows = await this.db
      .select()
      .from(schema.columns)
      .where(eq(schema.columns.boardId, id))
      .orderBy(asc(schema.columns.position))

    const cardRows =
      columnRows.length > 0
        ? await this.db
            .select()
            .from(schema.cards)
            .where(
              and(...columnRows.map((c) => eq(schema.cards.columnId, c.id))) ||
                undefined,
            )
            .orderBy(asc(schema.cards.position))
        : []

    return new Board(
      boardRow.id,
      boardRow.title,
      columnRows.map((col) => ({
        id: col.id,
        title: col.title,
        position: col.position,
        cards: cardRows
          .filter((card) => card.columnId === col.id)
          .map((card) => ({
            id: card.id,
            title: card.title,
            description: card.description,
            position: card.position,
          })),
      })),
      boardRow.createdAt,
      boardRow.updatedAt,
    )
  }

  async findAll(): Promise<Board[]> {
    const boardRows = await this.db
      .select()
      .from(schema.boards)
      .orderBy(desc(schema.boards.createdAt))

    if (boardRows.length === 0) return []

    const boardIds = boardRows.map((b) => b.id)

    const columnRows = await this.db
      .select()
      .from(schema.columns)
      .where(
        and(...boardIds.map((bid) => eq(schema.columns.boardId, bid))) ||
          undefined,
      )
      .orderBy(asc(schema.columns.position))

    const cardRows =
      columnRows.length > 0
        ? await this.db
            .select()
            .from(schema.cards)
            .where(
              and(...columnRows.map((c) => eq(schema.cards.columnId, c.id))) ||
                undefined,
            )
            .orderBy(asc(schema.cards.position))
        : []

    return boardRows.map((boardRow) => {
      const boardColumns = columnRows.filter((c) => c.boardId === boardRow.id)
      return new Board(
        boardRow.id,
        boardRow.title,
        boardColumns.map((col) => ({
          id: col.id,
          title: col.title,
          position: col.position,
          cards: cardRows
            .filter((card) => card.columnId === col.id)
            .map((card) => ({
              id: card.id,
              title: card.title,
              description: card.description,
              position: card.position,
            })),
        })),
        boardRow.createdAt,
        boardRow.updatedAt,
      )
    })
  }

  async save(board: Board): Promise<void> {
    const dto = board.toDTO()
    const now = new Date()

    await this.db.transaction(async (tx) => {
      await tx
        .insert(schema.boards)
        .values({
          id: board.id,
          title: board.title,
          createdAt: dto.createdAt,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: schema.boards.id,
          set: { title: board.title, updatedAt: now },
        })

      const columnPromises = dto.columns.map((col) =>
        tx
          .insert(schema.columns)
          .values({
            id: col.id,
            title: col.title,
            position: col.position,
            boardId: board.id,
          })
          .onConflictDoUpdate({
            target: schema.columns.id,
            set: { title: col.title, position: col.position },
          }),
      )

      const cardPromises = dto.columns.flatMap((col) =>
        col.cards.map((card) =>
          tx
            .insert(schema.cards)
            .values({
              id: card.id,
              title: card.title,
              description: card.description,
              position: card.position,
              columnId: col.id,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: schema.cards.id,
              set: {
                title: card.title,
                description: card.description,
                position: card.position,
                columnId: col.id,
                updatedAt: now,
              },
            }),
        ),
      )

      await Promise.all([...columnPromises, ...cardPromises])
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(schema.boards).where(eq(schema.boards.id, id))
  }
}
