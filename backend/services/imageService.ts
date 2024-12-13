import prisma from '../lib/prisma';
import { AppError, UserNotFoundError } from '../types/errors';

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
      console.log('[ImageService] Saving generated image:', {
        userId: data.userId,
        prompt: data.prompt
      });

      // First, verify the user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!user) {
        console.error('[ImageService] User not found:', { userId: data.userId });
        throw new UserNotFoundError(data.userId);
      }

      // Create the image record
      const result = await prisma.generatedImage.create({
        data: {
          prompt: data.prompt,
          negativePrompt: data.negativePrompt || '',
          color: data.color || '',
          resolution: data.resolution,
          guidance: data.guidance,
          seed: data.seed,
          imageUrl: data.imageUrl,
          userId: data.userId // Direct assignment instead of using connect
        }
      });

      console.log('[ImageService] Successfully saved image:', {
        imageId: result.id,
        userId: result.userId
      });

      return result;
    } catch (error) {
      console.error('[ImageService] Error saving image:', {
        error,
        userId: data.userId
      });

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to save image: ${error.message}`);
    }
  }

  async getUserImages(userId: number) {
    try {
      console.log('[ImageService] Fetching user images:', { userId });

      const images = await prisma.generatedImage.findMany({
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

      console.log('[ImageService] Successfully fetched user images:', {
        userId,
        count: images.length
      });

      return images;
    } catch (error) {
      console.error('[ImageService] Error fetching user images:', {
        error,
        userId
      });
      throw new AppError(`Failed to fetch user images: ${error.message}`);
    }
  }

  async getAllImages(userId?: number) {
    try {
      console.log('[ImageService] Fetching all images:', { userId });

      const images = await prisma.generatedImage.findMany({
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

      // If no userId provided, return images without bookmark info
      if (!userId) {
        console.log('[ImageService] Returning images without bookmark info:', {
          count: images.length
        });
        return images.map(image => ({
          ...image,
          isBookmarked: false
        }));
      }

      // Get user's collection to check for bookmarked images
      const userCollection = await prisma.collection.findUnique({
        where: { userId },
        include: {
          images: {
            select: { id: true }
          }
        }
      });

      // Create a Set of bookmarked image IDs for efficient lookup
      const bookmarkedImageIds = new Set(
        userCollection?.images.map(img => img.id) || []
      );

      const imagesWithBookmarks = images.map(image => ({
        ...image,
        isBookmarked: bookmarkedImageIds.has(image.id)
      }));

      console.log('[ImageService] Successfully fetched all images:', {
        userId,
        totalImages: images.length,
        bookmarkedImages: bookmarkedImageIds.size
      });

      return imagesWithBookmarks;
    } catch (error) {
      console.error('[ImageService] Error fetching all images:', {
        error,
        userId
      });
      throw new AppError(`Failed to fetch images: ${error.message}`);
    }
  }
}
