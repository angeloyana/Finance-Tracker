import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import dayjs, { type Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

import AddTransaction from '@/components/Transactions/AddTransaction';
import TransactionsList from '@/components/Transactions/TransactionsList';
import UpdateTransaction from '@/components/Transactions/UpdateTransaction';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  getTransactionsDateRange,
  updateTransaction,
} from '@/services/db';
import type { DateRange, EntryType } from '@/types/common';
import type { Transaction } from '@/types/transactions';

import DateFilterDialog from './components/DateFilterDialog';
import SearchBar from './components/SearchBar';
import TransactionsFAB from './components/TransactionsFAB';
import TypeFilterDialog from './components/TypeFilterDialog';

type Filters = {
  type: EntryType | null;
  note: string;
  createdAt: Dayjs | null;
};

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    min: null,
    max: dayjs(),
  });
  const [filters, setFilters] = useState<Filters>({
    type: null,
    note: '',
    createdAt: dateRange.max,
  });
  const [typeFilterDialogOpen, setTypeFilterDialogOpen] = useState(false);
  const [dateFilterDialogOpen, setDateFilterDialogOpen] = useState(false);

  useEffect(() => {
    getTransactionsDateRange()
      .then((range) => {
        setDateRange(range);
        setFilters((prev) => ({ ...prev, createdAt: range.max }));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const where = {
      type: filters.type ?? undefined,
      note: filters.note || undefined,
      createdAt: filters.createdAt ?? undefined,
    };

    getTransactions({ desc: true, where })
      .then((result) => {
        setTransactions(result);
      })
      .catch((err) => console.error(err));
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      note: value,
      createdAt: value ? null : dateRange.max,
    }));
  };

  const handleAddTransaction = async (data: AddTransactionData) => {
    const id = await addTransaction(data);
    const transaction = (await getTransaction(id))!;
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleUpdateTransaction = async (data: UpdateTransactionData, original: Transaction) => {
    await updateTransaction(original.id, data);
    const updatedTransaction = (await getTransaction(original.id))!;
    setTransactions((prev) =>
      prev.map((tx) => (tx.id !== updatedTransaction.id ? tx : updatedTransaction))
    );
  };

  const handleDeleteTransaction = async (original: Transaction) => {
    await deleteTransaction(original.id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== original.id));
  };

  return (
    <>
      <SearchBar
        value={filters.note}
        onChange={debounce(handleSearch, 350)}
        onClear={() => handleSearch('')}
      />
      <Toolbar />
      <Box sx={{ p: 2, pb: 0, display: 'flex', gap: 2, overflowX: 'auto' }}>
        <Chip
          label={filters.type ?? 'Type'}
          icon={<ArrowDropDownIcon />}
          onClick={() => setTypeFilterDialogOpen(true)}
          sx={{ textTransform: 'capitalize', borderRadius: 1 }}
        />
        <Chip
          label={filters.createdAt ? filters.createdAt.format('YYYY/MM/DD') : 'Date'}
          icon={<ArrowDropDownIcon />}
          onClick={() => setDateFilterDialogOpen(true)}
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <TransactionsList
        title="Transactions"
        transactions={transactions}
        onClickTransaction={(tx) => setTransactionToUpdate(tx)}
      />
      <TransactionsFAB onClick={() => setAddDialogOpen(true)} />
      <AddTransaction
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddTransaction}
      />
      <UpdateTransaction
        transaction={transactionToUpdate}
        open={!!transactionToUpdate}
        onClose={() => setTransactionToUpdate(null)}
        onDelete={handleDeleteTransaction}
        onSubmit={handleUpdateTransaction}
      />
      <TypeFilterDialog
        open={typeFilterDialogOpen}
        value={filters.type}
        onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
        onClose={() => setTypeFilterDialogOpen(false)}
      />
      <DateFilterDialog
        open={dateFilterDialogOpen}
        value={filters.createdAt}
        dateRange={dateRange}
        onChange={(value) => setFilters((prev) => ({ ...prev, note: '', createdAt: value }))}
        onClose={() => setDateFilterDialogOpen(false)}
      />
    </>
  );
}

export default Transactions;
