
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType, TransactionCategory } from '@/types';
import { Plus, Sparkles } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const { addTransaction, isAddingTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    type: '' as TransactionType,
    category: '' as TransactionCategory,
    description: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['salary', 'bonus', 'gift', 'investment'],
    expense: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education'],
    savings: ['emergency', 'vacation', 'investment', 'general']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.type || !formData.category || !formData.description) {
      return;
    }

    addTransaction({
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      note: formData.note,
      date: formData.date
    });

    setFormData({
      amount: '',
      type: '' as TransactionType,
      category: '' as TransactionCategory,
      description: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });

    onSubmit();
  };

  const getTypeEmoji = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      case 'savings':
        return '🐷';
      default:
        return '💳';
    }
  };

  return (
    <Card className="glass-card animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          <Sparkles className="h-4 w-4 text-primary" />
          Tambah Transaksi Baru
        </CardTitle>
        <p className="text-sm text-muted-foreground font-medium">
          Catat semua pemasukan dan pengeluaran
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Jumlah (Rp) 💰
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 50000"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                required
                className="input-modern"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-foreground">
                Tanggal 📅
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
                className="input-modern"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-foreground">
              Tipe Transaksi
            </Label>
            <Select onValueChange={(value: TransactionType) => setFormData({
              ...formData,
              type: value,
              category: '' as TransactionCategory
            })}>
              <SelectTrigger className="input-modern">
                <SelectValue placeholder="Pilih tipe transaksi" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="income" className="font-medium">💰 Pemasukan</SelectItem>
                <SelectItem value="expense" className="font-medium">💸 Pengeluaran</SelectItem>
                <SelectItem value="savings" className="font-medium">🐷 Tabungan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type && (
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Kategori {getTypeEmoji(formData.type)}
              </Label>
              <Select onValueChange={(value: TransactionCategory) => setFormData({
                ...formData,
                category: value
              })}>
                <SelectTrigger className="input-modern">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {categories[formData.type].map(cat => (
                    <SelectItem key={cat} value={cat} className="font-medium">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Deskripsi 📝
            </Label>
            <Input
              id="description"
              placeholder="Contoh: Beli kopi di café favorit"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              className="input-modern"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium text-foreground">
              Catatan (opsional) 💭
            </Label>
            <Textarea
              id="note"
              placeholder="Tambahkan catatan atau detail lainnya"
              value={formData.note}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              rows={2}
              className="input-modern resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary text-base font-medium py-2.5"
            disabled={isAddingTransaction}
          >
            {isAddingTransaction ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
