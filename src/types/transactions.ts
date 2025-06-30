import type { Dayjs } from 'dayjs';

import type { EntryType } from './common';

export type Transaction = {
  id: number;
  type: EntryType;
  note: string | null;
  amount: number;
  createdAt: Dayjs;
  categoryId: number | null;
  category: string | null;
};
