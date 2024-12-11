import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { ImageService } from '../services/imageService.ts';
import { AppError, ValidationError } from '../types/errors.ts';

const imageService = new ImageService();

interface SaveImageRequest {
  userId: number;
  prompt: string;
  negativePrompt?: string;
  color?: string;
  resolution: string;
  guidance: number;
  seed: number;
  imageUrl: string;
}

export class ImageController {
  async saveImage(context: Context) {
    try {
      const body = (await context.request.body('json')
        .value) as SaveImageRequest;

      // Validate required fields
      if (!body.prompt || !body.resolution || !body.imageUrl) {
        throw new ValidationError('Missing required fields');
      }

      // Validate guidance scale
      if (body.guidance < 1 || body.guidance > 15) {
        throw new ValidationError('Guidance scale must be between 1 and 15');
      }

      const savedImage = await imageService.saveGeneratedImage(body);
      context.response.body = savedImage;
    } catch (error) {
      if (error instanceof AppError) {
        context.response.status = error.status;
        context.response.body = {
          error: error.message,
          code: error.code,
        };
      } else {
        context.response.status = 500;
        context.response.body = {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        };
      }
    }
  }

  async getUserImages(context: Context) {
    try {
      const userId = Number(context.params.userId);

      if (isNaN(userId)) {
        throw new ValidationError('Invalid user ID');
      }

      const images = await imageService.getUserImages(userId);
      context.response.body = images;
    } catch (error) {
      if (error instanceof AppError) {
        context.response.status = error.status;
        context.response.body = {
          error: error.message,
          code: error.code,
        };
      } else {
        context.response.status = 500;
        context.response.body = {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        };
      }
    }
  }

  async getAllImages(context: Context) {
    try {
      const userId = context.request.url.searchParams.get('userId');
      const images = await imageService.getAllImages(
        userId ? Number(userId) : undefined,
      );
      context.response.body = images;
    } catch (error) {
      if (error instanceof AppError) {
        context.response.status = error.status;
        context.response.body = { error: error.message };
      } else {
        context.response.status = 500;
        context.response.body = { error: 'Internal server error' };
      }
    }
  }
}
