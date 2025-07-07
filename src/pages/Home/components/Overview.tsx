import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { green, red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';

import type { Totals } from '@/types/common';
import { formatCurrency } from '@/utils';

type Props = {
  totals: Totals;
};

function Overview({ totals }: Props) {
  return (
    <Box sx={{ p: 2, pb: 0 }}>
      <Card variant="outlined">
        <Box sx={{ p: 2, pb: 0, display: 'flex' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="body2" color="text.secondary">
              Overview
            </Typography>
            <Typography variant="body1">As of {dayjs().format('MMM DD, YYYY')}</Typography>
          </Box>
        </Box>
        <CardContent>
          <PieChart
            series={[
              {
                data: [
                  { label: 'Total Expense', color: red[500], value: totals.expense },
                  { label: 'Total Income', color: green[500], value: totals.income },
                ],
                innerRadius: 50,
                valueFormatter: ({ value }) => formatCurrency(value),
              },
            ]}
            sx={{ height: 170, mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" component="div">
              Total Income
            </Typography>
            <Typography variant="body2" component="div" color={green[500]}>
              {formatCurrency(totals.income)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" component="div">
              Total Expense
            </Typography>
            <Typography variant="body2" component="div" color={red[500]}>
              {formatCurrency(totals.expense)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" component="div">
              Balance
            </Typography>
            <Typography variant="body2" component="div">
              {formatCurrency(totals.income - totals.expense)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Overview;
