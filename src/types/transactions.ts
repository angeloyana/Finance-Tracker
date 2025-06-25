import type { EntryType } from './common';

export type Transaction = {
  id: number;
  type: EntryType;
  note: string | null;
  amount: number;
  createdAt: Date;
  categoryId: number | null;
  category: string | null;
};
