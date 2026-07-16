import { cardTaskStyles } from './card-task.tv';
import type { TaskModel } from '@/schemas';

type CardTaskProps = {
  task: TaskModel;
};

export function CardTask({ task }: CardTaskProps) {
  return (
    <li className={cardTaskStyles()}>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {task.title}
      </span>
      {task.description && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
          {task.description}
        </span>
      )}
    </li>
  );
}
