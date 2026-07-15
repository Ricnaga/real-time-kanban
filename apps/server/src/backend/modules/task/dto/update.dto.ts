export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string | null;
  position?: number;
  actionId?: string;
}
