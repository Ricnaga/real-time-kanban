'use client';

import { createContext, useContext, useRef, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { TaskModel } from '@/schemas';

type BoardDndContextValue = {
  findColumn: (id: string) => string | null;
  registerTask: (taskId: string, actionId: string) => void;
  unregisterTask: (taskId: string) => void;
  getTaskCount: (actionId: string) => number;
  registerTaskCount: (actionId: string, count: number) => void;
  registerTaskData: (taskId: string, data: TaskModel) => void;
  getTaskData: (taskId: string) => TaskModel | null;
  getTaskIndex: (taskId: string) => number | null;
};

const BoardDndContext = createContext<BoardDndContextValue | null>(null);

export function useBoardDnd() {
  const ctx = useContext(BoardDndContext);
  if (!ctx) throw new Error('useBoardDnd must be used within BoardDndProvider');
  return ctx;
}

type BoardDndProviderProps = {
  children: ReactNode;
  columnIds: string[];
};

export function BoardDndProvider({
  children,
  columnIds,
}: BoardDndProviderProps) {
  const taskColumnMap = useRef(new Map<string, string>());
  const taskCountMap = useRef(new Map<string, number>());
  const taskDataMap = useRef(new Map<string, TaskModel>());

  const findColumn = useCallback(
    (id: string): string | null => {
      if (columnIds.includes(id)) return id;
      return taskColumnMap.current.get(id) ?? null;
    },
    [columnIds],
  );

  const registerTask = useCallback((taskId: string, actionId: string) => {
    taskColumnMap.current.set(taskId, actionId);
  }, []);

  const unregisterTask = useCallback((taskId: string) => {
    taskColumnMap.current.delete(taskId);
    taskDataMap.current.delete(taskId);
  }, []);

  const getTaskCount = useCallback((actionId: string) => {
    return taskCountMap.current.get(actionId) ?? 0;
  }, []);

  const registerTaskCount = useCallback((actionId: string, count: number) => {
    taskCountMap.current.set(actionId, count);
  }, []);

  const registerTaskData = useCallback((taskId: string, data: TaskModel) => {
    taskDataMap.current.set(taskId, data);
  }, []);

  const getTaskData = useCallback((taskId: string) => {
    return taskDataMap.current.get(taskId) ?? null;
  }, []);

  const getTaskIndex = useCallback((taskId: string): number | null => {
    const actionId = taskColumnMap.current.get(taskId);
    if (!actionId) return null;
    const tasks = Array.from(taskDataMap.current.entries())
      .filter(([, data]) => data.actionId === actionId)
      .sort((a, b) => a[1].position - b[1].position);
    return tasks.findIndex(([id]) => id === taskId);
  }, []);

  const value = useMemo<BoardDndContextValue>(
    () => ({
      findColumn,
      registerTask,
      unregisterTask,
      getTaskCount,
      registerTaskCount,
      registerTaskData,
      getTaskData,
      getTaskIndex,
    }),
    [
      findColumn,
      registerTask,
      unregisterTask,
      getTaskCount,
      registerTaskCount,
      registerTaskData,
      getTaskData,
      getTaskIndex,
    ],
  );

  return (
    <BoardDndContext.Provider value={value}>
      {children}
    </BoardDndContext.Provider>
  );
}
