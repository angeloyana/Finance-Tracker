import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

type Props = {
  onClick?: () => void;
};

function TransactionsFAB({ onClick }: Props) {
  return (
    <Fab
      aria-label="add transaction"
      onClick={onClick}
      color="primary"
      sx={{ position: 'fixed', bottom: 70, right: 20 }}
    >
      <AddIcon />
    </Fab>
  );
}

export default TransactionsFAB;
