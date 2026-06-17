import { io } from 'socket.io-client';
import { API } from './api';

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket && socket.connected) return socket;
  const token = localStorage.getItem('token');
  socket = io(API, {
    transports: ['websocket'],
    auth: token ? { token } : undefined,
    autoConnect: true,
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connect error:', err?.message || err);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export const subscribeSocket = (event, handler) => {
  const s = connectSocket();
  if (!s) return () => {};
  s.off(event, handler);
  s.on(event, handler);
  return () => s.off(event, handler);
};
