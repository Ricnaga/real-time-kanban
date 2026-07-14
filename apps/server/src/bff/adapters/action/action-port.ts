import type { ActionDomain } from '../../domain/action';

export type ActionCreateInput = {
  title: string;
  step: string;
};

export type ActionUpdateInput = {
  id: string;
  title?: string;
  step?: string;
  position: number;
};

export interface IActionPort {
  findAll(): Promise<ActionDomain[]>;
  findById(id: string): Promise<ActionDomain>;
  create(data: ActionCreateInput): Promise<ActionDomain>;
  update(data: ActionUpdateInput): Promise<ActionDomain>;
  delete(id: string): Promise<void>;
  move(actionId: string, newPosition: number): Promise<ActionDomain[]>;
}
