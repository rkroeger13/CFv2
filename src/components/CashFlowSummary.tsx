import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface SummaryItemProps {
  label: string;
  value: number;
  yearEnd?: number;
  showInfo?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, yearEnd, showInfo = true }) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {label}
      {showInfo && <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />}
    </Typography>
    <Typography variant="h5" sx={{ mb: 0.5 }}>${value.toLocaleString()}</Typography>
    {yearEnd && (
      <Typography variant="caption" color="text.secondary">
        Year End ${yearEnd.toLocaleString()}
      </Typography>
    )}
  </Box>
);

interface CashFlowSummaryProps {
  totalBalance: number;
  totalEarmarked: number;
  totalInflows: number;
  totalOutflows: number;
  surplusDeficit: number;
}

export const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({
  totalBalance,
  totalEarmarked,
  totalInflows,
  totalOutflows,
  surplusDeficit
}) => {
  return (
    <Paper sx={{ mb: 3 }}>
      <Grid container>
        <Grid item xs={12} sm={2.4}>
          <SummaryItem 
            label="Total Balances from Cash Accounts" 
            value={totalBalance}
            yearEnd={140999}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <SummaryItem 
            label="Total Earmarked for Events" 
            value={totalEarmarked}
            yearEnd={100999}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <SummaryItem 
            label="Total Inflows" 
            value={totalInflows}
            yearEnd={40999}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <SummaryItem 
            label="Total Outflows" 
            value={totalOutflows}
            yearEnd={30999}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <SummaryItem 
            label="Surplus/Deficit" 
            value={surplusDeficit}
            yearEnd={20999}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}; 