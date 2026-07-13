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
      id: a.id.value,
      title: a.title,
      step: a.step,
    }));
  }

  async findById(id: string): Promise<ActionModel> {
    const action = await this.controller.findById(id);
    return {
      id: action.id.value,
      title: action.title,
      step: action.step,
    };
  }

  async create(data: { title: string; step: string }): Promise<ActionModel> {
    const action = await this.controller.create({
      title: data.title,
      step: data.step as never,
    });
    return {
      id: action.id.value,
      title: action.title,
      step: action.step,
    };
  }

  async update(data: {
    id: string;
    title?: string;
    step?: string;
  }): Promise<ActionModel> {
    const action = await this.controller.update({
      id: data.id,
      title: data.title,
      step: data.step as never,
    });
    return {
      id: action.id.value,
      title: action.title,
      step: action.step,
    };
  }

  async delete(id: string): Promise<void> {
    await this.controller.delete(id);
  }
}
