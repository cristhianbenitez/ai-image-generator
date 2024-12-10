import { env } from '../config/env.ts';
import { PrismaClient } from '../generated/client/deno/edge.ts';
import { AppError, UserNotFoundError } from '../types/errors.ts';

const prisma = new PrismaClient({
  datasources: { db: { url: env.DATABASE_URL } },
});

export class ImageService {
  async saveGeneratedImage(data: {
    userId: number;
    prompt: string;
    negativePrompt?: string;
    color?: string;
    resolution: string;
    guidance: number;
    seed: number;
    imageUrl: string;
  }) {
    try {
      // First, verify the user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new UserNotFoundError(data.userId);
      }

      // Create the image record
      return await prisma.generatedImage.create({
        data: {
          prompt: data.prompt,
          negativePrompt: data.negativePrompt || '',
          color: data.color || '',
          resolution: data.resolution,
          guidance: data.guidance,
          seed: data.seed,
          imageUrl: data.imageUrl,
          userId: data.userId, // Direct assignment instead of using connect
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to save image: ${error.message}`);
    }
  }

  async getUserImages(userId: number) {
    try {
      return await prisma.generatedImage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      throw new AppError(`Failed to fetch user images: ${error.message}`);
    }
  }

  async getAllImages() {
    try {
      return await prisma.generatedImage.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      });
    } catch (error) {
      throw new AppError(`Failed to fetch images: ${error.message}`);
    }
  }
}
