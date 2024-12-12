export const DATABASE_URL = Deno.env.get("DATABASE_URL") ?? "";
export const DIRECT_URL = Deno.env.get("DIRECT_URL") ?? "";

// Validate required environment variables
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

if (!DIRECT_URL) {
  throw new Error("DIRECT_URL environment variable is required");
}
