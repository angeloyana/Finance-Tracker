import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Link } from 'react-router';

function AppBarMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <IconButton
        id="app-bar-menu-btn"
        aria-label="open menu"
        aria-controls={open ? 'app-bar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? true : undefined}
        edge="end"
        color="inherit"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="app-bar-menu"
        anchorEl={anchorEl}
        open={open}
        slotProps={{
          list: {
            'aria-labelledby': 'app-bar-menu-btn',
          },
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem component={Link} to="/settings">
          Settings
        </MenuItem>
      </Menu>
    </>
  );
}

export default AppBarMenu;
