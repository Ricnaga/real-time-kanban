export type BoardDTO = {
  id: string
  title: string
  columns: ColumnDTO[]
  createdAt: Date
  updatedAt: Date
}

export type ColumnDTO = {
  id: string
  title: string
  position: number
  cards: CardDTO[]
}

export type CardDTO = {
  id: string
  title: string
  description: string | null
  position: number
  columnId: string
  createdAt: Date
  updatedAt: Date
}

export type CreateBoardInput = {
  title: string
}

export type CreateCardInput = {
  title: string
  description?: string
  columnId: string
}

export type MoveCardInput = {
  cardId: string
  targetColumnId: string
  position: number
}

export type BoardEvent = {
  type: 'board:created' | 'board:updated' | 'card:created' | 'card:moved'
  payload: BoardDTO | CardDTO
}
