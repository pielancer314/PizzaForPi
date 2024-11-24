import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  initialize() {
    if (this.socket) return;

    const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.connected = false;

      if (error.message.includes('Authentication')) {
        // Handle authentication errors (e.g., redirect to login)
        window.location.href = '/login';
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
    });
  }

  connect() {
    if (!this.socket) {
      this.initialize();
    }
    if (!this.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket && this.connected) {
      this.socket.disconnect();
    }
  }

  // Update authentication token
  updateToken(token) {
    if (this.socket) {
      this.socket.auth = { token };
      if (this.connected) {
        this.disconnect();
        this.connect();
      }
    }
  }

  // Join order tracking room
  joinOrderRoom(orderId) {
    if (this.connected) {
      this.socket.emit('join_order_room', orderId);
    }
  }

  // Leave order tracking room
  leaveOrderRoom(orderId) {
    if (this.connected) {
      this.socket.emit('leave_order_room', orderId);
    }
  }

  // Join restaurant room (for staff)
  joinRestaurantRoom(restaurantId) {
    if (this.connected) {
      this.socket.emit('join_restaurant_room', restaurantId);
    }
  }

  // Subscribe to order updates
  onOrderUpdate(orderId, callback) {
    if (this.socket) {
      this.socket.on(`order_${orderId}_update`, callback);
    }
  }

  // Subscribe to driver location updates
  onDriverLocationUpdate(orderId, callback) {
    if (this.socket) {
      this.socket.on(`driver_${orderId}_location`, callback);
    }
  }

  // Unsubscribe from order updates
  offOrderUpdate(orderId, callback) {
    if (this.socket) {
      this.socket.off(`order_${orderId}_update`, callback);
    }
  }

  // Unsubscribe from driver location updates
  offDriverLocationUpdate(orderId, callback) {
    if (this.socket) {
      this.socket.off(`driver_${orderId}_location`, callback);
    }
  }

  // Send driver location update (for drivers)
  updateDriverLocation(orderId, location) {
    if (this.connected) {
      this.socket.emit('update_driver_location', { orderId, location });
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
