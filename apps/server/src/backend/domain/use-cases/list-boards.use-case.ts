import type { BoardRepository } from '../../ports/board-repository.port'

export class ListBoardsUseCase {
  constructor(private readonly boardRepo: BoardRepository) {}

  async execute() {
    return this.boardRepo.findAll()
  }
}
