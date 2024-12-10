import React, { useState } from 'react';
import {
  GenerationStatus,
  ImageContext,
  ImageContextType,
} from './ImageContext.types';

type FormData = {
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const queryAPI = async (formData: FormData): Promise<Blob> => {
    const coloredPrompt = formData.color
      ? `${
          formData.prompt
        }, ${formData.color.toLowerCase()} color theme, ${formData.color.toLowerCase()} tones`
      : formData.prompt;

    const response = await fetch('https://api.segmind.com/v1/ssd-1b', {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: coloredPrompt,
        negative_prompt: formData.negativePrompt,
        guidance_scale: formData.guidance,
        width: parseInt(formData.resolution.split('×')[0].trim()),
        height: parseInt(
          formData.resolution.split('×')[1].split(' ')[0].trim(),
        ),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    return response.blob();
  };

  const generateImage = async (formData: FormData) => {
    setStatus('loading');
    setError(null);

    try {
      const blob = await queryAPI(formData);
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setStatus('success');
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
