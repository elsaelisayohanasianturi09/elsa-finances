
export type TransactionType = 'income' | 'expense' | 'savings';

export type TransactionCategory = 
  | 'salary' | 'bonus' | 'gift' | 'investment' // income
  | 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'education' // expense
  | 'emergency' | 'vacation' | 'investment' | 'general'; // savings

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  description?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  balance: number;
}
