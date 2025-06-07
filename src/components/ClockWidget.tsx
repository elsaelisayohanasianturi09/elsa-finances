
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
    <div className="card-modern p-4 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Waktu Sekarang
        </span>
      </div>
      <div className="text-2xl font-bold text-foreground mb-1 font-mono">
        {formatTime(currentTime)}
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default ClockWidget;
