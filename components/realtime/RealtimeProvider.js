'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRealtime, usePrayerTimes, useNotifications } from '@/hooks/use-realtime';

const RealtimeContext = createContext();

export function RealtimeProvider({ children, userId }) {
  const realtime = useRealtime(userId);
  const prayerTimes = usePrayerTimes();
  const notifications = useNotifications(userId);
  
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    ...realtime,
    ...prayerTimes,
    ...notifications,
    isOnline,
    userId
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within RealtimeProvider');
  }
  return context;
}