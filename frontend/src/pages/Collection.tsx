import { ErrorMessage, LoadingSpinner, UserPostCard } from '@components';
import { BREAKPOINT_COLUMNS } from '@constants';
import { useInitializeData } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCollection, removeImage } from '@store/slices/collectionSlice';
import { lazy, Suspense, useEffect } from 'react';
// Lazy load Masonry component since it's a third-party library
const Masonry = lazy(() => import('react-masonry-css'));

const NoAuthMessage = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <p className="text-gray">Please sign in to view your collection</p>
  </div>
);

export const Collection = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { collection, loading, error } = useAppSelector(
    state => state.collection,
  );
  const { isInitialized } = useInitializeData();

  useEffect(() => {
    if (user && isInitialized) {
      dispatch(fetchCollection(user.id));
    }
  }, [dispatch, user, isInitialized]);

  const handleRemoveImage = (imageId: number) => {
    dispatch(removeImage(imageId));
  };

  if (!user) return <NoAuthMessage />;
  if (loading && !collection) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-title text-heading font-semibold">My Collection</h2>


      {collection && collection.images.length > 0 ? (
     <Suspense fallback={<LoadingSpinner />}>
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className="flex w-full gap-6 pb-10"
          columnClassName="flex flex-col gap-6"
        >
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
              variant="collection"
            />
          ))}
        </Masonry>
      </Suspense>
      ) : (
        <p className="text-center text-gray-400">No images in collection yet</p>
      )}

    </section>
  );
};
