import type { Board } from '../domain/entities/board.entity'

export interface BoardRepository {
  findById(id: string): Promise<Board | null>
  findAll(): Promise<Board[]>
  save(board: Board): Promise<void>
  delete(id: string): Promise<void>
}
