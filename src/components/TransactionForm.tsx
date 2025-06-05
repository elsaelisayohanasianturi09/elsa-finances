
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, TransactionType, TransactionCategory } from '@/types';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: '' as TransactionType,
    category: '' as TransactionCategory,
    description: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    income: ['salary', 'bonus', 'gift', 'investment'],
    expense: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education'],
    savings: ['emergency', 'vacation', 'investment', 'general'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.type || !formData.category || !formData.description) {
      return;
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      note: formData.note,
      date: formData.date,
    });

    setFormData({
      amount: '',
      type: '' as TransactionType,
      category: '' as TransactionCategory,
      description: '',
      note: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Transaksi Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe Transaksi</Label>
            <Select onValueChange={(value: TransactionType) => setFormData({ ...formData, type: value, category: '' as TransactionCategory })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">💰 Pemasukan</SelectItem>
                <SelectItem value="expense">💸 Pengeluaran</SelectItem>
                <SelectItem value="savings">🐷 Tabungan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type && (
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select onValueChange={(value: TransactionCategory) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories[formData.type].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Contoh: Beli kopi di café"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan (opsional)</Label>
            <Textarea
              id="note"
              placeholder="Tambahkan catatan atau emoji 😊"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
