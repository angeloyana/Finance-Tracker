import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

import MenuItemSelect from '@/components/MenuItemSelect';
import { getCategoriesTotals } from '@/lib/db';
import type { CategoriesTotals } from '@/types/analytics';
import type { DateRangePreset, EntryType, StrictDateRange } from '@/types/common';
import { formatCurrency } from '@/utils';
import { getDateRange } from '@/utils';

const typeOptions = [
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
] as const;

const dateRangeOptions = [
  'This Month',
  'Last Month',
  'Last 28 days',
  'Last 60 days',
  'Last 90 days',
] as const;

type ChartMenuProps = {
  onSelectType: (value: EntryType) => void;
  onSelectDateRange: (value: StrictDateRange) => void;
};

function ChartMenu({ onSelectType, onSelectDateRange }: ChartMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const [selectedType, setSelectedType] = useState<EntryType>('expense');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePreset>('This Month');

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleSelectType = (value: EntryType) => {
    if (selectedType !== value) {
      setSelectedType(value);
      onSelectType(value);
    }
  };

  const handleSelectDateRange = (value: DateRangePreset) => {
    if (selectedDateRange !== value) {
      setSelectedDateRange(value);
      onSelectDateRange(getDateRange(value));
    }
  };

  return (
    <>
      <IconButton aria-label="open menu" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {typeOptions.map(({ label, value }) => (
          <MenuItemSelect
            key={label}
            label={label}
            selected={selectedType === value}
            onClick={() => handleSelectType(value)}
          />
        ))}
        <Divider />
        {dateRangeOptions.map((option) => (
          <MenuItemSelect
            key={option}
            label={option}
            selected={selectedDateRange === option}
            onClick={() => handleSelectDateRange(option)}
          />
        ))}
      </Menu>
    </>
  );
}

function CategoriesTotalsChart() {
  const [data, setData] = useState<CategoriesTotals>([]);
  const [type, setType] = useState<EntryType>('expense');
  const [dateRange, setDateRange] = useState<StrictDateRange>(getDateRange('This Month'));

  useEffect(() => {
    getCategoriesTotals(type, dateRange)
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.error(err));
  }, [type, dateRange]);

  return (
    <Card variant="outlined">
      <Box sx={{ p: 2, pb: 0, display: 'flex' }}>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography variant="body2" color="text.secondary">
            Total {type === 'expense' ? 'Expenses' : 'Income'} by Category
          </Typography>
          <Typography variant="body1">
            {dateRange.start.format('MMMM DD, YYYY')} - {dateRange.end.format('MMMM DD, YYYY')}
          </Typography>
        </Box>
        <Box sx={{ mt: -0.5, mr: -1 }}>
          <ChartMenu
            onSelectType={(value) => setType(value)}
            onSelectDateRange={(value) => setDateRange(value)}
          />
        </Box>
      </Box>
      <CardContent>
        <PieChart
          series={[
            {
              data,
              innerRadius: 50,
              valueFormatter: ({ value }) => formatCurrency(value),
            },
          ]}
          sx={{ height: 170 }}
        />
      </CardContent>
    </Card>
  );
}

export default CategoriesTotalsChart;
