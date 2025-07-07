import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { green, red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import MenuItemSelect from '@/components/MenuItemSelect';
import { getExpensesVsIncome } from '@/lib/db';
import type { ExpensesVsIncome } from '@/types/analytics';
import { formatCurrency } from '@/utils';

const limitOptions = [3, 6, 9, 12] as const;

type Limit = (typeof limitOptions)[number];

type ChartMenuProps = {
  value: Limit;
  onSelect: (value: Limit) => void;
};

function ChartMenu({ value, onSelect }: ChartMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleSelect = (v: Limit) => {
    if (value !== v) {
      onSelect(v);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <IconButton aria-label="open menu" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {limitOptions.map((option) => (
          <MenuItemSelect
            key={option}
            label={`Last ${option} months`}
            selected={value === option}
            onClick={() => handleSelect(option)}
          />
        ))}
      </Menu>
    </>
  );
}

function ExpensesVsIncomeChart() {
  const [dataset, setDataset] = useState<ExpensesVsIncome>([]);
  const [limit, setLimit] = useState<Limit>(3);

  useEffect(() => {
    getExpensesVsIncome(limit)
      .then((result) => setDataset(result))
      .catch((err) => console.error(err));
  }, [limit]);

  return (
    <Card variant="outlined">
      <Box sx={{ p: 2, pb: 0, display: 'flex' }}>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="body2" color="text.secondary">
            Expenses vs Income
          </Typography>
          <Typography variant="body1">Last {limit} months</Typography>
        </Box>
        <Box sx={{ mt: -0.5, mr: -1 }}>
          <ChartMenu value={limit} onSelect={setLimit} />
        </Box>
      </Box>
      <CardContent>
        <BarChart
          dataset={dataset}
          series={[
            {
              dataKey: 'income',
              valueFormatter: (value) => formatCurrency(value ?? 0),
              color: green[500],
            },
            {
              dataKey: 'expenses',
              valueFormatter: (value) => formatCurrency(value ?? 0),
              color: red[500],
            },
          ]}
          xAxis={[
            {
              dataKey: 'month',
              scaleType: 'band',
              valueFormatter: (value, context) =>
                dayjs(value).format(context.location === 'tick' ? 'MMM' : 'MMMM, YYYY'),
            },
          ]}
          yAxis={[
            {
              scaleType: 'linear',
              valueFormatter: (value) => formatCurrency(value),
            },
          ]}
          grid={{ horizontal: true }}
          margin={{ left: 0, right: 0 }}
          sx={{ height: 220 }}
        />
      </CardContent>
    </Card>
  );
}

export default ExpensesVsIncomeChart;
