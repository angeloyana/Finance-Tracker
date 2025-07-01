import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import dayjs, { type Dayjs } from 'dayjs';

import { type BackupData, backupSchema } from '@/schemas/backup';
import type { CreateCategoryData, UpdateCategoryData } from '@/schemas/categories';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import type { Category } from '@/types/categories';
import type { Totals } from '@/types/common';
import type { DateRange, DBResult, DBSelect, EntryType } from '@/types/common';
import type { Transaction } from '@/types/transactions';

import { upgrades } from './upgrades';

const DB_NAME = 'app-db';
const VERSION = upgrades[upgrades.length - 1].toVersion;

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export async function initDatabase() {
  if (Capacitor.getPlatform() === 'web') {
    await sqlite.initWebStore();
  }

  await sqlite.addUpgradeStatement(DB_NAME, upgrades);
  db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', VERSION, false);

  await db.open();
}

export async function getTotals(): Promise<Totals> {
  const sql = `
  SELECT
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income
  FROM transactions`;
  const result = await db!.query(sql);
  const totals = result.values?.[0];

  if (!totals) return { expense: 0, income: 0 };
  return totals;
}

export async function createCategory(data: CreateCategoryData): Promise<number> {
  const sql = 'INSERT INTO categories (type, name) VALUES (?,?)';
  const result = await db!.run(sql, [data.type, data.name]);
  if (typeof result.changes?.lastId !== 'number') throw new Error('Insert category failed.');
  return result.changes.lastId;
}

export async function getCategories<T extends DBSelect<Category>>(options?: {
  select?: T;
  type?: EntryType;
}): Promise<DBResult<Category, T>[]> {
  const select =
    options?.select instanceof Array
      ? [...new Set(options.select)]
      : (['type', 'name', 'total'] as T);

  const columns = {
    type: 'c.type',
    name: 'c.name',
    total: 'COALESCE(SUM(t.amount), 0) AS total',
  };

  const hasTotal = select.includes('total');
  let sql = `SELECT c.id, ${select.map((c) => columns[c]).join(', ')} FROM categories AS c`;
  const params = [];

  if (hasTotal) sql += ' LEFT JOIN transactions AS t ON t.category_id = c.id';
  if (typeof options?.type === 'string') {
    sql += ' WHERE c.type = ?';
    params.push(options.type);
  }
  if (hasTotal) sql += ' GROUP BY c.id';

  const result = await db!.query(sql, params);
  return result.values as DBResult<Category, T>[];
}

export async function updateCategory(id: number, data: UpdateCategoryData): Promise<void> {
  const sql = 'UPDATE categories SET name = ? WHERE id = ?';
  await db!.run(sql, [data.name, id]);
}

export async function deleteCategory(id: number): Promise<void> {
  const sql = 'DELETE FROM categories WHERE id = ?';
  await db!.run(sql, [id]);
}

export async function addTransaction(data: AddTransactionData): Promise<number> {
  const { type, note, amount, categoryId, createdAt } = data;
  const sql =
    'INSERT INTO transactions (type, note, amount, category_id, created_at) VALUES (?,?,?,?,?)';
  const result = await db!.run(sql, [type, note, amount, categoryId, createdAt.unix()]);
  if (typeof result.changes?.lastId !== 'number') throw new Error('Insert category failed.');
  return result.changes.lastId;
}

export async function getTransaction<T extends DBSelect<Transaction>>(
  id: number,
  options?: {
    select?: T;
  }
): Promise<DBResult<Transaction, T> | null> {
  const select =
    options?.select instanceof Array
      ? [...new Set(options.select)]
      : (['type', 'note', 'amount', 'createdAt', 'categoryId', 'category'] as T);

  const columns = {
    type: 't.type',
    note: 't.note',
    amount: 't.amount',
    createdAt: 't.created_at * 1000 AS createdAt',
    categoryId: 'c.id AS categoryId',
    category: 'c.name AS category',
  };

  const sql = `
  SELECT
    t.id, ${select.map((c) => columns[c]).join(', ')}
  FROM transactions AS t
  LEFT JOIN categories AS c ON t.category_id = c.id
  WHERE t.id = ?`;

  const result = await db!.query(sql, [id]);
  const tx = result.values?.[0];
  if (!tx) return null;

  return {
    ...tx,
    createdAt: dayjs(tx.createdAt),
  } as DBResult<Transaction, T>;
}

