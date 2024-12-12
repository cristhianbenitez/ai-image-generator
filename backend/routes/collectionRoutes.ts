import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get user's collection
router.get('/:userId', async (req, res) => {
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
      return res.json({
        id: null,
        userId,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Create or update collection
router.post('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { imageId } = req.body;

    if (!imageId) {
      return res.status(400).json({ error: 'Image ID is required' });
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
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Remove image from collection
router.delete('/:userId/images/:imageId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const imageId = parseInt(req.params.imageId);

    const result = await prisma.$transaction(async (tx) => {
      // Find the collection
      const collection = await tx.collection.findUnique({
        where: { userId },
        include: { images: true }
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Update collection by disconnecting the image
      const updatedCollection = await tx.collection.update({
        where: { id: collection.id },
        data: {
          images: {
            disconnect: { id: imageId }
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

      return updatedCollection;
    });

    res.json(result);
  } catch (error) {
    console.error('Error removing image from collection:', error);
    res.status(500).json({
      error: 'Failed to remove image from collection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router };
