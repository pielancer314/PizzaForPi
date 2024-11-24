const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO middleware for authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle client connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user's personal room
    socket.join(`user_${socket.user.id}`);

    // Handle joining order tracking room
    socket.on('join_order_room', (orderId) => {
      console.log(`User ${socket.user.id} joined order room: ${orderId}`);
      socket.join(`order_${orderId}`);
    });

    // Handle leaving order tracking room
    socket.on('leave_order_room', (orderId) => {
      console.log(`User ${socket.user.id} left order room: ${orderId}`);
      socket.leave(`order_${orderId}`);
    });

    // Handle restaurant staff joining restaurant room
    socket.on('join_restaurant_room', (restaurantId) => {
      if (socket.user.role === 'restaurant_staff') {
        console.log(`Staff ${socket.user.id} joined restaurant room: ${restaurantId}`);
        socket.join(`restaurant_${restaurantId}`);
      }
    });

    // Handle driver location updates
    socket.on('update_driver_location', (data) => {
      const { orderId, location } = data;
      io.to(`order_${orderId}`).emit('driver_location_updated', {
        orderId,
        location,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Get the Socket.IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
