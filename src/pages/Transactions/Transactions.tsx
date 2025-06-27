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

import TransactionsFAB from './components/TransactionsFAB';

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  useEffect(() => {
    (async () => {
      setTransactions(await getTransactions({ desc: true }));
    })();
  }, []);

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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Transactions
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <TransactionsList
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
    </>
  );
}

export default Transactions;
