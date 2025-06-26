import { z } from 'zod';

export const createCategorySchema = z.object({
  type: z.enum(['expense', 'income']),
  name: z.string(),
});

export const updateCategorySchema = createCategorySchema.omit({ type: true });

export type CreateCategoryData = z.infer<typeof createCategorySchema>;

export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
