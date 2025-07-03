import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useEffect, useState } from 'react';

import categoryIcons, { type CategoryIcons } from '@/data/categoryIcons';

type IconPickerValue = CategoryIcons | null;

type Props = {
  label: string;
  value: IconPickerValue;
  onChange: (value: IconPickerValue) => void;
};

function IconPicker({ label, value, onChange }: Props) {
  const labelId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IconPickerValue>(value);

  useEffect(() => {
    if (value !== selected) {
      setSelected(value);
    }
  }, [value]);

  const handleOpen = () => {
    if (!value) setSelected(null);
    setOpen(true);
  };

  const handleAccept = () => {
    onChange(selected);
    setOpen(false);
  };

  return (
    <>
      <FormControl>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select labelId={labelId} label={label} value={value ?? ''} onClick={handleOpen} readOnly>
          {Object.keys(categoryIcons).map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Dialog open={open}>
        <DialogTitle>Select Icon</DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
          }}
        >
          {Object.entries(categoryIcons).map(([name, Icon]) => (
            <Box
              onClick={() => setSelected(name as CategoryIcons)}
              sx={{
                p: 2,
                bgcolor: (theme) =>
                  selected === name ? alpha(theme.palette.primary.main, 0.2) : undefined,
                border: 1,
                borderColor: selected === name ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Icon />
              <Typography variant="caption" component="div">
                {name}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAccept}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default IconPicker;
