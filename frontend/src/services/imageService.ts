import { API_ENDPOINTS } from '@config/api';
import type { FormData } from '@types';
import { apiRequest } from '@utils/api';
import { collectionService } from './collectionService';

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const imageService = {
  generateImage: async (formData: FormData): Promise<Blob> => {
    const response = await fetch(API_ENDPOINTS.SEGMIND, {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        negative_prompt: formData.negativePrompt,
        guidance_scale: formData.guidance,
        seed: formData.seed,
        img_width: 1024,
        img_height: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return response.blob();
  },

  saveImageToHistory: async (
    userId: number,
    formData: FormData,
    imageUrl: string,
  ): Promise<void> => {
    try {
      // Convert blob URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      if (blob.size > MAX_IMAGE_SIZE) {
        throw new Error(`Image size (${(blob.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (50MB)`);
      }

      // Convert blob to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      await apiRequest(API_ENDPOINTS.IMAGES, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          prompt: formData.prompt,
          negativePrompt: formData.negativePrompt,
          color: formData.color,
          resolution: formData.resolution,
          guidance: formData.guidance,
          seed: formData.seed,
          imageUrl: base64,
        }),
      });
    } catch (error) {
      throw new Error(`Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  toggleBookmark: async (userId: number, imageId: number): Promise<void> => {
    try {
      // First, get the user's collection to check if the image is already bookmarked
      const collection = await collectionService.getUserCollection(userId);
      const isBookmarked = collection.images?.some(img => img.id === imageId);

      if (isBookmarked) {
        // If already bookmarked, remove it
        await collectionService.removeFromCollection(userId, imageId);
      } else {
        // If not bookmarked, add it
        await collectionService.saveToCollection(userId, imageId);
      }
    } catch (error) {
      throw new Error(`Failed to toggle bookmark: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
