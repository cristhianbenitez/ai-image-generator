import { API_ENDPOINTS } from '@config/api';
import type { GeneratedImage } from '@types';
import { useEffect, useState } from 'react';

export const useUserImages = (userId: string | undefined) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          API_ENDPOINTS.USER_IMAGES(parseInt(userId)),
          {
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user images');
        }

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [userId]);

  return { images, loading, error };
};
