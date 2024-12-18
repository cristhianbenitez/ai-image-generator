import prisma from '../lib/prisma';
import { oauth2Client } from '../config/oauth';
import jwt from 'jsonwebtoken';

interface GithubUser {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

export class AuthService {
  async getGithubAuthUrl() {
    return oauth2Client.code.getAuthorizationUri();
  }

  async handleGithubCallback(url: string) {
    // Get GitHub token
    const token = await oauth2Client.code.getToken(url);

    // Get user info
    const userInfo = await this.getGithubUserInfo(token.accessToken);

    // Validate required fields
    if (!userInfo.id) {
      throw new Error('Invalid user data from GitHub');
    }

    // Create or update user
    const user = await this.findOrCreateUser({
      name: userInfo.name || userInfo.login,
      githubId: userInfo.id.toString(),
      avatar: userInfo.avatar_url
    });

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      user,
      token: jwtToken,
      tokenType: 'Bearer'
    };
  }

  private async getGithubUserInfo(accessToken: string): Promise<GithubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/json',
        'User-Agent': 'taanga-app'
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${await response.text()}`);
    }

    const data = await response.json();
    return data as GithubUser;
  }

  private async findOrCreateUser(userData: {
    name: string;
    githubId: string;
    avatar: string;
  }) {
    let user = await prisma.user.findUnique({
      where: { githubId: userData.githubId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userData,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          avatar: userData.avatar,
          name: userData.name,
        },
      });
    }

    return user;
  }

  // Validate JWT token
  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  // Create a test user for development
  async findOrCreateTestUser() {
    const testUser = await prisma.user.findFirst({
      where: {
        githubId: 'test123'
      }
    });

    if (testUser) {
      return testUser;
    }

    return prisma.user.create({
      data: {
        name: 'Test User',
        githubId: 'test123',
        avatar: 'https://github.com/identicons/test.png'
      }
    });
  }
}
