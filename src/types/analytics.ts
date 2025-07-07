export type CategoriesTotals = Array<{
  id: number;
  label: string;
  value: number;
  color: string;
}>;

export type ExpensesVsIncome = Array<{
  month: string;
  expenses: number;
  income: number;
}>;
