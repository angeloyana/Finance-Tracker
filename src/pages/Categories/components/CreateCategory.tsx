import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MuiColorInput } from 'mui-color-input';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import IconPicker from '@/components/IconPicker';
import { type CreateCategoryData, createCategorySchema } from '@/schemas/categories';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryData) => void | Promise<void>;
};

function CreateCategory({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      type: 'expense',
      color: '#1976D2',
      icon: 'Attach Money',
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open]);

  return (
    <Dialog
      fullScreen
      open={open}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(async (data) => {
            await onSubmit(data);
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
            Create Category
          </Typography>
          <IconButton type="submit" edge="end" aria-label="save" color="inherit">
            <SaveIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Type"
              error={!!errors.type}
              helperText={errors.type?.message}
              {...field}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>
          )}
        />
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

export default CreateCategory;
