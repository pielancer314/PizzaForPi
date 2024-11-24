import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create a socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token'),
  },
});

// Update token when it changes
export const updateSocketToken = (token) => {
  socket.auth = { token };
};

// Connect socket with error handling
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Socket event listeners
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
  if (error.message === 'Authentication error') {
    // Handle authentication error (e.g., redirect to login)
    window.location.href = '/login';
  }
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export default socket;
