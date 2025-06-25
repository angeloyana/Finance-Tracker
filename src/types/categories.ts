import type { EntryType } from '@/types/common';

export type Category = {
  id: number;
  type: EntryType;
  name: string;
  total: number;
};
