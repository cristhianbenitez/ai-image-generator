import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUserCollection } from '@store/slices/collectionSlice';
import {
  UserPostCard,
  LoadingSpinner,
  NoAuthMessage,
  ErrorMessage,
  EmptyFeed,
  SEO
} from '@components';

export const Collection = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { images, loading, error, isInitialized } = useAppSelector(
    state => state.collection
  );

  useEffect(() => {
    if (user?.id && !isInitialized) {
      dispatch(fetchUserCollection(parseInt(user.id)));
    }
  }, [dispatch, user?.id, isInitialized]);

  let content;
  if (!user) {
    content = <NoAuthMessage />;
  } else if (loading && !isInitialized) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorMessage message={error} />;
  } else if (!images.length) {
    content = (
      <EmptyFeed
        title="Your collection is empty"
        description="Start saving images to your collection!"
      />
    );
  } else {
    content = (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(image => (
            <UserPostCard key={image.id} post={image} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Collection | Ta'anga"
        description="View and manage your saved AI-generated artwork collection. Organize and revisit your favorite pieces created with Ta'anga."
        keywords="AI art collection, saved artwork, digital art portfolio, Ta'anga collection"
      />
      {content}
    </>
  );
};
