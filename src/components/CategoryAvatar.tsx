import Avatar from '@mui/material/Avatar';

import categoryIcons, { type CategoryIcons } from '@/data/categoryIcons';

type Props = {
  color: string | null;
  icon: CategoryIcons | null;
};

function CategoryAvatar({ icon, color }: Props) {
  const Icon = categoryIcons[icon ?? 'Attach Money'];

  return (
    <Avatar sx={{ bgcolor: color ?? undefined }}>
      <Icon />
    </Avatar>
  );
}

export default CategoryAvatar;
