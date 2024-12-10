import { env } from '../config/env.ts';
import { PrismaClient } from '../generated/client/deno/edge.ts';

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
    imageUrl: string;
  }) {
    try {
      // First, verify the user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error(`User with ID ${data.userId} not found`);
      }

      // Create the image record
      return await prisma.generatedImage.create({
        data: {
          prompt: data.prompt,
          negativePrompt: data.negativePrompt || '',
          color: data.color || '',
          resolution: data.resolution,
          guidance: data.guidance,
          imageUrl: data.imageUrl,
          userId: data.userId, // Direct assignment instead of using connect
        },
      });
    } catch (error) {
      console.error('Error in saveGeneratedImage:', error);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  async getUserImages(userId: number) {
    return await prisma.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
} 
