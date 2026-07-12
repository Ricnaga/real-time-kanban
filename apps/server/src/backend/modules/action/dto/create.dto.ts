import type { Step } from '../domain/entities/action'

export interface CreateActionDTO {
  title: string
  step: Step
}
