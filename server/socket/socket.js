const Message = require('../models/Message');

// Map of userId -> socketId for online users
const onlineUsers = new Map();

let ioInstance;

const initSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins with their userId
    socket.on('user:join', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
      console.log(`👤 User ${userId} is online`);
    });

    // --- EVENT & COMMUNITY ROOMS ---
    socket.on('join-event', (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`📡 Socket joined room: event-${eventId}`);
    });

    socket.on('send-event-message', (data) => {
      // data: { eventId, userId, userName, text, createdAt }
      io.to(`event-${data.eventId}`).emit('new-event-message', data);
    });

    socket.on('join-community', (communityId) => {
      socket.join(`community-${communityId}`);
      console.log(`📡 Socket joined room: community-${communityId}`);
    });

    socket.on('send-community-post', (data) => {
      // data: { communityId, post }
      io.to(`community-${data.communityId}`).emit('new-community-post', data);
    });
    // --- END ROOMS ---

    // Handle sending a private message
    socket.on('message:send', async (data) => {
      const { senderId, receiverId, message, type } = data;

      try {
        // Save message to DB
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          message,
          type: type || 'text',
        });

        const populated = await newMessage.populate([
          { path: 'sender', select: 'name profileImage' },
          { path: 'receiver', select: 'name profileImage' },
        ]);

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:receive', populated);
        }

        // Confirm to sender
        socket.emit('message:sent', populated);
      } catch (error) {
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    // Mark messages as read
    socket.on('message:read', async ({ senderId, receiverId }) => {
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, read: false },
        { read: true }
      );
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message:read:ack', { receiverId });
      }
    });

    // Typing indicator
    socket.on('typing:start', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:start', { senderId });
      }
    });

    socket.on('typing:stop', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:stop', { senderId });
      }
    });

    // User disconnects
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('users:online', Array.from(onlineUsers.keys()));
          console.log(`👋 User ${userId} went offline`);
          break;
        }
      }
    });
  });
};

const getIo = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};

module.exports = { initSocket, onlineUsers, getIo };
