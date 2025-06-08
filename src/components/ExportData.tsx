import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { useDebts } from '@/hooks/useDebts';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { Download, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExportData: React.FC = () => {
  const { transactions } = useTransactions();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();
  const { toast } = useToast();

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Data kosong",
        description: "Belum ada data untuk diekspor"
      });
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header.toLowerCase().replace(' ', '_')] || '';
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Data berhasil diekspor!",
      description: `File ${filename}.csv siap didownload`
    });
  };

  const exportTransactions = () => {
    const formattedTransactions = transactions.map(transaction => ({
      tanggal: transaction.date,
      tipe: transaction.type === 'income' ? 'Pemasukan' : 
            transaction.type === 'expense' ? 'Pengeluaran' : 'Tabungan',
      kategori: transaction.category,
      deskripsi: transaction.description,
      jumlah: transaction.amount,
      catatan: transaction.note || '',
    }));

    exportToCSV(
      formattedTransactions,
      `elsa-transaksi-${new Date().toISOString().split('T')[0]}`,
      ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah', 'Catatan']
    );
  };

  const exportDebts = () => {
    const formattedDebts = debts.map(debt => ({
      nama_orang: debt.person_name,
      tipe: debt.type === 'owe' ? 'Saya hutang ke orang' : 'Orang hutang ke saya',
      jumlah: debt.amount,
      deskripsi: debt.description || '',
      jatuh_tempo: debt.due_date || '',
      status: debt.is_paid ? 'Lunas' : 'Belum Lunas',
    }));

    exportToCSV(
      formattedDebts,
      `elsa-hutang-piutang-${new Date().toISOString().split('T')[0]}`,
      ['Nama Orang', 'Tipe', 'Jumlah', 'Deskripsi', 'Jatuh Tempo', 'Status']
    );
  };

  const exportGoals = () => {
    const formattedGoals = goals.map(goal => ({
      judul: goal.title,
      target: goal.target_amount,
      terkumpul: goal.current_amount,
      progress: `${((goal.current_amount / goal.target_amount) * 100).toFixed(1)}%`,
      deadline: goal.deadline || '',
      deskripsi: goal.description || '',
      status: goal.is_completed ? 'Tercapai' : 'Aktif',
    }));

    exportToCSV(
      formattedGoals,
      `elsa-target-tabungan-${new Date().toISOString().split('T')[0]}`,
      ['Judul', 'Target', 'Terkumpul', 'Progress', 'Deadline', 'Deskripsi', 'Status']
    );
  };

  const exportAllData = () => {
    // Create a comprehensive financial report
    const summary = {
      tanggal_ekspor: new Date().toLocaleDateString('id-ID'),
      total_transaksi: transactions.length,
      total_hutang_piutang: debts.length,
      total_target: goals.length,
      total_pemasukan: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      total_pengeluaran: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      total_tabungan: transactions
        .filter(t => t.type === 'savings')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    exportToCSV(
      [summary],
      `elsa-laporan-keuangan-lengkap-${new Date().toISOString().split('T')[0]}`,
      ['Tanggal Ekspor', 'Total Transaksi', 'Total Hutang Piutang', 'Total Target', 
       'Total Pemasukan', 'Total Pengeluaran', 'Total Tabungan']
    );
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Database className="h-5 w-5 text-primary" />
          Export Data Keuangan
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download data keuangan dalam format CSV
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={exportTransactions}
            variant="outline"
            className="h-16 flex-col gap-2 glass-card hover:bg-primary/10 border-primary/20"
          >
            <FileText className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="font-medium text-foreground">Transaksi</p>
              <p className="text-xs text-muted-foreground">{transactions.length} data</p>
            </div>
          </Button>

          <Button
            onClick={exportDebts}
            variant="outline"
            className="h-16 flex-col gap-2 glass-card hover:bg-orange-500/10 border-orange-500/20"
          >
            <FileText className="h-5 w-5 text-orange-600" />
            <div className="text-center">
              <p className="font-medium text-foreground">Hutang Piutang</p>
              <p className="text-xs text-muted-foreground">{debts.length} data</p>
            </div>
          </Button>

          <Button
            onClick={exportGoals}
            variant="outline"
            className="h-16 flex-col gap-2 glass-card hover:bg-blue-500/10 border-blue-500/20"
          >
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="text-center">
              <p className="font-medium text-foreground">Target Tabungan</p>
              <p className="text-xs text-muted-foreground">{goals.length} data</p>
            </div>
          </Button>

          <Button
            onClick={exportAllData}
            className="h-16 flex-col gap-2 btn-primary"
          >
            <Download className="h-5 w-5" />
            <div className="text-center">
              <p className="font-medium">Semua Data</p>
              <p className="text-xs opacity-90">Laporan lengkap</p>
            </div>
          </Button>
        </div>

        <div className="mt-6 p-4 glass-card">
          <h4 className="font-medium text-foreground mb-2">💡 Tips Export:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• File CSV bisa dibuka di Excel atau Google Sheets</li>
            <li>• Data yang diekspor sesuai dengan data real-time</li>
            <li>• Gunakan "Semua Data" untuk laporan lengkap</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
