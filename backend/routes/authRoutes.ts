import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { getBackendUrl, getFrontendUrl } from '../config/env';

const router = Router();
const authService = new AuthService();

// Get GitHub OAuth URL and redirect
router.get('/github', async (_req: Request, res: Response): Promise<void> => {
  try {
    const url = await authService.getGithubAuthUrl();
    res.redirect(url);
  } catch (error) {
    const frontendUrl = getFrontendUrl();
    res.redirect(`${frontendUrl}/auth/error`);
  }
});

// Handle GitHub callback
router.get('/github/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    // Use VERCEL_URL for production, fallback to request host for local development
    const backendUrl = getBackendUrl();
    const fullUrl = `${backendUrl}${req.originalUrl}`;
    const authResult = await authService.handleGithubCallback(fullUrl);

    // Redirect to frontend with user data
    const frontendUrl = getFrontendUrl();
    const redirectUrl = `${frontendUrl}/auth/callback?data=${encodeURIComponent(JSON.stringify(authResult))}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    const frontendUrl = getFrontendUrl();
    res.redirect(`${frontendUrl}/auth/callback`);
  }
});

// Verify JWT token
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const user = await authService.validateToken(token);

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

export { router };
