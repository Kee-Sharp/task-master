import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { TreeItem, type TreeItemProps } from '@mui/x-tree-view';
import React, { useState } from 'react';
import { useTaskActions } from './contexts/TaskActionContext';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Delete from '@mui/icons-material/Delete';

interface CustomLabelProps {
  children: string;
  className: string;
  id: string;
}

/**
 * A custom label for the tree item that includes a checkbox to mark the task as completed, and a button to add subtasks.
 */
function CustomLabel({ children, className, id }: CustomLabelProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsOpen = Boolean(anchorEl);
  const { getTaskCompleted, setTaskCompleted, addSubtask, deleteTask } = useTaskActions();
  const completed = getTaskCompleted(id);
  const handleCheckTask = (checked: boolean) => {
    setTaskCompleted(id, checked);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
      <Typography flex={1}>{children}</Typography>
      <Box>
        <Checkbox
          checked={completed}
          onChange={(_, checked) => handleCheckTask(checked)}
          size='small'
          sx={{ marginLeft: 1, padding: 0.5 }}
        />
        <IconButton onClick={event => setAnchorEl(event.currentTarget)} sx={{ padding: 0.5 }}>
          <MoreHoriz />
        </IconButton>
        <Menu anchorEl={anchorEl} open={moreActionsOpen} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              addSubtask(id);
              setAnchorEl(null);
            }}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText>Add Subtask</ListItemText>
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              deleteTask(id);
              handleClose();
            }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <Box display='flex'>
        <IconButton onClick={() => addSubtask(id)} sx={{ padding: 0.5 }}></IconButton>
      </Box>
    </Box>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props: TreeItemProps, ref: React.Ref<HTMLLIElement>) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { id: props.itemId } as CustomLabelProps,
      }}
    />
  );
});

export default CustomTreeItem;
