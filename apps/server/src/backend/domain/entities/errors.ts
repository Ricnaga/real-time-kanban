export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class TaskNotFoundError extends DomainError {
  constructor(taskId: string) {
    super(`Task ${taskId} not found`)
  }
}

export class ActionNotFoundError extends DomainError {
  constructor(actionId: string) {
    super(`Action ${actionId} not found`)
  }
}

export class CannotDeleteDefaultActionError extends DomainError {
  constructor(actionTitle: string) {
    super(`Cannot delete default action "${actionTitle}"`)
  }
}

export class NoActionsAvailableError extends DomainError {
  constructor() {
    super('No actions available in board')
  }
}
