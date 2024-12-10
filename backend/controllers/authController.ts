import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { env } from '../config/env.ts';
import { AuthService } from '../services/authService.ts';

const authService = new AuthService();

export class AuthController {
  async githubAuth(context: Context) {
    const authUrl = await authService.getGithubAuthUrl();
    context.response.redirect(authUrl);
  }

  async githubCallback(context: Context) {
    const url = context.request.url;
    const code = url.searchParams.get('code');

    if (!code) {
      context.response.redirect('http://localhost:5173/login?error=no_code');
      return;
    }

    try {
      const authResult = await authService.handleGithubCallback(url.toString());
      const userData = encodeURIComponent(JSON.stringify(authResult));
      context.response.redirect(
        `${env.FRONTEND_URL}/auth/callback?data=${userData}`,
      );
    } catch (error) {
      context.response.redirect(
        `${env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
  }
}
