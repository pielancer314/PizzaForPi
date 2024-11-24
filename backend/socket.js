const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user's personal room for their orders
    socket.join(`user_${socket.user.id}`);

    // Handle joining order room for tracking
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
    });

    // Handle joining restaurant room (for restaurant staff)
    socket.on('join_restaurant_room', (restaurantId) => {
      if (socket.user.role === 'restaurant_staff') {
        socket.join(`restaurant_${restaurantId}`);
      }
    });

    // Handle location updates from drivers
    socket.on('driver_location_update', (data) => {
      const { orderId, location } = data;
      io.to(`order_${orderId}`).emit('driver_location', {
        orderId,
        location,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
};
