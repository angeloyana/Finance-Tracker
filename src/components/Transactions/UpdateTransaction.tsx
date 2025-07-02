import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getCategories } from '@/lib/db';
import { type UpdateTransactionData, updateTransactionSchema } from '@/schemas/transactions';
import type { CategoryWithoutTotal } from '@/types/categories';
import type { Transaction } from '@/types/transactions';

type Props = {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onDelete: (original: Transaction) => void | Promise<void>;
  onSubmit: (data: UpdateTransactionData, original: Transaction) => void | Promise<void>;
};

function UpdateTransaction({ transaction, open, onClose, onDelete, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(updateTransactionSchema),
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
    if (open && transaction) {
      reset({
        type: transaction.type,
        note: transaction.note,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        createdAt: transaction.createdAt,
      });
    }
  }, [open]);

  const handleDelete = async () => {
    await onDelete(transaction!);
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
            await onSubmit(data, transaction!);
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
            Update Transaction
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
        <Controller
          name="createdAt"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date"
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                {...field}
              />
            </LocalizationProvider>
          )}
        />
      </Box>
    </Dialog>
  );
}

export default UpdateTransaction;
