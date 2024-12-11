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



    const user = await this.findOrCreateUser({
      name: userInfo.name || userInfo.login,
      githubId: userInfo.id.toString(),
      avatar: userInfo.avatar_url,
    });

    return user;
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
        data: { avatar: userData.avatar },
      });
    }

    return user;
  }
}
