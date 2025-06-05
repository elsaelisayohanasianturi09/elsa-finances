
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import { Search, Calendar, Filter, Trash2, Heart } from 'lucide-react';

interface TransactionListProps {
  transactions?: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions: propTransactions }) => {
  const { transactions: allTransactions, deleteTransaction } = useTransactions();
  const transactions = propTransactions || allTransactions;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'income': return '💰';
      case 'expense': return '💸';
      case 'savings': return '🐷';
      default: return '💳';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-100 text-green-800 border-green-200';
      case 'expense': return 'bg-red-100 text-red-800 border-red-200';
      case 'savings': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <Card className="animate-fade-in border-2 hover:border-purple-300 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-purple-800">
          <Calendar className="h-6 w-6" />
          Riwayat Transaksi Elsa 📊
        </CardTitle>
        <p className="text-sm text-purple-600 font-semibold">
          Semua catatan keuangan kamu ada di sini! ✨
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <Input
              placeholder="Cari transaksi... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-2 focus:border-purple-400 font-semibold"
            />
          </div>
          
          <Select onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px] border-2 focus:border-purple-400 font-semibold">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold">Semua Tipe</SelectItem>
              <SelectItem value="income" className="font-semibold">💰 Pemasukan</SelectItem>
              <SelectItem value="expense" className="font-semibold">💸 Pengeluaran</SelectItem>
              <SelectItem value="savings" className="font-semibold">🐷 Tabungan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-600 mb-2">
                Belum ada transaksi nih! 🤷‍♀️
              </h3>
              <p className="text-purple-500 font-medium">
                Yuk mulai catat keuanganmu dari sekarang! ✨
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-5 rounded-xl border-2 bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {getTypeEmoji(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={`${getTypeColor(transaction.type)} font-bold border-2`}>
                        {transaction.category}
                      </Badge>
                      <span className="text-sm text-purple-600 font-semibold">
                        📅 {formatDate(transaction.date)}
                      </span>
                    </div>
                    {transaction.note && (
                      <p className="text-sm text-gray-600 mt-2 font-medium italic">
                        💭 {transaction.note}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p
                      className={`font-black text-xl ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : transaction.type === 'expense'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => deleteTransaction(transaction.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center border-2 border-purple-200">
            <p className="text-purple-700 font-bold">
              Total {filteredTransactions.length} transaksi ditampilkan ✨
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
