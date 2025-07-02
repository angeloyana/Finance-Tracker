import type { capSQLiteVersionUpgrade } from '@capacitor-community/sqlite';

export const upgrades: capSQLiteVersionUpgrade[] = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS categories (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
         CONSTRAINT UQ_Categories_Name_Type UNIQUE(name, type)
       )`,
      `CREATE TABLE IF NOT EXISTS transactions (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         note TEXT,
         amount REAL NOT NULL,
         category_id INTEGER,
         type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
         created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
         FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
       )`,
    ],
  },
];
