import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MuiColorInput } from 'mui-color-input';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import IconPicker from '@/components/IconPicker';
import { type UpdateCategoryData, updateCategorySchema } from '@/schemas/categories';
import type { Category } from '@/types/categories';

type Props = {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onDelete: (original: Category) => void | Promise<void>;
  onSubmit: (data: UpdateCategoryData, original: Category) => void | Promise<void>;
};

function UpdateCategory({ category, open, onClose, onDelete, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(updateCategorySchema),
  });

  useEffect(() => {
    if (open && category)
      reset({
        name: category.name,
        color: category.color,
        icon: category.icon,
      });
  }, [open]);

  const handleDelete = async () => {
    await onDelete(category!);
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(async (data) => {
            await onSubmit(data, category!);
            onClose();
          }),
        },
      }}
      onClose={onClose}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" aria-label="close" onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" flexGrow={1}>
            Update Category
          </Typography>
          <IconButton aria-label="delete" onClick={handleDelete} color="inherit">
            <DeleteIcon />
          </IconButton>
          <IconButton
            type="submit"
            disabled={!isDirty}
            edge="end"
            aria-label="save"
            color="inherit"
          >
            <SaveIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
        <TextField
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <MuiColorInput
              label="Color"
              format="hex"
              isAlphaHidden={true}
              fallbackValue="#1976D2"
              error={!!errors.color}
              helperText={errors.color?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="icon"
          control={control}
          render={({ field }) => <IconPicker label="Icon" {...field} />}
        />
      </Box>
    </Dialog>
  );
}

export default UpdateCategory;
