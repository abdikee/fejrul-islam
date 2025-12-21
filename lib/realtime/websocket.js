import { Server } from 'socket.io';

let io;

export function initializeWebSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join user-specific room
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join sector-specific rooms
      socket.on('join-sector-room', (sectorName) => {
        socket.join(`sector-${sectorName}`);
        console.log(`User joined sector room: ${sectorName}`);
      });

      // Handle habit updates
      socket.on('habit-update', (data) => {
        // Broadcast to user's room
        socket.to(`user-${data.userId}`).emit('habit-updated', data);
      });

      // Handle progress updates
      socket.on('progress-update', (data) => {
        socket.to(`user-${data.userId}`).emit('progress-updated', data);
      });

      // Handle announcements
      socket.on('new-announcement', (data) => {
        // Broadcast to all users or specific sectors
        if (data.targetSector) {
          socket.to(`sector-${data.targetSector}`).emit('announcement-received', data);
        } else {
          socket.broadcast.emit('announcement-received', data);
        }
      });

      // Handle prayer time updates
      socket.on('prayer-time-update', (data) => {
        socket.broadcast.emit('prayer-time-updated', data);
      });

      // Handle mentorship messages
      socket.on('mentorship-message', (data) => {
        socket.to(`user-${data.recipientId}`).emit('message-received', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('WebSocket not initialized');
  }
  return io;
}

// Utility functions for broadcasting updates
export function broadcastHabitUpdate(userId, habitData) {
  if (io) {
    io.to(`user-${userId}`).emit('habit-updated', habitData);
  }
}

export function broadcastProgressUpdate(userId, progressData) {
  if (io) {
    io.to(`user-${userId}`).emit('progress-updated', progressData);
  }
}

export function broadcastAnnouncement(announcement, targetSector = null) {
  if (io) {
    if (targetSector) {
      io.to(`sector-${targetSector}`).emit('announcement-received', announcement);
    } else {
      io.emit('announcement-received', announcement);
    }
  }
}

export function broadcastPrayerTimeUpdate(prayerTimes) {
  if (io) {
    io.emit('prayer-time-updated', prayerTimes);
  }
}