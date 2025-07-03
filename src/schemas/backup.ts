import { z } from 'zod';

import categoryIcons, { type CategoryIcons } from '@/data/categoryIcons';

export const backupSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number(),
      type: z.enum(['expense', 'income']),
      name: z.string(),
      color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color'),
      icon: z.enum(Object.keys(categoryIcons) as [CategoryIcons, ...Array<CategoryIcons>]),
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
