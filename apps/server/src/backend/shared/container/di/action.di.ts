import container from './base.di';
import { ActionController } from '@/backend/modules/action/controllers/action.controller';
import { CreateActionUseCase } from '@/backend/modules/action/use-cases/create-action.use-case';
import { FindActionByIdUseCase } from '@/backend/modules/action/use-cases/find-action-by-id.use-case';
import { ListActionsUseCase } from '@/backend/modules/action/use-cases/list-actions.use-case';
import { UpdateActionUseCase } from '@/backend/modules/action/use-cases/update-action.use-case';
import { DeleteActionUseCase } from '@/backend/modules/action/use-cases/delete-action.use-case';

container.bind(CreateActionUseCase).toSelf().inSingletonScope();

container.bind(FindActionByIdUseCase).toSelf().inSingletonScope();

container.bind(ListActionsUseCase).toSelf().inSingletonScope();

container.bind(UpdateActionUseCase).toSelf().inSingletonScope();

container.bind(DeleteActionUseCase).toSelf().inSingletonScope();

container.bind(ActionController).toSelf().inSingletonScope();
