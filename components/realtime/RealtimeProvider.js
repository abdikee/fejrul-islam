'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRealtime, usePrayerTimes, useNotifications } from '@/hooks/use-realtime';
import { useAuth } from '@/hooks/useAuth';

const RealtimeContext = createContext();

export function RealtimeProvider({ children, userId }) {
  const { user } = useAuth();
  const resolvedUserId = useMemo(() => userId ?? user?.id ?? null, [userId, user?.id]);

  const realtime = useRealtime(resolvedUserId);
  const prayerTimes = usePrayerTimes();
  const notifications = useNotifications(resolvedUserId);
  
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
    userId: resolvedUserId
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