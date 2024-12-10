import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@hooks';
import type { DataContextType, GeneratedImage } from '@types';
import { createContext, useEffect, useState } from 'react';

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [allImages, setAllImages] = useState<GeneratedImage[]>([]);
  const [userImages, setUserImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all images
      const allImagesResponse = await fetch(API_ENDPOINTS.IMAGES, {
        credentials: 'include',
      });

      if (!allImagesResponse.ok) {
        throw new Error('Failed to fetch images');
      }

      const allImagesData = await allImagesResponse.json();
      setAllImages(allImagesData);

      // Fetch user images if user is logged in
      if (user) {
        const userImagesResponse = await fetch(
          API_ENDPOINTS.USER_IMAGES(parseInt(user.id)),
          {
            credentials: 'include',
          },
        );

        if (!userImagesResponse.ok) {
          throw new Error('Failed to fetch user images');
        }

        const userImagesData = await userImagesResponse.json();
        setUserImages(userImagesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [user?.id]);

  const value = {
    allImages,
    userImages,
    loading,
    error,
    refetchData: fetchAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
