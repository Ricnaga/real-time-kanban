export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public position: number,
    public actionId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
