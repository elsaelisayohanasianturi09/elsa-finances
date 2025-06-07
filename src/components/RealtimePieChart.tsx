
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '@/hooks/useTransactions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart as PieChartIcon } from 'lucide-react';

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

  const colors = [
    'hsl(142 76% 36%)', 'hsl(0 84% 60%)', 'hsl(46 91% 58%)', 
    'hsl(221 83% 53%)', 'hsl(262 83% 58%)', 'hsl(16 81% 55%)',
    'hsl(168 76% 42%)', 'hsl(272 49% 54%)', 'hsl(212 95% 68%)'
  ];

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
            color: colors[acc.length % colors.length],
          });
        }
        return acc;
      }, [] as Array<{ name: string; value: number; color: string }>);

    setRealtimeData(expenseData);
  }, [transactions]);

  useEffect(() => {
    if (!user) return;

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
        <div className="card-modern p-3 shadow-lg">
          <p className="font-medium text-foreground">{payload[0].name}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (realtimeData.length === 0) {
    return (
      <Card className="card-modern">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Pengeluaran Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-medium">Belum ada data pengeluaran</p>
              <p className="text-sm">Mulai catat pengeluaranmu</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-modern">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <PieChartIcon className="h-4 w-4 text-primary" />
          Pengeluaran Real-time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={realtimeData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {realtimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry) => (
                <span className="text-xs font-medium text-foreground">
                  {value}
                </span>
              )}
            />
          </PieChart>
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

export default RealtimePieChart;
