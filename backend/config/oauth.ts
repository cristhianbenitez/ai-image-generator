import { getBackendUrl } from './env';

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

class OAuth2Client {
  private config: {
    clientId: string;
    clientSecret: string;
    authorizationEndpointUri: string;
    tokenUri: string;
    redirectUri: string;
    defaults: {
      scope: string;
    };
  };

  constructor(config: {
    clientId: string;
    clientSecret: string;
    authorizationEndpointUri: string;
    tokenUri: string;
    redirectUri: string;
    defaults: {
      scope: string;
    };
  }) {
    this.config = config;
  }

  code = {
    getAuthorizationUri: () => {
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        scope: this.config.defaults.scope,
        response_type: 'code',
        state: this.generateState()
      });
      return `${this.config.authorizationEndpointUri}?${params.toString()}`;
    },

    getToken: async (url: string) => {
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      const state = urlObj.searchParams.get('state');

      if (!code) throw new Error('No code found in URL');
      if (!this.validateState(state)) throw new Error('Invalid state parameter');

      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri
      });

      const response = await fetch(this.config.tokenUri, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${await response.text()}`);
      }

      const data = await response.json() as TokenResponse;
      return {
        accessToken: data.access_token,
        tokenType: data.token_type,
        scope: data.scope
      };
    }
  };

  private generateState(): string {
    return Math.random().toString(36).substring(2);
  }

  private validateState(state: string | null): boolean {
    return !!state;
  }
}

// Use dynamic callback URL based on environment
const CALLBACK_URL = `${getBackendUrl()}/auth/github/callback`;

export const oauth2Client = new OAuth2Client({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  authorizationEndpointUri: "https://github.com/login/oauth/authorize",
  tokenUri: "https://github.com/login/oauth/access_token",
  redirectUri: CALLBACK_URL,
  defaults: {
    scope: "read:user user:email",
  },
});
