import { PrismaClient } from '@prisma/client';
import { oauth2Client } from '../config/oauth';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

interface GithubUser {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export class AuthService {
  async getGithubAuthUrl() {
    return oauth2Client.code.getAuthorizationUri();
  }

  async handleGithubCallback(url: string) {
    // Get GitHub token
    const token = await oauth2Client.code.getToken(url);

    // Get user info and emails
    const userInfo = await this.getGithubUserInfo(token.accessToken);
    const emails = await this.getGithubUserEmails(token.accessToken);

    // Validate required fields
    if (!userInfo.id || !emails[0]?.email) {
      throw new Error('Invalid user data from GitHub');
    }

    // Create or update user
    const user = await this.findOrCreateUser({
      name: userInfo.name || userInfo.login,
      githubId: userInfo.id.toString(),
      avatar: userInfo.avatar_url,
      email: emails[0].email,
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
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${await response.text()}`);
    }

    const data = await response.json();
    return data as GithubUser;
  }

  private async getGithubUserEmails(accessToken: string): Promise<GithubEmail[]> {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${await response.text()}`);
    }

    const data = await response.json();
    return data as GithubEmail[];
  }

  private async findOrCreateUser(userData: {
    name: string;
    githubId: string;
    avatar: string;
    email: string;
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
          email: userData.email,
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
        email: 'test@example.com'
      }
    });

    if (testUser) {
      return testUser;
    }

    return prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        githubId: 'test123',
        avatar: 'https://github.com/identicons/test.png'
      }
    });
  }
}
