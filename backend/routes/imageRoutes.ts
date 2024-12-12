import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get all images
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

    const images = await prisma.generatedImage.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get user's images
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const images = await prisma.generatedImage.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
});

// Create new image
router.post('/', async (req, res) => {
  try {
    const { prompt, negativePrompt, color, resolution, guidance, seed, imageUrl, userId } = req.body;

    // Validate required fields
    if (!imageUrl || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate base64 image data
    if (!imageUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image data format' });
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
router.delete('/:id', async (req, res) => {
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
