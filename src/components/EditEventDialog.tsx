import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { Event } from '../types';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({ 
  open, 
  onClose, 
  event 
}) => {
  const [formData, setFormData] = React.useState<Event>(event);

  React.useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useCashFlowStore.getState().updateEvent(formData);
    onClose();
  };

  const handleChange = (field: keyof Event) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      useCashFlowStore.getState().deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Event
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Event Name"
              required
              value={formData.name}
              onChange={handleChange('name')}
            />
            
            <TextField
              select
              label="Event Type"
              required
              value={formData.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="Emergency Savings">Emergency Savings</MenuItem>
              <MenuItem value="Sabbatical">Sabbatical</MenuItem>
              <MenuItem value="Vacation">Vacation</MenuItem>
            </TextField>

            <TextField
              type="number"
              label="Target Amount"
              required
              value={formData.amount}
              onChange={handleChange('amount')}
            />

            <TextField
              type="date"
              label="Target Date"
              required
              value={formData.date}
              onChange={handleChange('date')}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Progress Status"
              required
              value={formData.progress}
              onChange={handleChange('progress')}
            >
              <MenuItem value="On Track">On Track</MenuItem>
              <MenuItem value="Off Track">Off Track</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete Event
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 