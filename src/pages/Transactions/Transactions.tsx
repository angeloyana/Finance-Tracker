import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import dayjs, { type Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

import SelectDialog from '@/components/SelectDialog';
import AddTransaction from '@/components/Transactions/AddTransaction';
import TransactionsList from '@/components/Transactions/TransactionsList';
import UpdateTransaction from '@/components/Transactions/UpdateTransaction';
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionsDateRange,
  updateTransaction,
} from '@/lib/db';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import type { DateRange, EntryType } from '@/types/common';
import type { Transaction } from '@/types/transactions';

import DateFilterDialog from './components/DateFilterDialog';
import SearchBar from './components/SearchBar';
import TransactionsFAB from './components/TransactionsFAB';

type Filters = {
  type: EntryType | null;
  note: string;
  createdAt: Dayjs | null;
};

const typeFilterOptions = [
  { label: 'Any', value: null },
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
] as const;

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: dayjs(),
  });
  const [filters, setFilters] = useState<Filters>({
    type: null,
    note: '',
    createdAt: dateRange.end,
  });
  const [typeFilterDialogOpen, setTypeFilterDialogOpen] = useState(false);
  const [dateFilterDialogOpen, setDateFilterDialogOpen] = useState(false);

  useEffect(() => {
    getTransactionsDateRange()
      .then((range) => {
        setDateRange(range);
        setFilters((prev) => ({ ...prev, createdAt: range.end }));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    const where = {
      type: filters.type ?? undefined,
      note: filters.note || undefined,
      createdAt: filters.createdAt ?? undefined,
    };

    const result = await getTransactions({ desc: true, where });
    setTransactions(result);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      note: value,
      createdAt: value ? null : dateRange.end,
    }));
  };

  const handleAddTransaction = async (data: AddTransactionData) => {
    await addTransaction(data);
    await loadTransactions();
  };

  const handleUpdateTransaction = async (data: UpdateTransactionData, original: Transaction) => {
    await updateTransaction(original.id, data);
    await loadTransactions();
  };

  const handleDeleteTransaction = async (original: Transaction) => {
    await deleteTransaction(original.id);
    await loadTransactions();
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
      <SelectDialog
        title="Select Type"
        open={typeFilterDialogOpen}
        value={filters.type}
        options={typeFilterOptions}
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
