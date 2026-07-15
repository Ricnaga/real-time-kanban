import container from './base.di';
import { TaskController } from '@/backend/modules/task/controllers/task.controller';
import { CreateTaskUseCase } from '@/backend/modules/task/use-cases/create-task.use-case';
import { FindTaskByIdUseCase } from '@/backend/modules/task/use-cases/find-task-by-id.use-case';
import { ListTasksByActionUseCase } from '@/backend/modules/task/use-cases/list-tasks-by-action.use-case';
import { UpdateTaskUseCase } from '@/backend/modules/task/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@/backend/modules/task/use-cases/delete-task.use-case';
import { MoveTaskUseCase } from '@/backend/modules/task/use-cases/move-task.use-case';

container.bind(CreateTaskUseCase).toSelf().inSingletonScope();

container.bind(FindTaskByIdUseCase).toSelf().inSingletonScope();

container.bind(ListTasksByActionUseCase).toSelf().inSingletonScope();

container.bind(UpdateTaskUseCase).toSelf().inSingletonScope();

container.bind(DeleteTaskUseCase).toSelf().inSingletonScope();

container.bind(MoveTaskUseCase).toSelf().inSingletonScope();

container.bind(TaskController).toSelf().inSingletonScope();
