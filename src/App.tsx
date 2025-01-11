import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { CashFlow } from './components/CashFlow';
import { useCashFlowStore } from './stores/cashFlowStore';

export const App: React.FC = () => {
  const { initializeStore, isLoading, error } = useCashFlowStore();

  React.useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return <CashFlow />;
}; 