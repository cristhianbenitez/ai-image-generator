import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

// Helper functions for URLs
const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://taanga-backend.vercel.app';
  }
  return process.env.VITE_BACKEND_URL || 'http://localhost:8000';
};

const getFrontendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://taanga-app.vercel.app';
  }
  return process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
};

export const config = {
  port: process.env.PORT || 8000,
  frontendUrl: getFrontendUrl(),
  backendUrl: getBackendUrl(),
  jwtSecret: process.env.JWT_SECRET,
  getBackendUrl,
  getFrontendUrl,
};

export { getBackendUrl, getFrontendUrl };
export default config;
