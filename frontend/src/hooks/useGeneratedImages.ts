import { API_ENDPOINTS } from '@config/api';
import { useEffect, useState } from 'react';

interface GeneratedImage {
  id: number;
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
  imageUrl: string;
  createdAt: string;
  userId: number;
  user: {
    name: string;
    avatar: string;
  };
}

export const useGeneratedImages = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.IMAGES}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading, error };
};
