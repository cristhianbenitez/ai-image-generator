import React, { Suspense, useEffect, useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';

import searchIcon from '@assets/icons/search.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import {
  UserPostCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyFeed,
  SEO,
  FeedSkeleton
} from '@components';
import { BREAKPOINT_COLUMNS } from '@constants';

export const Feed = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const {
    allImages,
    loading,
    error,
    currentPage,
    hasMore,
    isInitialized,
    lastFetched
  } = useAppSelector(state => state.data);

  // Reference for our observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Reference for the loading trigger element
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    const shouldFetchData = !lastFetched || !isInitialized;

    if (shouldFetchData) {
      dispatch(
        fetchAllData({
          userId: user?.id,
          forceRefresh: false
        })
      );
    }
  }, [dispatch, user?.id, lastFetched, isInitialized]);

  // Handle intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        dispatch(
          fetchAllData({
            userId: user?.id,
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
  } else if (!isInitialized || (loading && !allImages.length)) {
    // Show skeleton loader for initial load or when we have no images and are loading
    content = <FeedSkeleton />;
  } else if (!allImages?.length) {
    // Only show empty state when we're not loading and have no images
    content = (
      <EmptyFeed
        title="No images yet"
        description="Be the first to create something amazing!"
      />
    );
  } else {
    content = (
      <div className="w-full mx-auto px-4 py-8">
        {/* TODO: Add search functionality */}
        <div className="relative mb-6 max-w-[512px]">
          <input
            type="text"
            placeholder="Search images by keywords"
            className="w-full px-4 py-3 bg-transparent border-2 border-darkAlt rounded-lg text-white placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-[#7B61FF]"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Search"
          >
            <img src={searchIcon} alt="Search icon" />
          </button>
        </div>

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

          {/* Loading trigger element for infinite scroll */}
          <div
            ref={loadingTriggerRef}
            className="w-full h-10 flex items-center justify-center"
          >
            {loading && hasMore && (
              <LoadingSpinner size="small" message="Loading more..." />
            )}
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
