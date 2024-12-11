import { ErrorMessage, LoadingSpinner, UserPostCard } from '@components';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCollection, removeImage } from '@store/slices/collectionSlice';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (user) {
      dispatch(fetchCollection(user.id));
    }
  }, [dispatch, user]);

  const handleRemoveImage = (imageId: number) => {
    dispatch(removeImage(imageId));
  };

  if (!user) return <NoAuthMessage />;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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
              variant="collection"
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No images in collection yet</p>
      )}
    </section>
  );
};
