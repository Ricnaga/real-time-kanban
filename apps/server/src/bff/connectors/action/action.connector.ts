import { ActionController } from '@/backend/modules/action/controllers/action.controller';
import container from '@/backend/shared/container';
import { ActionModel } from './action.model';

export class ActionConnector {
  private readonly controller: ActionController;

  constructor() {
    this.controller = container.get(ActionController);
  }

  async findAll(): Promise<ActionModel[]> {
    const actions = await this.controller.findAll();
    return actions.map((a) => ({
      id: a.id,
      title: a.title,
      step: a.step,
      position: a.position,
    }));
  }

  async findById(id: string): Promise<ActionModel> {
    const action = await this.controller.findById(id);
    return {
      id: action.id,
      title: action.title,
      step: action.step,
      position: action.position,
    };
  }

  async create(data: { title: string; step: string }): Promise<ActionModel> {
    const action = await this.controller.create({
      title: data.title,
      step: data.step,
    });
    return {
      id: action.id,
      title: action.title,
      step: action.step,
      position: action.position,
    };
  }

  async update(data: {
    id: string;
    title?: string;
    step?: string;
    position: number;
  }): Promise<ActionModel> {
    const action = await this.controller.update({
      id: data.id,
      title: data.title,
      step: data.step,
      position: data.position,
    });
    return {
      id: action.id,
      title: action.title,
      step: action.step,
      position: action.position,
    };
  }

  async delete(id: string): Promise<void> {
    await this.controller.delete(id);
  }

  async move(actionId: string, newPosition: number): Promise<ActionModel[]> {
    const actions = await this.controller.move({ actionId, newPosition });
    return actions.map((a) => ({
      id: a.id,
      title: a.title,
      step: a.step,
      position: a.position,
    }));
  }
}
