import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, useMediaQuery } from '@mui/system';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Timeline, type DataItem } from 'vis-timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import CustomTreeItem from './CustomTreeItem';
import NewTaskDialog from './NewTaskDialog';
import { TaskActionsContext } from './contexts/TaskActionContext';
import './index.css';
import { downloadFile } from './utils/file';
import { tasksToTreeItems } from './utils/tree';

export interface Task {
  id: number;
  parentId?: number;
  name: string;
  start: string;
  end: string;
  description: string;
  completed: boolean;
}

function App() {
  // State, Refs, and Derived Values
  const timelineRef = useRef<Timeline>(null);
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage if available
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const taskIdMap = useMemo(() => {
    const map = new Map<string, Task>();
    tasks.forEach(task => {
      map.set(`${task.id}`, task);
    });
    return map;
  }, [tasks]);
  // We map our tasks to the DataItem format required by vis-timeline
  const items = useMemo(() => {
    const now = new Date();
    return tasks.map<DataItem>(task => {
      const endDate = new Date(task.end);
      const isOverdue = !task.completed && endDate < now;
      return {
        id: task.id,
        content: task.name,
        // The timeline library requires a start but not an end date whereas our tasks can have just an end date
        // In the case of no start date, we use the end date as the start date to create a point in time
        start: task.start || task.end,
        end: task.start ? task.end : undefined,
        className: task.completed ? 'completed-task' : isOverdue ? 'overdue-task' : undefined,
      };
    });
  }, [tasks]);
  const [creatingNewTask, setCreatingNewTask] = useState<string | boolean>(false);

  // Effects
  useEffect(() => {
    const container = document.getElementById('visualization');
    const timeline = new Timeline(container!, items, {
      showMajorLabels: true,
      showMinorLabels: true,
      format: { minorLabels: { day: 'ddd D' } },
      minHeight: '300px',
      maxHeight: '700px',
    });
    timelineRef.current = timeline;
    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Persist tasks to localStorage everytime they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (timelineRef.current) {
      timelineRef.current.setItems(items);
    }
  }, [items]);

  const smallScreen = useMediaQuery('(max-width:800px)');

  const treeItems = tasksToTreeItems(tasks);

  const getTaskCompleted = (taskId: string) => {
    const task = tasks.find(t => taskId === `${t.id}`);
    return task ? task.completed : false;
  };
  const setTaskCompleted = (taskId: string, completed: boolean) => {
    setTasks(currentTasks => currentTasks.map(t => (taskId === `${t.id}` ? { ...t, completed } : t)));
  };
  const addSubtask = (taskId: string) => {
    setCreatingNewTask(taskId);
  };
  const deleteTask = (taskId: string) => {
    const getTaskAndSubtaskIds = (id: string, tasksList: Task[]): Set<string> => {
      const ids = new Set<string>();
      ids.add(id);
      tasksList.forEach(t => {
        if (t.parentId === Number(id)) {
          const subtaskIds = getTaskAndSubtaskIds(`${t.id}`, tasksList);
          subtaskIds.forEach(subId => ids.add(subId));
        }
      });
      return ids;
    };
    const idsToDelete = getTaskAndSubtaskIds(taskId, tasks);
    setTasks(currentTasks => currentTasks.filter(t => !idsToDelete.has(`${t.id}`)));
  };

  // New Task Dialog Handlers
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as Record<string, string>;
    const id = new Date().getTime();
    const newTask = {
      id,
      name: formJson['name'],
      description: formJson['description'],
      start: formJson['start'],
      end: formJson['end'],
      completed: false,
      parentId: typeof creatingNewTask === 'string' ? Number(creatingNewTask) : undefined,
    };
    setTasks([...tasks, newTask]);
    handleClose();
  };

  const handleClose = () => {
    setCreatingNewTask(false);
  };

  return (
    <TaskActionsContext.Provider value={{ getTaskCompleted, setTaskCompleted, addSubtask, deleteTask }}>
      <Box style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', padding: '30px 48px 30px 56px' }}>
        <NewTaskDialog
          open={!!creatingNewTask}
          subtaskOf={typeof creatingNewTask === 'string' ? taskIdMap.get(creatingNewTask)?.name : undefined}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Typography variant='h3'>Task Master</Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              downloadFile('tasks.json', tasks);
            }}>
            Export Tasks
          </Button>
        </Box>
        <Box style={{ display: 'flex', gap: '24px', flex: 1, flexDirection: smallScreen ? 'column' : 'row' }}>
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <RichTreeView
              aria-label='task-tree-view'
              disableSelection
              sx={{ overflowY: 'auto', width: smallScreen ? '100%' : '300px' }}
              items={treeItems}
              slots={{ item: CustomTreeItem }}
            />
            <Box display='flex' justifyContent='center' marginTop={2}>
              <Button color='success' variant='outlined' onClick={() => setCreatingNewTask(true)}>
                Add New Task
              </Button>
            </Box>
          </Box>
          <div id='visualization' style={{ flex: 1 }} />
        </Box>
      </Box>
    </TaskActionsContext.Provider>
  );
}

export default App;
