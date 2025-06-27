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
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { type AddTransactionData, addTransactionSchema } from '@/schemas/transactions';
import { getCategories } from '@/services/db';
import type { CategoryWithoutTotal } from '@/types/categories';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddTransactionData) => void | Promise<void>;
};

function AddTransaction({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: 'expense',
      categoryId: null,
    },
  });
  const type = watch('type');

  const [categories, setCategories] = useState<CategoryWithoutTotal[]>([]);
  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [type, categories]
  );

  useEffect(() => {
    (async () => {
      setCategories(await getCategories({ select: ['type', 'name'] }));
    })();
  }, []);

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
            Add Transaction
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
              onChange={(e) => {
                setValue('categoryId', null);
                field.onChange(e);
              }}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Category"
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {filteredCategories.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Note"
          error={!!errors.note}
          helperText={errors.note?.message}
          {...register('note')}
        />
        <TextField
          type="number"
          label="Amount"
          error={!!errors.amount}
          helperText={errors.amount?.message}
          slotProps={{
            htmlInput: { step: 0.01 },
          }}
          {...register('amount', { valueAsNumber: true })}
        />
      </Box>
    </Dialog>
  );
}

export default AddTransaction;
