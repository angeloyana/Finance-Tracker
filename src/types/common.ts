export type EntryType = 'expense' | 'income';

export type DBSelect<T> = Array<Exclude<keyof T, 'id'>>;

export type DBResult<T extends { id: number }, U extends DBSelect<T>> = Pick<T, 'id' | U[number]>;
