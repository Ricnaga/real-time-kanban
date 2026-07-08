import type { BoardRepository } from '../../ports/board-repository.port'
import { Board } from '../entities/board.entity'

export class CreateBoardUseCase {
  constructor(private readonly boardRepo: BoardRepository) {}

  async execute(title: string) {
    const board = new Board(crypto.randomUUID(), title, [
      { id: crypto.randomUUID(), title: 'To Do', position: 0, cards: [] },
      { id: crypto.randomUUID(), title: 'In Progress', position: 1, cards: [] },
      { id: crypto.randomUUID(), title: 'Done', position: 2, cards: [] },
    ])

    await this.boardRepo.save(board)
    return board
  }
}
