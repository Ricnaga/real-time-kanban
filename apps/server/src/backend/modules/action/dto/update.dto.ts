import type { Step } from '../domain/entities/action'

export interface UpdateActionDTO {
  id: string
  title?: string
  step?: Step
}
