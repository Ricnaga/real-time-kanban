import type { Step } from '../entities/action'

export interface UpdateActionDTO {
  id: string
  title?: string
  step?: Step
}
