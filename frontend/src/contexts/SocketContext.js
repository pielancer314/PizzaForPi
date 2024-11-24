import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize and connect socket
      socketService.initialize();
      socketService.connect();

      // Update token if needed
      const token = localStorage.getItem('piAccessToken');
      if (token) {
        socketService.updateToken(token);
      }

      // Join user-specific rooms
      if (user?.restaurantId) {
        socketService.joinRestaurantRoom(user.restaurantId);
      }

      // Update connection status
      const handleConnect = () => setConnected(true);
      const handleDisconnect = () => setConnected(false);

      socketService.socket.on('connect', handleConnect);
      socketService.socket.on('disconnect', handleDisconnect);

      // Cleanup on unmount
      return () => {
        socketService.socket.off('connect', handleConnect);
        socketService.socket.off('disconnect', handleDisconnect);
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const joinOrderRoom = (orderId) => {
    socketService.joinOrderRoom(orderId);
  };

  const leaveOrderRoom = (orderId) => {
    socketService.leaveOrderRoom(orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    if (connected) {
      socketService.socket.emit('order_status_update', { orderId, status });
    }
  };

  const updateDriverLocation = (orderId, location) => {
    socketService.updateDriverLocation(orderId, location);
  };

  const subscribeToOrderUpdates = (orderId, callback) => {
    socketService.onOrderUpdate(orderId, callback);
    return () => socketService.offOrderUpdate(orderId, callback);
  };

  const subscribeToDriverLocation = (orderId, callback) => {
    socketService.onDriverLocationUpdate(orderId, callback);
    return () => socketService.offDriverLocationUpdate(orderId, callback);
  };

  const value = {
    connected,
    joinOrderRoom,
    leaveOrderRoom,
    updateOrderStatus,
    updateDriverLocation,
    subscribeToOrderUpdates,
    subscribeToDriverLocation,
    socket: socketService.socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
