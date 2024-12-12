import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

// Helper functions for URLs
const getBackendUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.VITE_BACKEND_URL || 'http://localhost:8000';
};

const getFrontendUrl = () => {
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
