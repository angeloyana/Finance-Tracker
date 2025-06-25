import { z } from 'zod';

export const addTransactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  note: z.string().nullable(),
  amount: z.number().positive(),
  categoryId: z.number().nullable(),
});

export const updateTransactionSchema = addTransactionSchema;

export type AddTransactionData = z.infer<typeof addTransactionSchema>;

export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;
