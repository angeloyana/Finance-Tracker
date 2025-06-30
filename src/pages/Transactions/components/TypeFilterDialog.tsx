import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';

import type { EntryType } from '@/types/common';

type TypeFilterValue = EntryType | null;

type Options = Array<{
  label: string;
  value: TypeFilterValue;
}>;

type Props = {
  open: boolean;
  value: TypeFilterValue;
  onClose: () => void;
  onChange: (value: TypeFilterValue) => void;
};

function TypeFilterDialog({ open, value, onClose, onChange }: Props) {
  const options: Options = [
    { label: 'Any', value: null },
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' },
  ];
  const [internalValue, setInternalValue] = useState<TypeFilterValue>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue((e.target.value || null) as TypeFilterValue);
  };

  const handleApply = () => {
    onChange(internalValue);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%' } }}>
      <DialogTitle>Select Type</DialogTitle>
      <DialogContent dividers>
        <RadioGroup aria-label="type" value={internalValue ?? ''} onChange={handleChange}>
          {options.map(({ label, value }) => (
            <FormControlLabel key={label} label={label} value={value ?? ''} control={<Radio />} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TypeFilterDialog;
