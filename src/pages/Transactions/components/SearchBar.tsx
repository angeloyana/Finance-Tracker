import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

function SearchBar({ value, onChange, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalvalue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalvalue(value);
    }
  }, [value]);

  const handleClose = () => {
    setInternalvalue('');
    setOpen(false);
    onClear();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalvalue(newValue);
    onChange(newValue);
  };

  const handleClickTailBtn = () => {
    if (open) {
      setInternalvalue('');
      onClear();
    } else {
      setOpen(true);
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <AppBar>
      <Toolbar>
        {open ? (
          <>
            <IconButton
              aria-label="close search bar"
              edge="start"
              color="inherit"
              onClick={handleClose}
            >
              <ArrowBackIcon />
            </IconButton>
            <InputBase
              placeholder="Search..."
              value={internalValue}
              onChange={handleChange}
              inputProps={{ ref: inputRef }}
              sx={{ flexGrow: 1, px: 1, color: 'inherit' }}
            />
          </>
        ) : (
          <Typography variant="h6" component="div" mr="auto">
            Transactions
          </Typography>
        )}
        <IconButton
          aria-label={open ? 'clear search' : 'close search bar'}
          edge="end"
          color="inherit"
          onClick={handleClickTailBtn}
        >
          {open ? <ClearIcon /> : <SearchIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default SearchBar;
