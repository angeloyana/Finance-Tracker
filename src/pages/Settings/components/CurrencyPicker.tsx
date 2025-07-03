import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';

import currencies, { type CurrencyCodes } from '@/data/currencies';

type Props = {
  open: boolean;
  value: CurrencyCodes;
  onClose: () => void;
  onChange: (value: CurrencyCodes) => Promise<void> | void;
};

function CurrencyPicker({ open, value, onClose, onChange }: Props) {
  const [internalValue, setInternalValue] = useState<CurrencyCodes>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value as CurrencyCodes);
  };

  const handleAccept = () => {
    onChange(internalValue);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%' } }}>
      <DialogTitle>Select Currency</DialogTitle>
      <DialogContent dividers>
        <RadioGroup aria-label="currency" value={internalValue} onChange={handleChange}>
          {Object.entries(currencies).map(([code, value]) => (
            <FormControlLabel key={code} label={value.name} value={code} control={<Radio />} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleAccept}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CurrencyPicker;
