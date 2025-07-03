import { z } from 'zod';

import categoryIcons, { type CategoryIcons } from '@/data/categoryIcons';

export const createCategorySchema = z.object({
  type: z.enum(['expense', 'income']),
  name: z.string(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color'),
  icon: z.enum(Object.keys(categoryIcons) as [CategoryIcons, ...Array<CategoryIcons>]),
});

export const updateCategorySchema = createCategorySchema.omit({ type: true });

export type CreateCategoryData = z.infer<typeof createCategorySchema>;

export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
