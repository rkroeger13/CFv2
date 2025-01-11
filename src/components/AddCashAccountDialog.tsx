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
  Typography
} from '@mui/material';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { CashAccount } from '../types';

interface AddCashAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddCashAccountDialog: React.FC<AddCashAccountDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = React.useState<Partial<CashAccount>>({
    type: 'checking',
    currentBalance: 0,
    currentInflows: 0,
    currentOutflows: 0,
    yearEndProjected: 0,
    owner: {
      name: 'Colin Overcash'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add validation
    const newAccount: CashAccount = {
      id: crypto.randomUUID(),
      name: formData.name || '',
      type: formData.type || 'checking',
      accountNumber: formData.accountNumber || '',
      currentBalance: formData.currentBalance || 0,
      currentInflows: formData.currentInflows || 0,
      currentOutflows: formData.currentOutflows || 0,
      surplusDeficit: (formData.currentInflows || 0) - (formData.currentOutflows || 0),
      yearEndProjected: formData.yearEndProjected || 0,
      owner: {
        name: formData.owner?.name || 'Colin Overcash'
      }
    };

    useCashFlowStore.getState().setAccounts([
      ...useCashFlowStore.getState().accounts,
      newAccount
    ]);
    
    onClose();
  };

  const handleChange = (field: keyof CashAccount) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Cash Account</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account Name"
              required
              value={formData.name || ''}
              onChange={handleChange('name')}
            />
            
            <TextField
              select
              label="Account Type"
              required
              value={formData.type || 'checking'}
              onChange={handleChange('type')}
            >
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
            </TextField>

            <TextField
              label="Account Number"
              required
              value={formData.accountNumber || ''}
              onChange={handleChange('accountNumber')}
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
              Initial Balances
            </Typography>

            <TextField
              type="number"
              label="Current Balance"
              required
              value={formData.currentBalance || ''}
              onChange={handleChange('currentBalance')}
            />

            <TextField
              type="number"
              label="Current Inflows"
              required
              value={formData.currentInflows || ''}
              onChange={handleChange('currentInflows')}
            />

            <TextField
              type="number"
              label="Current Outflows"
              required
              value={formData.currentOutflows || ''}
              onChange={handleChange('currentOutflows')}
            />

            <TextField
              type="number"
              label="Year End Projected"
              required
              value={formData.yearEndProjected || ''}
              onChange={handleChange('yearEndProjected')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add Account</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 