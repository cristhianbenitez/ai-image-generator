import { Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import {
  UserPostCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyFeed
} from '@components';
import Masonry from 'react-masonry-css';
import { BREAKPOINT_COLUMNS } from '@constants';

export const Feed = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { allImages, loading, error } = useAppSelector((state) => state.data);

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
    <div className="w-full mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className="flex w-full gap-6 pb-10"
          columnClassName="flex flex-col gap-6"
        >
          {allImages.map((image) => (
            <UserPostCard key={image.id} post={image} />
          ))}
        </Masonry>
      </Suspense>
    </div>
  );
};
