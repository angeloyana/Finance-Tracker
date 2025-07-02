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
  getTransaction,
  getTransactions,
  updateTransaction,
} from '@/lib/db';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import type { Totals } from '@/types/common';
import type { Transaction } from '@/types/transactions';

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
    Promise.all([getTotals(), getTransactions({ limit: 5, desc: true })]).then(
      ([result1, result2]) => {
        setTotals(result1);
        setTransactions(result2);
      }
    );
  }, []);

  const handleAddTransaction = async (data: AddTransactionData) => {
    const id = await addTransaction(data);
    const transaction = (await getTransaction(id))!;
    setTransactions((prev) => [transaction, ...(prev.length >= 5 ? prev.slice(0, -1) : prev)]);

    setTotals((prev) => ({
      ...prev,
      [transaction.type]: prev[transaction.type] + transaction.amount,
    }));
  };

  const handleUpdateTransaction = async (data: UpdateTransactionData, original: Transaction) => {
    await updateTransaction(original.id, data);
    const updatedTransaction = (await getTransaction(original.id))!;
    setTransactions((prev) =>
      prev.map((tx) => (tx.id !== updatedTransaction.id ? tx : updatedTransaction))
    );

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
    setTransactions((prev) => prev.filter((tx) => tx.id !== original.id));

    setTotals((prev) => ({
      ...prev,
      [original.type]: prev[original.type] - original.amount,
    }));
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Home
          </Typography>
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
