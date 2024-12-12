import { env } from '../config/env.ts';
import { PrismaClient } from '@prisma/client';
import { AppError, UserNotFoundError } from '../types/errors.ts';

const prisma = new PrismaClient({
  datasources: { db: { url: env.DATABASE_URL } },
});

export class CollectionService {
  async saveToCollection(data: { userId: number; imageId: number }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new UserNotFoundError(data.userId);
      }

      const collection = await prisma.collection.upsert({
        where: {
          userId: data.userId,
        },
        create: {
          userId: data.userId,
          images: {
            connect: { id: data.imageId },
          },
        },
        update: {
          images: {
            connect: { id: data.imageId },
          },
        },
        select: {
          id: true,
          userId: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return collection;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to save to collection: ${error.message}`);
    }
  }

  async getUserCollections(userId: number) {
    try {
      const collections = await prisma.collection.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return collections;
    } catch (error) {
      throw new AppError(`Failed to fetch user collections: ${error.message}`);
    }
  }

  async removeFromCollection(data: { userId: number; imageId: number }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new UserNotFoundError(data.userId);
      }

      const collection = await prisma.collection.update({
        where: {
          userId: data.userId,
        },
        data: {
          images: {
            disconnect: { id: data.imageId },
          },
        },
        select: {
          id: true,
          userId: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return collection;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to remove from collection: ${error.message}`);
    }
  }
}

export const collectionService = new CollectionService();
