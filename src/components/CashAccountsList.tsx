import React from 'react';
import { Box, Paper, Typography, Button, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { CashAccount } from '../types';
import { AddCashAccountDialog } from './AddCashAccountDialog';
import { EditCashAccountDialog } from './EditCashAccountDialog';

interface AccountCardProps {
  account: CashAccount;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleOpenEditDialog = () => setIsEditDialogOpen(true);
  const handleCloseEditDialog = () => setIsEditDialogOpen(false);

  return (
    <>
      <Paper sx={{ mb: 2, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">{account.name}</Typography>
            <Box 
              component="img" 
              src={account.owner.avatar} 
              sx={{ width: 24, height: 24, borderRadius: '50%', ml: 1 }}
              alt={account.owner.name}
            />
          </Box>
          <IconButton size="small" onClick={handleOpenEditDialog}>
            <EditIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="body2" color="text.secondary">Current Balance</Typography>
            <Typography variant="h6">${account.currentBalance.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">
              Year End ${account.yearEndProjected.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="text.secondary">Current Inflows</Typography>
            <Typography variant="h6">${account.currentInflows.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">
              Year End ${account.yearEndProjected.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="text.secondary">Current Outflows</Typography>
            <Typography variant="h6">${account.currentOutflows.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">
              Year End ${account.yearEndProjected.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="text.secondary">Surplus/Deficit</Typography>
            <Typography variant="h6">${account.surplusDeficit.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">
              Year End ${account.yearEndProjected.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <EditCashAccountDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        account={account}
      />
    </>
  );
};

export const CashAccountsList: React.FC = () => {
  const { accounts } = useCashFlowStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Cash Accounts</Typography>
        <Button variant="outlined" onClick={handleOpenAddDialog}>
          Add Cash Account
        </Button>
      </Box>
      
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}

      <AddCashAccountDialog 
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
      />
    </Box>
  );
}; 