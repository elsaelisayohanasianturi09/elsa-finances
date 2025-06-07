
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import AuthPage from '@/components/AuthPage';
import InteractiveSummaryCard from '@/components/InteractiveSummaryCard';
import FinanceChart from '@/components/FinanceChart';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import DebtTracker from '@/components/DebtTracker';
import SavingsGoals from '@/components/SavingsGoals';
import ExportData from '@/components/ExportData';
import ClockWidget from '@/components/ClockWidget';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useDebts } from '@/hooks/useDebts';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { FinancialSummary } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, HandCoins, Target, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealtimePieChart from '@/components/RealtimePieChart';

const DashboardContent = () => {
  const { transactions } = useTransactions();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    balance: 0,
    totalOwed: 0,
    totalOwe: 0,
  });

  useEffect(() => {
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
    }, { totalIncome: 0, totalExpense: 0, totalSavings: 0, balance: 0, totalOwed: 0, totalOwe: 0 });

    // Calculate debt summary
    debts.forEach(debt => {
      if (!debt.is_paid) {
        if (debt.type === 'owed') {
          newSummary.totalOwed += debt.amount;
        } else {
          newSummary.totalOwe += debt.amount;
        }
      }
    });

    newSummary.balance = newSummary.totalIncome - newSummary.totalExpense - newSummary.totalSavings;
    setSummary(newSummary);
  }, [transactions, debts]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = "Elsa";
    
    if (hour < 10) return `Selamat pagi, ${name}`;
    if (hour < 15) return `Selamat siang, ${name}`;
    if (hour < 18) return `Selamat sore, ${name}`;
    return `Selamat malam, ${name}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Clock and Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <ClockWidget />
          </div>
          <div className="lg:col-span-3 flex items-center">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gradient mb-1">
                {getGreeting()}
              </h2>
              <p className="text-muted-foreground">
                Mari kelola keuangan dengan bijak hari ini
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InteractiveSummaryCard
            title="Total Pemasukan"
            amount={summary.totalIncome}
            icon={TrendingUp}
            color="#22c55e"
            emoji="💰"
            trend={5.2}
            subtitle="Pendapatan bulan ini"
          />
          <InteractiveSummaryCard
            title="Total Pengeluaran"
            amount={summary.totalExpense}
            icon={TrendingDown}
            color="#ef4444"
            emoji="💸"
            trend={-2.1}
            subtitle="Pengeluaran bulan ini"
          />
          <InteractiveSummaryCard
            title="Total Tabungan"
            amount={summary.totalSavings}
            icon={PiggyBank}
            color="#3b82f6"
            emoji="🐷"
            trend={8.7}
            subtitle="Tabungan terkumpul"
          />
          <InteractiveSummaryCard
            title="Saldo Tersisa"
            amount={summary.balance}
            icon={DollarSign}
            color="#8b5cf6"
            emoji="💳"
            subtitle="Saldo yang tersedia"
          />
          <InteractiveSummaryCard
            title="Piutang"
            amount={summary.totalOwed}
            icon={HandCoins}
            color="#f59e0b"
            emoji="😊"
            subtitle="Yang belum dibayar"
          />
          <InteractiveSummaryCard
            title="Hutang"
            amount={summary.totalOwe}
            icon={HandCoins}
            color="#dc2626"
            emoji="😰"
            subtitle="Yang harus dibayar"
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 card-modern">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="h-3 w-3" />
              <span className="hidden sm:inline">Transaksi</span>
            </TabsTrigger>
            <TabsTrigger value="debts" className="flex items-center gap-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <HandCoins className="h-3 w-3" />
              <span className="hidden sm:inline">Hutang</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Target className="h-3 w-3" />
              <span className="hidden sm:inline">Target</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database className="h-3 w-3" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyBarChart />
              <RealtimePieChart />
            </div>

            {/* Quick Transaction Form and List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TransactionForm onSubmit={() => {}} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={transactions.slice(0, 6)} 
                  showPagination={false}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TransactionForm onSubmit={() => {}} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debts">
            <DebtTracker />
          </TabsContent>

          <TabsContent value="goals">
            <SavingsGoals />
          </TabsContent>

          <TabsContent value="export">
            <ExportData />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Elsa Finance - Kelola keuangan dengan bijak
          </p>
        </footer>
      </main>
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <DashboardContent />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Index />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
