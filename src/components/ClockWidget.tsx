
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ClockWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="modern-card p-6 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Waktu Sekarang</span>
      </div>
      <div className="text-3xl font-mono font-bold text-gradient mb-1">
        {formatTime(currentTime)}
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default ClockWidget;
