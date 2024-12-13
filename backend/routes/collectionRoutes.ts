import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get user's collection
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const collection = await prisma.collection.findUnique({
      where: {
        userId: userId,
      },
      include: {
        images: {
          include: {
            user: true,
          },
        },
      },
    });

    // If no collection exists, return an empty collection object
    if (!collection) {
      res.json({
        id: null,
        userId,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return;
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Create or update collection
router.post('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const { imageId } = req.body;

    if (!imageId) {
      res.status(400).json({ error: 'Image ID is required' });
      return;
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Find or create collection
      let collection = await tx.collection.findUnique({
        where: { userId },
        include: { images: true }
      });

      if (!collection) {
        collection = await tx.collection.create({
          data: {
            userId,
            images: {
              connect: { id: imageId }
            }
          },
          include: { images: true }
        });
      } else {
        // Check if image is already in collection
        const imageExists = collection.images.some(img => img.id === imageId);

        if (!imageExists) {
          collection = await tx.collection.update({
            where: { id: collection.id },
            data: {
              images: {
                connect: { id: imageId }
              }
            },
            include: { images: true }
          });
        }
      }

      return collection;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Remove image from collection
router.delete('/:userId/images/:imageId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const imageId = parseInt(req.params.imageId);

    // First, verify the collection exists and belongs to the user
    const collection = await prisma.collection.findUnique({
      where: { userId },
      include: { images: true }
    });

    if (!collection) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    // Check if the image is in the collection
    const imageExists = collection.images.some(img => img.id === imageId);

    if (!imageExists) {
      res.status(404).json({ error: 'Image not found in collection' });
      return;
    }

    try {
      // Update collection by disconnecting the image
      const updatedCollection = await prisma.collection.update({
        where: {
          id: collection.id,
          userId: userId // Additional check to ensure user ownership
        },
        data: {
          images: {
            disconnect: [{ id: imageId }]
          }
        },
        include: {
          images: {
            include: {
              user: true
            }
          }
        }
      });

      res.json(updatedCollection);
    } catch (updateError) {
      throw updateError;
    }

  } catch (error) {
    res.status(500).json({
      error: 'Failed to remove image from collection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router };
