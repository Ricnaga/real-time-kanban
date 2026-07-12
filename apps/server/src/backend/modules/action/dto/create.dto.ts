import type { Step } from '../entities/action'

export interface CreateActionDTO {
  title: string
  step: Step
}
