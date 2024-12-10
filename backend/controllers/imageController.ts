import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { ImageService } from '../services/imageService.ts';

const imageService = new ImageService();

interface SaveImageRequest {
  userId: number;
  prompt: string;
  negativePrompt?: string;
  color?: string;
  resolution: string;
  guidance: number;
  imageUrl: string;
}

export class ImageController {
  async saveImage(context: Context) {
    try {
      const body = await context.request.body('json').value as SaveImageRequest;
      const savedImage = await imageService.saveGeneratedImage(body);
      context.response.body = savedImage;
    } catch (error) {
      context.response.status = 500;
      context.response.body = { error: error.message };
    }
  }

  async getUserImages(context: Context) {
    const userId = context.params.userId;

    try {
      const images = await imageService.getUserImages(Number(userId));
      context.response.body = images;
    } catch (error) {
      context.response.status = 500;
      context.response.body = { error: error.message };
    }
  }
}
