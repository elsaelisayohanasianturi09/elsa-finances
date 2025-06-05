
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '@/hooks/useTransactions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp } from 'lucide-react';

const RealtimePieChart: React.FC = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRandomColor = () => {
    const colors = [
      '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
      '#EF4444', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Calculate expense data by category
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
            color: getRandomColor(),
          });
        }
        return acc;
      }, [] as Array<{ name: string; value: number; color: string }>);

    setRealtimeData(expenseData);
  }, [transactions]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // The useTransactions hook will automatically refetch data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="white-card p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-purple-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (realtimeData.length === 0) {
    return (
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            📊 Pengeluaran Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-semibold">Belum ada data pengeluaran</p>
              <p className="text-sm">Mulai catat pengeluaranmu dulu ya!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="interactive-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          📊 Pengeluaran Real-time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={realtimeData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {realtimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry) => (
                <span className="text-sm font-medium text-gray-700">
                  {value} - {formatCurrency(entry.payload.value)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 font-medium">
            🔄 Data diperbarui secara real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimePieChart;
