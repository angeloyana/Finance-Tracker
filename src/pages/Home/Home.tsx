import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
  updateTransaction,
} from '@/services/db';
import type { Transaction } from '@/types/transactions';

import HomeFAB from './components/HomeFAB';

function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  useEffect(() => {
    (async () => {
      setTransactions(await getTransactions({ desc: true, limit: 5 }));
    })();
  }, []);

  const handleAddTransaction = async (data: AddTransactionData) => {
    const id = await addTransaction(data);
    const transaction = (await getTransaction(id))!;
    setTransactions((prev) => [transaction, ...(prev.length >= 5 ? prev.slice(0, -1) : prev)]);
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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Home
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
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