export async function getTransactions<T extends DBSelect<Transaction>>(options?: {
  select?: T;
  desc?: boolean;
  limit?: number;
  where?: {
    type?: EntryType;
    note?: string;
    createdAt?: Dayjs;
  };
}): Promise<DBResult<Transaction, T>[]> {
  const select =
    options?.select instanceof Array
      ? [...new Set(options.select)]
      : (['type', 'note', 'amount', 'createdAt', 'categoryId', 'category'] as T);

  const columns = {
    type: 't.type',
    note: 't.note',
    amount: 't.amount',
    createdAt: 't.created_at * 1000 AS createdAt',
    categoryId: 'c.id AS categoryId',
    category: 'c.name AS category',
  };

  let sql = `
  SELECT
    t.id, ${select.map((c) => columns[c]).join(', ')}
  FROM transactions AS t
  LEFT JOIN categories AS c ON t.category_id = c.id`;
  const params = [];

  const typeFilter = options?.where?.type;
  const noteFilter = options?.where?.note;
  const createdAtFilter = options?.where?.createdAt;
  if (typeFilter || noteFilter || createdAtFilter) {
    sql += ' WHERE ';
    const filters: string[] = [];

    if (typeFilter) {
      filters.push('t.type = ?');
      params.push(typeFilter);
    }

    if (noteFilter) {
      filters.push('t.note LIKE ?');
      params.push(`%${noteFilter}%`);
    }

    if (createdAtFilter) {
      filters.push('t.created_at BETWEEN ? AND ?');
      params.push(createdAtFilter.startOf('day').unix());
      params.push(createdAtFilter.endOf('day').unix());
    }

    sql += filters.join(' AND ');
  }
  if (options?.desc) sql += ' ORDER BY createdAt DESC';
  if (typeof options?.limit === 'number') {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }

  const result = await db!.query(sql, params);
  return (result.values ?? []).map((tx) => ({
    ...tx,
    createdAt: dayjs(tx.createdAt),
  })) as DBResult<Transaction, T>[];
}

export async function getTransactionsDateRange(): Promise<DateRange> {
  const sql = 'SELECT MIN(created_at) AS min, MAX(created_at) AS max FROM transactions';
  const result = await db!.query(sql);
  const range = result.values?.[0];

  if (!range) return { min: null, max: null };
  return {
    min: range.min ? dayjs(range.min * 1000) : null,
    max: range.max ? dayjs(range.max * 1000) : null,
  };
}

export async function updateTransaction(id: number, data: UpdateTransactionData): Promise<void> {
  const { type, note, amount, categoryId, createdAt } = data;
  const sql =
    'UPDATE transactions SET type = ?, note = ?, amount = ?, category_id = ?, created_at = ? WHERE id = ?';
  await db!.run(sql, [type, note, amount, categoryId, createdAt.unix(), id]);
}

export async function deleteTransaction(id: number): Promise<void> {
  const sql = 'DELETE FROM transactions WHERE id = ?';
  await db!.run(sql, [id]);
}

export async function backupDatabase(): Promise<BackupData> {
  const [result1, result2] = await Promise.all([
    db!.query('SELECT * FROM categories'),
    db!.query('SELECT * FROM transactions'),
  ]);

  return {
    categories: result1.values,
    transactions: result2.values,
  } as BackupData;
}

export async function restoreDatabase(backupData: unknown): Promise<void> {
  const { categories, transactions } = backupSchema.parse(backupData);
  await db!.executeTransaction([
    ...categories.map(({ id, type, name }) => ({
      statement: 'INSERT INTO categories (id, type, name) VALUES (?,?,?)',
      values: [id, type, name],
    })),
    ...transactions.map(({ id, type, note, amount, category_id, created_at }) => ({
      statement:
        'INSERT INTO transactions (id, type, note, amount, category_id, created_at) VALUES (?,?,?,?,?,?)',
      values: [id, type, note, amount, category_id, created_at],
    })),
  ]);
}

export async function closeDatabase() {
  await sqlite.closeConnection(DB_NAME, false);
}
