import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import CategoryAvatar from '@/components/CategoryAvatar';
import type { Category } from '@/types/categories';
import { formatCurrency } from '@/utils';

type Props = {
  title?: string;
  categories: Category[];
  onClickCategory: (category: Category) => void;
};

function CategoriesList({ title, categories, onClickCategory }: Props) {
  return (
    <List subheader={title ? <ListSubheader>{title}</ListSubheader> : undefined}>
      {categories.map((category, index) => {
        const { id, name, color, icon, total } = category;

        return (
          <ListItem key={id} divider={index < categories.length - 1} disablePadding>
            <ListItemButton onClick={() => onClickCategory(category)}>
              <ListItemAvatar>
                <CategoryAvatar color={color} icon={icon} />
              </ListItemAvatar>
              <ListItemText primary={name} secondary={formatCurrency(total)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default CategoriesList;
