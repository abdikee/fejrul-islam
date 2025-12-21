'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useRealtime(userId) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection event handlers
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to real-time server');
      
      // Join user-specific room
      if (userId) {
        socketInstance.emit('join-user-room', userId);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from real-time server');
    });

    // Real-time event handlers
    socketInstance.on('habit-updated', (data) => {
      // Trigger habit update in UI
      window.dispatchEvent(new CustomEvent('habit-updated', { detail: data }));
      addNotification('Habit updated successfully', 'success');
    });

    socketInstance.on('progress-updated', (data) => {
      // Trigger progress update in UI
      window.dispatchEvent(new CustomEvent('progress-updated', { detail: data }));
      addNotification('Progress updated', 'info');
    });

    socketInstance.on('announcement-received', (data) => {
      // Show new announcement
      window.dispatchEvent(new CustomEvent('new-announcement', { detail: data }));
      addNotification(`New announcement: ${data.title}`, 'info');
    });

    socketInstance.on('prayer-time-updated', (data) => {
      // Update prayer times
      window.dispatchEvent(new CustomEvent('prayer-time-updated', { detail: data }));
    });

    socketInstance.on('message-received', (data) => {
      // Show new message notification
      window.dispatchEvent(new CustomEvent('message-received', { detail: data }));
      addNotification(`New message from ${data.senderName}`, 'info');
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5 notifications
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const emitHabitUpdate = (habitData) => {
    if (socket && isConnected) {
      socket.emit('habit-update', { userId, ...habitData });
    }
  };

  const emitProgressUpdate = (progressData) => {
    if (socket && isConnected) {
      socket.emit('progress-update', { userId, ...progressData });
    }
  };

  const joinSectorRoom = (sectorName) => {
    if (socket && isConnected) {
      socket.emit('join-sector-room', sectorName);
    }
  };

  return {
    socket,
    isConnected,
    notifications,
    emitHabitUpdate,
    emitProgressUpdate,
    joinSectorRoom,
    addNotification
  };
}

// Hook for real-time prayer times
export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeToNext, setTimeToNext] = useState('');

  useEffect(() => {
    // Fetch initial prayer times
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('/api/prayer-times');
        const data = await response.json();
        if (data.success) {
          setPrayerTimes(data.prayerTimes);
          updateNextPrayer(data.prayerTimes);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();

    // Listen for real-time updates
    const handlePrayerTimeUpdate = (event) => {
      const updatedTimes = event.detail;
      setPrayerTimes(updatedTimes);
      updateNextPrayer(updatedTimes);
    };

    window.addEventListener('prayer-time-updated', handlePrayerTimeUpdate);

    // Update countdown every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        updateNextPrayer(prayerTimes);
      }
    }, 60000);

    return () => {
      window.removeEventListener('prayer-time-updated', handlePrayerTimeUpdate);
      clearInterval(interval);
    };
  }, [prayerTimes]);

  const updateNextPrayer = (times) => {
    if (!times) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: times.fajr },
      { name: 'Dhuhr', time: times.dhuhr },
      { name: 'Asr', time: times.asr },
      { name: 'Maghrib', time: times.maghrib },
      { name: 'Isha', time: times.isha }
    ];

    // Convert prayer times to minutes
    const prayerMinutes = prayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return {
        ...prayer,
        minutes: hours * 60 + minutes
      };
    });

    // Find next prayer
    let nextPrayerInfo = prayerMinutes.find(prayer => prayer.minutes > currentTime);
    
    if (!nextPrayerInfo) {
      // Next prayer is Fajr tomorrow
      nextPrayerInfo = prayerMinutes[0];
      nextPrayerInfo.minutes += 24 * 60; // Add 24 hours
    }

    setNextPrayer(nextPrayerInfo);

    // Calculate time remaining
    const minutesRemaining = nextPrayerInfo.minutes - currentTime;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const minsRemaining = minutesRemaining % 60;
    
    if (hoursRemaining > 0) {
      setTimeToNext(`${hoursRemaining}h ${minsRemaining}m`);
    } else {
      setTimeToNext(`${minsRemaining}m`);
    }
  };

  return { prayerTimes, nextPrayer, timeToNext };
}

// Hook for real-time notifications
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen for various real-time events
    const handleNewAnnouncement = (event) => {
      const announcement = event.detail;
      addNotification({
        id: Date.now(),
        type: 'announcement',
        title: 'New Announcement',
        message: announcement.title,
        timestamp: new Date(),
        read: false
      });
    };

    const handleMessageReceived = (event) => {
      const message = event.detail;
      addNotification({
        id: Date.now(),
        type: 'message',
        title: 'New Message',
        message: `From ${message.senderName}`,
        timestamp: new Date(),
        read: false
      });
    };

    const handleHabitUpdated = (event) => {
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Habit Updated',
        message: 'Your daily habits have been updated',
        timestamp: new Date(),
        read: false
      });
    };

    window.addEventListener('new-announcement', handleNewAnnouncement);
    window.addEventListener('message-received', handleMessageReceived);
    window.addEventListener('habit-updated', handleHabitUpdated);

    return () => {
      window.removeEventListener('new-announcement', handleNewAnnouncement);
      window.removeEventListener('message-received', handleMessageReceived);
      window.removeEventListener('habit-updated', handleHabitUpdated);
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}