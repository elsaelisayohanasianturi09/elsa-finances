
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import FinanceChart from '@/components/FinanceChart';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Transaction, FinancialSummary } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('elsa-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    balance: 0,
  });

  useEffect(() => {
    localStorage.setItem('elsa-transactions', JSON.stringify(transactions));
    
    const newSummary = transactions.reduce((acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          acc.totalIncome += transaction.amount;
          break;
        case 'expense':
          acc.totalExpense += transaction.amount;
          break;
        case 'savings':
          acc.totalSavings += transaction.amount;
          break;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalSavings: 0, balance: 0 });

    newSummary.balance = newSummary.totalIncome - newSummary.totalExpense - newSummary.totalSavings;
    setSummary(newSummary);
  }, [transactions]);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({
          name: transaction.category,
          value: transaction.amount,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

  const monthlyData = transactions
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('id-ID', { month: 'short' });
      const existing = acc.find(item => item.name === month);
      
      if (existing) {
        if (transaction.type === 'income') existing.income += transaction.amount;
        if (transaction.type === 'expense') existing.expense += transaction.amount;
      } else {
        acc.push({
          name: month,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0,
          value: transaction.amount,
          color: transaction.type === 'income' ? '#10b981' : '#ef4444',
        });
      }
      return acc;
    }, [] as Array<{ name: string; income: number; expense: number; value: number; color: string }>);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = "Elsa";
    
    if (hour < 10) return `Selamat pagi, ${name}! ☀️`;
    if (hour < 15) return `Selamat siang, ${name}! 🌤️`;
    if (hour < 18) return `Selamat sore, ${name}! 🌅`;
    return `Selamat malam, ${name}! 🌙`;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">{getGreeting()}</h2>
            <p className="text-muted-foreground">
              Mari kita lihat kondisi keuanganmu hari ini! 💪
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Pemasukan"
              amount={summary.totalIncome}
              icon={TrendingUp}
              color="#10b981"
              trend={5.2}
            />
            <SummaryCard
              title="Total Pengeluaran"
              amount={summary.totalExpense}
              icon={TrendingDown}
              color="#ef4444"
              trend={-2.1}
            />
            <SummaryCard
              title="Total Tabungan"
              amount={summary.totalSavings}
              icon={PiggyBank}
              color="#3b82f6"
              trend={8.7}
            />
            <SummaryCard
              title="Saldo Tersisa"
              amount={summary.balance}
              icon={DollarSign}
              color="#8b5cf6"
            />
          </div>

          {/* Charts */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {expenseData.length > 0 && (
                <FinanceChart
                  data={expenseData}
                  type="pie"
                  title="Pengeluaran per Kategori 📊"
                />
              )}
              {monthlyData.length > 0 && (
                <FinanceChart
                  data={monthlyData}
                  type="bar"
                  title="Trend Bulanan 📈"
                />
              )}
            </div>
          )}

          {/* Transaction Form and List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TransactionForm onSubmit={addTransaction} />
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={transactions} />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-muted-foreground">
            <p className="text-sm">
              Dibuat dengan ❤️ untuk membantu Elsa mengelola keuangan dengan lebih baik!
            </p>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
