export type ColumnProps = {
  id: string
  title: string
  position: number
  cards: CardProps[]
}

export type CardProps = {
  id: string
  title: string
  description: string | null
  position: number
}

export class Card {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public position: number,
  ) {}

  static create(props: CardProps): Card {
    return new Card(props.id, props.title, props.description, props.position)
  }
}

export class Column {
  public readonly cards: Card[]

  constructor(
    public readonly id: string,
    public title: string,
    public position: number,
    cards: CardProps[] = [],
  ) {
    this.cards = cards.map(Card.create)
  }

  addCard(card: Card): void {
    this.cards.push(card)
  }

  removeCard(cardId: string): Card | undefined {
    const index = this.cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined
    return this.cards.splice(index, 1)[0]
  }
}

export class Board {
  public readonly columns: Column[]
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(
    public readonly id: string,
    public title: string,
    columns: ColumnProps[] = [],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.columns = columns.map(
      (c) => new Column(c.id, c.title, c.position, c.cards),
    )
    this.createdAt = createdAt ?? new Date()
    this.updatedAt = updatedAt ?? new Date()
  }

  moveCard(cardId: string, targetColumnId: string, position: number): void {
    let card: Card | undefined

    for (const col of this.columns) {
      const found = col.removeCard(cardId)
      if (found) {
        card = found
        break
      }
    }

    if (!card) throw new Error(`Card ${cardId} not found`)

    const target = this.columns.find((c) => c.id === targetColumnId)
    if (!target) throw new Error(`Column ${targetColumnId} not found`)

    card.position = position
    target.addCard(card)
  }

  toDTO() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      columns: this.columns.map((col) => ({
        id: col.id,
        title: col.title,
        position: col.position,
        cards: col.cards.map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description,
          position: card.position,
          columnId: col.id,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        })),
      })),
    }
  }
}
