import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface NewTaskDialogProps {
  open: boolean;
  subtaskOf?: string;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const NewTaskDialog = ({ open, subtaskOf, handleClose, handleSubmit }: NewTaskDialogProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Create a New ${subtaskOf ? `Subtask of "${subtaskOf}"` : 'Task'}`}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id='subscription-form'>
          <TextField autoFocus required margin='dense' id='name' name='name' label='Name' type='text' fullWidth />
          <TextField
            margin='dense'
            id='description'
            name='description'
            label='Description'
            type='text'
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            margin='dense'
            id='start'
            name='start'
            label='Start'
            type='datetime-local'
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            required
            margin='dense'
            id='end'
            name='end'
            label='End'
            type='datetime-local'
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color='error' onClick={handleClose}>
          Cancel
        </Button>
        <Button color='success' type='submit' form='subscription-form'>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTaskDialog;
