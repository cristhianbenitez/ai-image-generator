import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUserCollection } from '@store/slices/collectionSlice';
import {
  UserPostCard,
  LoadingSpinner,
  NoAuthMessage,
  ErrorMessage,
  EmptyFeed
} from '@components';

export const Collection = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { images, loading, error, isInitialized } = useAppSelector(
    (state) => state.collection
  );

  useEffect(() => {
    if (user?.id && !isInitialized) {
      dispatch(fetchUserCollection(parseInt(user.id)));
    }
  }, [dispatch, user?.id, isInitialized]);

  if (!user) return <NoAuthMessage />;
  if (loading && !isInitialized) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!images.length)
    return (
      <EmptyFeed
        title="Your collection is empty"
        description="Start saving images to your collection!"
      />
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <UserPostCard key={image.id} post={image} />
        ))}
      </div>
    </div>
  );
};
