import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { AuthService } from "../services/authService.ts";

const authService = new AuthService();

export class AuthController {
  async githubAuth(context: Context) {
    const authUrl = await authService.getGithubAuthUrl();
    context.response.redirect(authUrl);
  }

  async githubCallback(context: Context) {
    const url = context.request.url;
    const code = url.searchParams.get("code");

    if (!code) {
      context.response.redirect('http://localhost:5173/login?error=no_code');
      return;
    }

    try {
      const authResult = await authService.handleGithubCallback(url.toString());

      // Redirect to frontend with user data as URL parameters
      const userData = encodeURIComponent(JSON.stringify(authResult));
      context.response.redirect(`http://localhost:5173/auth/callback?data=${userData}`);
    } catch (error) {
      console.error("Error during GitHub authentication:", error);
      context.response.redirect('http://localhost:5173/login?error=auth_failed');
    }
  }
}
