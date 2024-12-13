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
    dispatch(fetchAllData({ userId: user?.id ? parseInt(user.id) : undefined }));
  }, [dispatch, user?.id]);

  let content;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorMessage message={error} />;
  } else if (!allImages.length) {
    content = (
      <EmptyFeed
        title="No images yet"
        description="Be the first to create something amazing!"
      />
    );
  } else {
    content = (
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
    );
  }

  return (
    <>
      <SEO
        title="Explore | Ta'anga"
        description="Discover amazing AI-generated artwork created by the Ta'anga community. Get inspired by unique creations and join our creative community."
        keywords="AI art gallery, community artwork, AI image showcase, digital art community, Ta'anga explore"
      />
      {content}
    </>
  );
};
