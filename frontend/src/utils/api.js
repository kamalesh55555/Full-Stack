// Centralized API and Backend Server URL configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://peerlearn-ur0t.onrender.com/api';
export const SERVER_URL = API_URL.replace(/\/api\/?$/, '');
