import type { ActionDomain } from '../../domain/action';

export interface IActionPort {
  findAll(): Promise<ActionDomain[]>;
  findById(id: string): Promise<ActionDomain>;
  create(data: { title: string; step: string }): Promise<ActionDomain>;
  update(data: {
    id: string;
    title?: string;
    step?: string;
  }): Promise<ActionDomain>;
  delete(id: string): Promise<void>;
}
