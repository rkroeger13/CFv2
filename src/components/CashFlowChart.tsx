import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { format, parse } from 'date-fns';
import { useCashFlowStore } from '../stores/cashFlowStore';
import { Event } from '../types';

interface ChartDataPoint {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface ProjectedBalance {
  month: string;
  balance: number;
  events: Event[];
}

const calculateProjectedBalances = (
  startBalance: number,
  monthlyChange: number,
  events: Event[],
  months: number
): ProjectedBalance[] => {
  const balances: ProjectedBalance[] = [];
  let currentBalance = startBalance;

  for (let i = 0; i < months; i++) {
    const date = new Date(2024, i, 1);
    const month = format(date, 'MMM');
    const monthEvents = events.filter(event => {
      const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
      return format(eventDate, 'MMM') === month;
    });

    // Apply monthly change
    currentBalance += monthlyChange;

    // Apply event impacts
    const eventImpact = monthEvents.reduce((sum, event) => sum - event.amount, 0);
    currentBalance += eventImpact;

    balances.push({
      month,
      balance: currentBalance,
      events: monthEvents
    });
  }

  return balances;
};

const generateProjectedData = (
  startBalance: number,
  monthlyChange: number,
  months: number,
  events: Event[]
): ChartDataPoint['data'] => {
  const projectedBalances = calculateProjectedBalances(startBalance, monthlyChange, events, months);
  return projectedBalances.map(({ month, balance }) => ({
    x: month,
    y: Math.max(0, balance) // Ensure we don't show negative balances
  }));
};

export const CashFlowChart: React.FC = () => {
  const theme = useTheme();
  const { events, accounts } = useCashFlowStore();

  // Calculate total monthly inflows and outflows
  const totalMonthlyInflow = accounts.reduce((sum, account) => sum + account.currentInflows, 0);
  const totalMonthlyOutflow = accounts.reduce((sum, account) => sum + account.currentOutflows, 0);
  const netMonthlyChange = totalMonthlyInflow - totalMonthlyOutflow;

  const chartData: ChartDataPoint[] = [
    {
      id: "Ally Checking",
      data: generateProjectedData(65000, -2000, 12, events.filter(e => e.type === 'Emergency Savings'))
    },
    {
      id: "Chase Checking",
      data: generateProjectedData(45000, -1000, 12, events.filter(e => e.type === 'Sabbatical'))
    },
    {
      id: "Chase Savings",
      data: generateProjectedData(35000, 500, 12, events.filter(e => e.type === 'Vacation'))
    },
    {
      id: "Projected Total",
      data: generateProjectedData(
        accounts.reduce((sum, account) => sum + account.currentBalance, 0),
        netMonthlyChange,
        12,
        events
      )
    }
  ];

  // Enhanced tooltip to show event impacts
  const CustomTooltip = ({ point }: any) => {
    const month = point.data.x;
    const monthEvents = events.filter(event => {
      const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
      return format(eventDate, 'MMM') === month;
    });

    return (
      <Box
        sx={{
          background: theme.palette.background.paper,
          padding: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          minWidth: 200
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {point.serieId}: ${point.data.y.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {month}
        </Typography>
        
        {monthEvents.length > 0 && (
          <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary">
              Events this month:
            </Typography>
            {monthEvents.map(event => (
              <Box key={event.id} sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{event.name}</span>
                  <span style={{ color: theme.palette.error.main }}>
                    -${event.amount.toLocaleString()}
                  </span>
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Events</Typography>
        <Box>
          {events.map(event => (
            <Chip 
              key={event.id}
              label={event.type} 
              sx={{ mr: 1 }} 
              color={
                event.type === 'Emergency Savings' ? 'default' :
                event.type === 'Sabbatical' ? 'primary' : 'secondary'
              }
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ 
          type: 'linear', 
          min: 0, 
          max: 'auto' 
        }}
        curve="monotoneX"
        enablePoints={true}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        enableGridX={false}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        colors={{ scheme: 'category10' }}
        lineWidth={2}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: value => `$${(value as number).toLocaleString()}`
        }}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 140,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: theme.palette.text.secondary,
                fontSize: 12
              }
            }
          },
          grid: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 1
            }
          },
          legends: {
            text: {
              fill: theme.palette.text.primary,
              fontSize: 12
            }
          }
        }}
        tooltip={({ point }) => <CustomTooltip point={point} />}
        layers={[
          'grid',
          'markers',
          'axes',
          'areas',
          'crosshair',
          'lines',
          'points',
          'slices',
          'mesh',
          'legends'
        ]}
      />
    </Box>
  );
}; 