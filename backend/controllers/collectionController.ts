import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { collectionService } from '../services/collectionService.ts';
import { AppError, ValidationError } from '../types/errors.ts';

export class CollectionController {
  async saveToCollection(context: Context) {
    try {
      const body = await context.request.body().value;

      if (!body.userId || !body.imageId) {
        throw new ValidationError('Missing required fields');
      }

      const collection = await collectionService.saveToCollection({
        userId: Number(body.userId),
        imageId: Number(body.imageId),
      });

      context.response.body = collection;
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

  async getUserCollections(context: Context) {
    try {
      const userId = Number(context.params.userId);

      if (isNaN(userId)) {
        throw new ValidationError('Invalid user ID');
      }

      const collections = await collectionService.getUserCollections(userId);
      context.response.body = collections;
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

  async removeFromCollection(context: Context) {
    try {
      const userId = Number(context.params.userId);
      const imageId = Number(context.params.imageId);

      if (isNaN(userId) || isNaN(imageId)) {
        throw new ValidationError('Invalid user ID or image ID');
      }

      const collection = await collectionService.removeFromCollection({
        userId,
        imageId,
      });

      context.response.body = collection;
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
}
