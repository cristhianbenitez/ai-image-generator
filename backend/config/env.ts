import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

export const config = {
  port: process.env.PORT || 8000,
  frontendUrlLocal: process.env.VITE_FRONTEND_URL_LOCAL,
  frontendUrl: process.env.VITE_FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET,
  // Add other environment variables as needed
};

export default config;
