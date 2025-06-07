
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/hooks/useTransactions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp } from 'lucide-react';

const MonthlyBarChart: React.FC = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    // Get current month transactions
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Calculate weekly data for the current month
    const weeklyData = [];
    const weeksInMonth = 4;
    
    for (let week = 1; week <= weeksInMonth; week++) {
      const weekIncome = monthlyTransactions
        .filter(t => {
          const weekOfMonth = Math.ceil(new Date(t.date).getDate() / 7);
          return weekOfMonth === week && t.type === 'income';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const weekExpense = monthlyTransactions
        .filter(t => {
          const weekOfMonth = Math.ceil(new Date(t.date).getDate() / 7);
          return weekOfMonth === week && t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      weeklyData.push({
        name: `Minggu ${week}`,
        pemasukan: weekIncome,
        pengeluaran: weekExpense,
      });
    }

    setChartData(weeklyData);
  }, [transactions]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('monthly-chart-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time chart update:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-modern p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-modern">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trend Bulan Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `${value / 1000}k`} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="pemasukan" 
              fill="hsl(142 76% 36%)" 
              radius={[3, 3, 0, 0]}
              name="Pemasukan"
            />
            <Bar 
              dataKey="pengeluaran" 
              fill="hsl(0 84% 60%)" 
              radius={[3, 3, 0, 0]}
              name="Pengeluaran"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Data diperbarui secara real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyBarChart;
