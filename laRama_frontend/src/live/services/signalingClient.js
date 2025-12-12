/**
 * Socket.IO Signaling Client - LaRama Frontend
 * Establishes a connection with the backend signaling server used for WebRTC.
 */

import { io } from 'socket.io-client';

const SIGNALING_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const createSignalingClient = (options = {}) => {
  const socket = io(SIGNALING_URL, {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options,
  });

  return {
    socket,
    connect: () => {
      if (!socket.connected) {
        socket.connect();
      }
    },
    disconnect: () => {
      if (socket.connected) {
        socket.disconnect();
      }
    },
  };
};

export { SIGNALING_URL };
