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
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { CashAccount } from '../types';

interface EditCashAccountDialogProps {
  open: boolean;
  onClose: () => void;
  account: CashAccount;
}

export const EditCashAccountDialog: React.FC<EditCashAccountDialogProps> = ({ 
  open, 
  onClose, 
  account 
}) => {
  const [formData, setFormData] = React.useState<CashAccount>(account);

  React.useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedAccount: CashAccount = {
      ...formData,
      surplusDeficit: formData.currentInflows - formData.currentOutflows
    };

    useCashFlowStore.getState().updateAccount(updatedAccount);
    onClose();
  };

  const handleChange = (field: keyof CashAccount) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      useCashFlowStore.getState().deleteAccount(account.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Cash Account
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account Name"
              required
              value={formData.name}
              onChange={handleChange('name')}
            />
            
            <TextField
              select
              label="Account Type"
              required
              value={formData.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
            </TextField>

            <TextField
              label="Account Number"
              required
              value={formData.accountNumber}
              onChange={handleChange('accountNumber')}
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
              Current Balances
            </Typography>

            <TextField
              type="number"
              label="Current Balance"
              required
              value={formData.currentBalance}
              onChange={handleChange('currentBalance')}
            />

            <TextField
              type="number"
              label="Current Inflows"
              required
              value={formData.currentInflows}
              onChange={handleChange('currentInflows')}
            />

            <TextField
              type="number"
              label="Current Outflows"
              required
              value={formData.currentOutflows}
              onChange={handleChange('currentOutflows')}
            />

            <TextField
              type="number"
              label="Year End Projected"
              required
              value={formData.yearEndProjected}
              onChange={handleChange('yearEndProjected')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete Account
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 