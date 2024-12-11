import { API_ENDPOINTS } from '@config/api';
import type { FormData } from '@types';
import { imageUtils } from '@utils/imageUtils';

export const imageService = {
  generateImage: async (formData: FormData): Promise<Blob> => {
    const coloredPrompt = imageUtils.createColoredPrompt(
      formData.prompt,
      formData.color,
    );
    const { width, height } = imageUtils.parseResolution(formData.resolution);

    const response = await fetch(API_ENDPOINTS.SEGMIND, {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: coloredPrompt,
        negative_prompt: formData.negativePrompt,
        guidance_scale: formData.guidance,
        seed: formData.seed,
        img_width: width,
        img_height: height,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    return response.blob();
  },

  saveImageToHistory: async (
    userId: number,
    formData: FormData,
    imageData: string,
  ): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.IMAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: window.location.origin,
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          userId,
          prompt: formData.prompt,
          negativePrompt: formData.negativePrompt,
          color: formData.color,
          resolution: formData.resolution,
          guidance: formData.guidance,
          seed: formData.seed,
          imageUrl: imageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ''
          }`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save image:', errorMessage);
      throw error;
    }
  },
};
