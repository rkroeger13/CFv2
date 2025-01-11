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

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = React.useState<Partial<Event>>({
    type: 'Emergency Savings',
    progress: 'On Track',
    amount: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      id: crypto.randomUUID(),
      name: formData.name || '',
      type: formData.type as Event['type'],
      amount: formData.amount || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      progress: formData.progress as Event['progress']
    };

    useCashFlowStore.getState().addEvent(newEvent);
    onClose();
  };

  const handleChange = (field: keyof Event) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add Event
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
              value={formData.name || ''}
              onChange={handleChange('name')}
            />
            
            <TextField
              select
              label="Event Type"
              required
              value={formData.type || 'Emergency Savings'}
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
              value={formData.amount || ''}
              onChange={handleChange('amount')}
            />

            <TextField
              type="date"
              label="Target Date"
              required
              value={formData.date || ''}
              onChange={handleChange('date')}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Progress Status"
              required
              value={formData.progress || 'On Track'}
              onChange={handleChange('progress')}
            >
              <MenuItem value="On Track">On Track</MenuItem>
              <MenuItem value="Off Track">Off Track</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add Event</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 