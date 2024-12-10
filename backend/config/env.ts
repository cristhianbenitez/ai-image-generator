import { config } from "https://deno.land/x/dotenv/mod.ts";

const getBaseUrl = () => {
  if (Deno.env.get("VERCEL_URL")) {
    return `https://${Deno.env.get("VERCEL_URL")}`;
  }
  return "http://localhost:8000";
};

const getFrontendUrl = () => {
  // For production in Vercel
  if (Deno.env.get("VERCEL_ENV") === "production") {
    return `https://${Deno.env.get("VERCEL_URL")}`;
  }
  // For preview deployments
  if (Deno.env.get("VERCEL_URL")) {
    return `https://${Deno.env.get("VERCEL_URL").replace("-api", "")}`;
  }
  // For local development
  return "http://localhost:5173";
};

export const env = {
  ...config(),
  FRONTEND_URL: getFrontendUrl(),
  BACKEND_URL: getBaseUrl(),
  // ... other env variables
};
