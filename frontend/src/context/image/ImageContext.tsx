import { useAuth, useData } from '@hooks';
import { imageService } from '@services/imageService';
import type { FormData, GenerationStatus, ImageContextType } from '@types';
import { imageUtils } from '@utils/imageUtils';
import React, { createContext, useState } from 'react';

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const defaultFormData: FormData = {
  prompt: '',
  negativePrompt: '',
  color: '',
  resolution: '1024 × 1024 (1:1)',
  guidance: 7.0,
  seed: Math.floor(Math.random() * 2147483647),
};

const ImageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { refetchData } = useData();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const generateImage = async (formData: FormData) => {
    setStatus('loading');
    setError(null);

    try {
      const blob = await imageService.generateImage(formData);
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setStatus('success');

      if (user) {
        try {
          const base64Image = await imageUtils.convertBlobToBase64(blob);
          await imageService.saveImageToHistory(
            parseInt(user.id),
            formData,
            base64Image,
          );
          await refetchData();
        } catch (saveError) {
          console.error('Failed to save image:', saveError);
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

  const value = {
    generatedImage,
    status,
    error,
    formData,
    setFormData,
    generateImage,
    resetImage,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export { ImageContext, ImageProvider };
