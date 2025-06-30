import type { Dayjs } from 'dayjs';

export type EntryType = 'expense' | 'income';

export type DateRange = {
  min: Dayjs | null;
  max: Dayjs | null;
};

export type Totals = {
  expense: number;
  income: number;
};

export type DBSelect<T> = Array<Exclude<keyof T, 'id'>>;

export type DBResult<T extends { id: number }, U extends DBSelect<T>> = Pick<T, 'id' | U[number]>;
