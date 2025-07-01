import { z } from 'zod';

export const backupSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number(),
      type: z.enum(['expense', 'income']),
      name: z.string(),
    })
  ),
  transactions: z.array(
    z.object({
      id: z.number(),
      type: z.enum(['expense', 'income']),
      note: z.string().nullable(),
      amount: z.number(),
      category_id: z.number().nullable(),
      created_at: z.number(),
    })
  ),
});

export type BackupData = z.infer<typeof backupSchema>;
