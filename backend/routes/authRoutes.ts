import { Router } from 'express';
import { AuthService } from '../services/authService';

const router = Router();
const authService = new AuthService();

// Get GitHub OAuth URL and redirect
router.get('/github', async (req, res) => {
  try {
    const url = await authService.getGithubAuthUrl();
    res.redirect(url);
  } catch (error) {
    const frontendUrl = process.env.VITE_FRONTEND_URL_LOCAL || process.env.VITE_FRONTEND_URL;
    res.redirect(`${frontendUrl}/auth/error`);
  }
});

// Handle GitHub callback
router.get('/github/callback', async (req, res) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const authResult = await authService.handleGithubCallback(fullUrl);

    // Redirect to frontend with user data
    const frontendUrl = process.env.VITE_FRONTEND_URL_LOCAL || process.env.VITE_FRONTEND_URL;
    const redirectUrl = `${frontendUrl}/auth/callback?data=${encodeURIComponent(JSON.stringify(authResult))}`;
    res.redirect(redirectUrl);
  } catch (error) {
    const frontendUrl = process.env.VITE_FRONTEND_URL_LOCAL || process.env.VITE_FRONTEND_URL;
    res.redirect(`${frontendUrl}/auth/callback`);
  }
});

// Verify JWT token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = await authService.validateToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

export { router };
