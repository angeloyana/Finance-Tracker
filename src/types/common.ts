import type { Dayjs } from 'dayjs';

export type EntryType = 'expense' | 'income';

export type DateRange = {
  start: Dayjs | null;
  end: Dayjs | null;
};

export type StrictDateRange = {
  start: Dayjs;
  end: Dayjs;
};

export type Totals = {
  expense: number;
  income: number;
};

export type DateRangePreset =
  | 'This Month'
  | 'Last Month'
  | 'Last 28 days'
  | 'Last 60 days'
  | 'Last 90 days';

export type DBSelect<T> = Array<Exclude<keyof T, 'id'>>;

export type DBResult<T extends { id: number }, U extends DBSelect<T>> = Pick<T, 'id' | U[number]>;
