import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { Event } from '../types';
import { AddEventDialog } from './AddEventDialog';
import { EditEventDialog } from './EditEventDialog';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit }) => {
  const progressColor = event.progress === 'On Track' ? 'success' : 'error';
  const progressValue = event.progress === 'On Track' ? 75 : 45;

  return (
    <Paper sx={{ mb: 2, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>{event.name}</Typography>
            <Chip 
              label={event.type} 
              size="small"
              color={
                event.type === 'Emergency Savings' ? 'default' :
                event.type === 'Sabbatical' ? 'primary' : 'secondary'
              }
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Target Date: {format(new Date(event.date), 'MMM d, yyyy')}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => onEdit(event)}>
          <EditIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              Target Amount: ${event.amount.toLocaleString()}
            </Typography>
            <Typography 
              variant="body2" 
              color={progressColor === 'success' ? 'success.main' : 'error.main'}
            >
              {event.progress}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressValue} 
            color={progressColor}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export const EventsList: React.FC = () => {
  const { events } = useCashFlowStore();
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);
  
  const handleOpenEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setSelectedEvent(null);
    setIsEditDialogOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Events</Typography>
        <Button variant="outlined" onClick={handleOpenAddDialog}>
          Add Event
        </Button>
      </Box>
      
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          onEdit={handleOpenEditDialog}
        />
      ))}

      <AddEventDialog 
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
      />

      {selectedEvent && (
        <EditEventDialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          event={selectedEvent}
        />
      )}
    </Box>
  );
}; 