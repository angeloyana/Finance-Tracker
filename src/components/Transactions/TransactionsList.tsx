import Box from '@mui/material/Box';
import { green, red } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

import TypeAvatar from '@/components/TypeAvatar';
import type { Transaction } from '@/types/transactions';
import { formatCurrency, formatDate } from '@/utils';

type Props = {
  title?: string;
  transactions: Transaction[];
  onClickTransaction: (transaction: Transaction) => void;
};

function TransactionsList({ title, transactions, onClickTransaction }: Props) {
  return (
    <List subheader={title ? <ListSubheader>{title}</ListSubheader> : undefined}>
      {transactions.map((transaction, index) => {
        const { id, type, note, amount, createdAt, category } = transaction;

        return (
          <ListItem key={id} divider={index < transactions.length - 1} disablePadding>
            <ListItemButton onClick={() => onClickTransaction(transaction)}>
              <ListItemAvatar>
                <TypeAvatar type={type} />
              </ListItemAvatar>
              <ListItemText
                primary={category || 'No category'}
                secondary={note || 'No additional note'}
              />
              <Box textAlign="right">
                <Typography variant="body1" color={type === 'expense' ? red[500] : green[500]}>
                  {(type === 'expense' ? '- ' : '+ ') + formatCurrency(amount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(createdAt)}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default TransactionsList;
