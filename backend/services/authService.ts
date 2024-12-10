import { env } from '../config/env.ts';
import { oauth2Client } from '../config/oauth.ts';
import { PrismaClient } from '../generated/client/deno/edge.ts';

const prisma = new PrismaClient({
  datasources: { db: { url: env.DATABASE_URL } },
});

export class AuthService {
  async getGithubAuthUrl() {
    return oauth2Client.code.getAuthorizationUri();
  }

  async handleGithubCallback(url: string) {
    const token = await oauth2Client.code.getToken(url);
    const userInfo = await this.getGithubUserInfo(token.accessToken);
    const emails = await this.getGithubUserEmails(token.accessToken);

    const primaryEmail =
      emails.find((email: any) => email.primary)?.email || emails[0]?.email;
    if (!primaryEmail) {
      throw new Error('No email associated with GitHub account');
    }

    const user = await this.findOrCreateUser({
      email: primaryEmail,
      name: userInfo.name || userInfo.login,
      githubId: userInfo.id.toString(),
      avatar: userInfo.avatar_url,
    });

    return {
      user,
      githubUser: {
        id: userInfo.id,
        name: userInfo.name || userInfo.login,
        email: userInfo.email,
        avatar_url: userInfo.avatar_url,
      },
    };
  }

  private async getGithubUserInfo(accessToken: string) {
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${await response.text()}`);
    }

    return await response.json();
  }

  private async getGithubUserEmails(accessToken: string) {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${await response.text()}`);
    }

    return await response.json();
  }

  private async findOrCreateUser(userData: {
    email: string;
    name: string;
    githubId: string;
    avatar: string;
  }) {
    let user = await prisma.user.findUnique({
      where: { githubId: userData.githubId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: userData,
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: userData.avatar }
      });
    }

    return user;
  }
}
