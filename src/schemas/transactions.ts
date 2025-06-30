import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';

export const addTransactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  note: z.string().nullable(),
  amount: z.number().positive(),
  categoryId: z.number().nullable(),
  createdAt: z.custom<Dayjs>((data) => dayjs.isDayjs(data), 'Invalid date'),
});

export const updateTransactionSchema = addTransactionSchema;

export type AddTransactionData = z.infer<typeof addTransactionSchema>;

export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;
