import type { CreateBoardUseCase } from '../domain/use-cases/create-board.use-case'
import type { ListBoardsUseCase } from '../domain/use-cases/list-boards.use-case'
import type { MoveCardUseCase } from '../domain/use-cases/move-card.use-case'

export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly listBoardsUseCase: ListBoardsUseCase,
    private readonly moveCardUseCase: MoveCardUseCase,
  ) {}

  async create(title: string) {
    const board = await this.createBoardUseCase.execute(title)
    return board.toDTO()
  }

  async list() {
    const boards = await this.listBoardsUseCase.execute()
    return boards.map((b) => b.toDTO())
  }

  async moveCard(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    position: number,
  ) {
    const board = await this.moveCardUseCase.execute(
      boardId,
      cardId,
      targetColumnId,
      position,
    )
    return board.toDTO()
  }
}
