import LocalMallIcon from '@mui/icons-material/LocalMall';
import SavingsIcon from '@mui/icons-material/Savings';
import Avatar from '@mui/material/Avatar';

import type { EntryType } from '@/types/common';

type Props = {
  type: EntryType;
};

function TypeAvatar({ type }: Props) {
  return <Avatar>{type === 'expense' ? <LocalMallIcon /> : <SavingsIcon />}</Avatar>;
}

export default TypeAvatar;
