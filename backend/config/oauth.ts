import { OAuth2Client } from "https://deno.land/x/oauth2/mod.ts";
import { env } from "./env.ts";

export const oauth2Client = new OAuth2Client({
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  authorizationEndpointUri: "https://github.com/login/oauth/authorize",
  tokenUri: "https://github.com/login/oauth/access_token",
  redirectUri: "http://localhost:8000/auth/github/callback",
  defaults: {
    scope: "read:user user:email",
  },
});
