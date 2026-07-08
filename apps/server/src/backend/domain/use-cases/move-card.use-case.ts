import type { BoardRepository } from '../../ports/board-repository.port'
import type { EventPublisher } from '../../ports/event-publisher.port'

export class MoveCardUseCase {
  constructor(
    private readonly boardRepo: BoardRepository,
    private readonly eventBus: EventPublisher,
  ) {}

  async execute(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    position: number,
  ) {
    const board = await this.boardRepo.findById(boardId)
    if (!board) throw new Error(`Board ${boardId} not found`)

    board.moveCard(cardId, targetColumnId, position)
    await this.boardRepo.save(board)

    await this.eventBus.publish('card:moved', {
      boardId,
      cardId,
      targetColumnId,
      position,
    })

    return board
  }
}
