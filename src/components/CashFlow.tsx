import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CashFlowChart } from './CashFlowChart';
import { CashFlowSummary } from './CashFlowSummary';
import { CashAccountsList } from './CashAccountsList';
import { useCashFlowStore } from '../stores/cashFlowStore';

export const CashFlow: React.FC = () => {
  const { 
    totalBalance,
    totalEarmarked,
    totalInflows,
    totalOutflows,
    surplusDeficit
  } = useCashFlowStore();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Cash Flow</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <CashFlowChart />
      </Paper>

      <CashFlowSummary 
        totalBalance={totalBalance}
        totalEarmarked={totalEarmarked}
        totalInflows={totalInflows}
        totalOutflows={totalOutflows}
        surplusDeficit={surplusDeficit}
      />

      <CashAccountsList />
    </Box>
  );
}; 