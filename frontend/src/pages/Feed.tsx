import React, { Suspense, useEffect } from 'react';
import Masonry from 'react-masonry-css';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import {
  UserPostCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyFeed,
  SEO
} from '@components';
import { BREAKPOINT_COLUMNS } from '@constants';

export const Feed = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { allImages, loading, error } = useAppSelector(state => state.data);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllData({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!allImages.length)
    return (
      <EmptyFeed
        title="No images yet"
        description="Be the first to create something amazing!"
      />
    );

  return (
    <>
      <SEO
        title="Explore | Ta'anga"
        description="Discover amazing AI-generated artwork created by the Ta'anga community. Get inspired by unique creations and join our creative community."
        keywords="AI art gallery, community artwork, AI image showcase, digital art community, Ta'anga explore"
      />
      <div className="w-full mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Masonry
            breakpointCols={BREAKPOINT_COLUMNS}
            className="flex w-full gap-6 pb-10"
            columnClassName="flex flex-col gap-6"
          >
            {allImages.map(image => (
              <UserPostCard key={image.id} post={image} />
            ))}
          </Masonry>
        </Suspense>
      </div>
    </>
  );
};
