import React, { Suspense, useEffect, useRef, useCallback } from 'react';
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
  const { allImages, loading, error, currentPage, hasMore } = useAppSelector(
    state => state.data
  );

  // Reference for our observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Reference for the loading trigger element
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    dispatch(
      fetchAllData({
        userId: user?.id ? parseInt(user.id) : undefined,
        forceRefresh: true
      })
    );
  }, [dispatch, user?.id]);

  // Handle intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        dispatch(
          fetchAllData({
            userId: user?.id ? parseInt(user.id) : undefined,
            page: currentPage + 1
          })
        );
      }
    },
    [dispatch, hasMore, loading, currentPage, user?.id]
  );

  // Set up the intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // Start loading before reaching the end
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (loadingTriggerRef.current) {
      observerRef.current.observe(loadingTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  let content;
  if (error) {
    content = <ErrorMessage message={error} />;
  } else if (!allImages?.length && !loading) {
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

          {/* Loading trigger element */}
          <div
            ref={loadingTriggerRef}
            className="w-full h-10 flex items-center justify-center"
          >
            {loading && <LoadingSpinner size="small" />}
          </div>
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
