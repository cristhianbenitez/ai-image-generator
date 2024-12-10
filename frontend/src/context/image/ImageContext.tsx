import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@hooks';
import React, { createContext, useState } from 'react';

import type { FormData, GenerationStatus, ImageContextType } from '@types';

export const ImageContext = createContext<ImageContextType | undefined>(
  undefined,
);

// Utility functions for image processing
const imageUtils = {
  convertBlobToBase64: async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  },

  createColoredPrompt: (prompt: string, color: string | null): string => {
    if (!color) return prompt;
    return `${prompt}, ${color.toLowerCase()} color theme, ${color.toLowerCase()} tones`;
  },

  parseResolution: (resolution: string): { width: number; height: number } => {
    const [width, heightWithRatio] = resolution.split('×');
    const height = heightWithRatio.split(' ')[0];
    return {
      width: parseInt(width.trim()),
      height: parseInt(height.trim()),
    };
  },
};

// API related functions
const apiService = {
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
        width,
        height,
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
      // const apiUrl = import.meta.env.DEV
      //   ? import.meta.env.VITE_API_URL_LOCAL
      //   : import.meta.env.VITE_API_URL;

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

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (formData: FormData) => {
    setStatus('loading');
    setError(null);

    try {
      // Generate the image
      const blob = await apiService.generateImage(formData);
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setStatus('success');

      // Save to history if user is authenticated
      if (user) {
        try {
          const base64Image = await imageUtils.convertBlobToBase64(blob);
          await apiService.saveImageToHistory(
            parseInt(user.id),
            formData,
            base64Image,
          );
        } catch (saveError) {
          console.error('Failed to save image:', saveError);
          // Don't set error state here as the image generation was successful
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to generate image',
      );
      setStatus('error');
    }
  };

  const resetImage = () => {
    setGeneratedImage(null);
    setStatus('idle');
    setError(null);
  };

  const value: ImageContextType = {
    generatedImage,
    status,
    error,
    generateImage,
    resetImage,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};
