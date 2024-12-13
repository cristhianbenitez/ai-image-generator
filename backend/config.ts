export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const DIRECT_URL = process.env.DIRECT_URL ?? "";

// Validate required environment variables
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

if (!DIRECT_URL) {
  throw new Error("DIRECT_URL environment variable is required");
}
