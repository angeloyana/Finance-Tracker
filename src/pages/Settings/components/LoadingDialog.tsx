import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

type Props = {
  title: string;
  message: string;
  open: boolean;
};

function LoadingDialog({ title, message, open }: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <div>
          <CircularProgress />
        </div>
        {message}
      </DialogContent>
    </Dialog>
  );
}

export default LoadingDialog;
