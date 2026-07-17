import { fabStyles } from './fab-create-task.tv';

type FabCreateTaskProps = {
  onClick: () => void;
};

export function FabCreateTask({ onClick }: FabCreateTaskProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Criar task"
      className={fabStyles()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </button>
  );
}
