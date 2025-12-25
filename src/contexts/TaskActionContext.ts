import { createContext, useContext } from 'react';

interface TaskActions {
  getTaskCompleted: (taskId: string) => boolean;
  setTaskCompleted: (taskId: string, completed: boolean) => void;
  addSubtask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const TaskActionsContext = createContext<TaskActions>({
  getTaskCompleted() {
    return false;
  },
  setTaskCompleted() {},
  addSubtask() {},
  deleteTask() {},
});

/**
 * A custom hook to access the actions for the tasks.
 */
export function useTaskActions() {
  return useContext(TaskActionsContext);
}
