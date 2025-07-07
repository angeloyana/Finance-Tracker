import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import AddTransaction from '@/components/Transactions/AddTransaction';
import TransactionsList from '@/components/Transactions/TransactionsList';
import UpdateTransaction from '@/components/Transactions/UpdateTransaction';
import {
  addTransaction,
  deleteTransaction,
  getTotals,
  getTransactions,
  updateTransaction,
} from '@/lib/db';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import type { Totals } from '@/types/common';
import type { Transaction } from '@/types/transactions';

import AppBarMenu from './components/AppBarMenu';
import HomeFAB from './components/HomeFAB';
import Overview from './components/Overview';

function Home() {
  const [totals, setTotals] = useState<Totals>({
    expense: 0,
    income: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  useEffect(() => {
    Promise.all([getTotals(), loadTransactions()]).then(([result]) => {
      setTotals(result);
    });
  }, []);

  const loadTransactions = async () => {
    setTransactions(await getTransactions({ limit: 5, desc: true }));
  };

  const handleAddTransaction = async (data: AddTransactionData) => {
    await addTransaction(data);
    await loadTransactions();

    setTotals((prev) => ({
      ...prev,
      [data.type]: prev[data.type] + data.amount,
    }));
  };

  const handleUpdateTransaction = async (data: UpdateTransactionData, original: Transaction) => {
    await updateTransaction(original.id, data);
    await loadTransactions();

    if (data.type !== original.type) {
      setTotals((prev) => ({
        ...prev,
        [original.type]: prev[original.type] - original.amount,
        [data.type]: prev[data.type] + data.amount,
      }));
    } else if (data.amount !== original.amount) {
      setTotals((prev) => ({
        ...prev,
        [original.type]: prev[original.type] - original.amount + data.amount,
      }));
    }
  };

  const handleDeleteTransaction = async (original: Transaction) => {
    await deleteTransaction(original.id);
    await loadTransactions();

    setTotals((prev) => ({
      ...prev,
      [original.type]: prev[original.type] - original.amount,
    }));
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" flexGrow={1}>
            Home
          </Typography>
          <AppBarMenu />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Overview totals={totals} />
      <TransactionsList
        title="Recent Transactions"
        transactions={transactions}
        onClickTransaction={(tx) => setTransactionToUpdate(tx)}
      />
      <HomeFAB onClick={() => setAddDialogOpen(true)} />
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
    </>
  );
}

export default Home;
