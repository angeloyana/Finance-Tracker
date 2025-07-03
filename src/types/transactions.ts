import type { Dayjs } from 'dayjs';

import type { CategoryIcons } from '@/data/categoryIcons';

import type { EntryType } from './common';

export type Transaction = {
  id: number;
  type: EntryType;
  note: string | null;
  amount: number;
  createdAt: Dayjs;
  categoryId: number | null;
  category: string | null;
  categoryColor: string | null;
  categoryIcon: CategoryIcons | null;
};
