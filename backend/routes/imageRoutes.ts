import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Constants for pagination limits
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;

// Get all images (feed)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Input validation and sanitization
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    let page = Math.max(1, parseInt(req.query.page as string) || 1);
    let limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    // Use Promise.all to run queries concurrently
    const [totalImages, images] = await Promise.all([
      // Get total count for pagination
      prisma.generatedImage.count(),

      // Fetch paginated images with optimized fields
      prisma.generatedImage.findMany({
        select: {
          id: true,
          prompt: true,
          negativePrompt: true,
          color: true,
          resolution: true,
          guidance: true,
          seed: true,
          imageUrl: true,
          createdAt: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: skip
      })
    ]);

    // If userId is provided, fetch bookmark status efficiently
    let imagesWithBookmarkStatus = images;
    if (userId) {
      const userCollection = await prisma.collection.findUnique({
        where: { userId },
        select: {
          images: {
            select: { id: true }
          }
        }
      });

      const bookmarkedImageIds = new Set(
        userCollection?.images.map(img => img.id) || []
      );

      imagesWithBookmarkStatus = images.map(image => ({
        ...image,
        isBookmarked: bookmarkedImageIds.has(image.id)
      }));
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalImages / limit);

    res.json({
      data: imagesWithBookmarkStatus,
      pagination: {
        total: totalImages,
        pages: totalPages,
        currentPage: page,
        perPage: limit,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's images
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Use Promise.all to run queries concurrently
    const [totalImages, images] = await Promise.all([
      // Get total count
      prisma.generatedImage.count({
        where: { userId }
      }),

      // Fetch paginated images
      prisma.generatedImage.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          prompt: true,
          negativePrompt: true,
          color: true,
          resolution: true,
          guidance: true,
          seed: true,
          imageUrl: true,
          createdAt: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip
      })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalImages / limit);

    console.log(`Successfully fetched ${images.length} images for user ${userId} (page ${page} of ${totalPages})`);

    res.json({
      data: images,
      pagination: {
        total: totalImages,
        pages: totalPages,
        currentPage: page,
        perPage: limit,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({
      error: 'Failed to fetch user images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new image
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, negativePrompt, color, resolution, guidance, seed, imageUrl, userId } = req.body;

    // Validate required fields
    if (!imageUrl || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate base64 image data
    if (!imageUrl.startsWith('data:image/')) {
      res.status(400).json({ error: 'Invalid image data format' });
      return;
    }

    const image = await prisma.generatedImage.create({
      data: {
        prompt,
        negativePrompt,
        color,
        resolution,
        guidance,
        seed,
        imageUrl,
        userId: parseInt(userId),
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create image' });
  }
});

// Delete image
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const imageId = parseInt(req.params.id);
    await prisma.generatedImage.delete({
      where: {
        id: imageId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export { router };
