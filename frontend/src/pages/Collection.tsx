import { UserPostCard } from '@/components/UserPostCard';
import type { GeneratedImage } from '@/types/data';
import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@hooks';
import { useEffect, useState } from 'react';

interface CollectionImage extends GeneratedImage {
  user: {
    name: string;
    avatar: string;
  };
}

interface CollectionData {
  id: number;
  userId: number;
  images: CollectionImage[];
}

export const Collection = () => {
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCollection = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_ENDPOINTS.COLLECTIONS}/${user.id}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch collection');
        }

        const data = await response.json();
        // Since we get an array from findMany, take the first item
        setCollection(data[0] || { id: 0, userId: user.id, images: [] });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [user]);

  const handleRemoveImage = (imageId: number) => {
    if (!collection) return;

    setCollection({
      ...collection,
      images: collection.images.filter(img => img.id !== imageId),
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray">Please sign in to view your collection</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-title text-heading font-semibold">My Collection</h2>
      {collection && collection.images.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 max-w-[1064px] pb-10">
          {collection.images.map(image => (
            <UserPostCard
              key={image.id}
              id={image.id}
              name={image.user.name}
              image={image.imageUrl}
              avatar={
                image.user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  image.user.name,
                )}`
              }
              isBookmarked={true}
              onRemove={() => handleRemoveImage(image.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No images in collection yet</p>
      )}
    </section>
  );
};
