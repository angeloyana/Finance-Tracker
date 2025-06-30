import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import type { DateRange } from '@/types/common';

type DateFilterValue = Dayjs | null;

type Props = {
  open: boolean;
  value: DateFilterValue;
  dateRange: DateRange;
  onClose: () => void;
  onChange: (value: DateFilterValue) => void;
};

function DateFilterDialog({ open, value, dateRange, onClose, onChange }: Props) {
  const [internalValue, setInternalValue] = useState<DateFilterValue>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleApply = () => {
    onChange(internalValue);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Date</DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={internalValue}
            minDate={dateRange.min ?? undefined}
            maxDate={dateRange.max ?? undefined}
            onChange={(value) => setInternalValue(value)}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DateFilterDialog;
