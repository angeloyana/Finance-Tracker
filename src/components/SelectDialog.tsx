import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';

type Props<T> = {
  title: string;
  open: boolean;
  value: T;
  options: Readonly<{ label: string; value: T }[]>;
  onChange?: (value: T) => void;
  onClose?: () => void;
};

function SelectDialog<T>({ title, open, value, options, onChange, onClose }: Props<T>) {
  const [selected, setSelected] = useState<T>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected((e.target.value || null) as T);
  };

  const handleCancel = () => {
    setSelected(value);
    onClose?.();
  };

  const handleAccept = () => {
    onChange?.(selected);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '80%' } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <RadioGroup value={selected ?? ''} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.label}
              label={option.label}
              value={option.value ?? ''}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleAccept}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SelectDialog;
