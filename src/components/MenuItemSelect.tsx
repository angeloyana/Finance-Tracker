import CheckIcon from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';

type Props = {
  label: string;
  selected: boolean;
} & MenuItemProps;

function MenuItemSelect({ label, selected, ...rest }: Props) {
  return (
    <MenuItem {...rest}>
      {selected ? (
        <>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          {label}
        </>
      ) : (
        <ListItemText inset>{label}</ListItemText>
      )}
    </MenuItem>
  );
}

export default MenuItemSelect;
