import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import AddTransaction from '@/components/Transactions/AddTransaction';
import TransactionsList from '@/components/Transactions/TransactionsList';
import UpdateTransaction from '@/components/Transactions/UpdateTransaction';
import type { AddTransactionData, UpdateTransactionData } from '@/schemas/transactions';
import type { Transaction } from '@/types/transactions';

import HomeFAB from './components/HomeFAB';

function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [transactionToUpdate, setTransactionToUpdate] = useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions([
      {
        id: 2,
        type: 'expense',
        note: 'Dinner',
        amount: 150,
        createdAt: new Date(),
        categoryId: 2,
        category: 'Foods & Drinks',
      },
      {
        id: 1,
        type: 'income',
        note: 'IT Company',
        amount: 20000,
        createdAt: new Date(),
        categoryId: 1,
        category: 'Salary',
      },
    ]);
  }, []);

  const handleAddTransaction = async (data: AddTransactionData) => {
    // TODO: insert and retrieve transaction from database.
    const transaction: Transaction = {
      ...data,
      id: transactions.length + 1,
      category: data.categoryId === 1 ? 'Salary' : data.categoryId === 2 ? 'Foods & Drinks' : null,
      createdAt: new Date(),
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleUpdateTransaction = async (data: UpdateTransactionData, original: Transaction) => {
    // TODO: update and retrieve transaction from database.
    const updatedTransaction = {
      ...original,
      ...data,
      category: data.categoryId === 1 ? 'Salary' : data.categoryId === 2 ? 'Foods & Drinks' : null,
    };
    setTransactions((prev) =>
      prev.map((tx) => (tx.id !== updatedTransaction.id ? tx : updatedTransaction))
    );
  };

  const handleDeleteTransaction = async (original: Transaction) => {
    // TODO: delete transaction from database.
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
