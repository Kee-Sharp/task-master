import type { TreeViewBaseItem } from '@mui/x-tree-view';
import type { Task } from '../App';

export const tasksToTreeItems = (tasks: Task[]) => {
  const tasksClone = structuredClone(tasks);
  const idMap = new Map<string, TreeViewBaseItem>();
  tasksClone.forEach(task => {
    const id = `${task.id}`;

    const label = task.name;
    let newTreeItem: TreeViewBaseItem = { id, label };
    idMap.set(id, newTreeItem);
  });
  tasksClone.forEach(task => {
    if (!task.parentId) return;
    const parentId = `${task.parentId}`;
    const parentTreeItem = idMap.get(parentId);
    if (!parentTreeItem) return console.warn(`Found task "${task.id}" with no matching parent "${parentId}"`);
    const { children = [] } = parentTreeItem;
    const newTreeItem = idMap.get(`${task.id}`)!;
    parentTreeItem.children = [...children, newTreeItem];
  });
  const finalList = tasksClone.reduce<TreeViewBaseItem[]>((acc, task) => {
    const node = idMap.get(`${task.id}`);
    if (!node || task.parentId) return acc;
    return [...acc, node];
  }, []);
  return finalList;
};
