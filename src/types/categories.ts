import type { CategoryIcons } from '@/data/categoryIcons';
import type { EntryType } from '@/types/common';

export type Category = {
  id: number;
  type: EntryType;
  name: string;
  color: string;
  icon: CategoryIcons;
  total: number;
};

export type CategoryAsOption = Omit<Category, 'color' | 'icon' | 'total'>;
