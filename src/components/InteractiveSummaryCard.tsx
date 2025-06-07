
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InteractiveSummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: number;
  color: string;
  emoji?: string;
  subtitle?: string;
}

const InteractiveSummaryCard: React.FC<InteractiveSummaryCardProps> = ({ 
  title, 
  amount, 
  icon: Icon, 
  trend, 
  color, 
  emoji,
  subtitle
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="card-hover group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              {emoji && <span className="text-sm">{emoji}</span>}
            </div>
            
            <div className="space-y-1">
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(amount)}
              </p>
              
              {subtitle && (
                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '↗ +' : '↘ '}{Math.abs(trend)}%
                </span>
                <span className="text-xs text-muted-foreground">vs bulan lalu</span>
              </div>
            )}
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveSummaryCard;
