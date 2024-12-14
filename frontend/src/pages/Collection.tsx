import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { UserPostCard, SEO } from '@components';
import { toggleBookmark } from '@store/slices/imageSlice';
import { removeImageFromCollection } from '@store/slices/collectionSlice';

export const Collection = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { collection } = useAppSelector(state => state.collection);

  const handleBookmarkToggle = async (imageId: number) => {
    if (!user?.id) return;

    try {
      await dispatch(
        toggleBookmark({
          imageId,
          userId: parseInt(user.id)
        })
      ).unwrap();

      // Remove the image from the collection in the UI
      dispatch(removeImageFromCollection(imageId));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <>
      <SEO
        title="Collection | Ta'anga"
        description="View your saved artwork collection on Ta'anga. Browse and manage your favorite AI-generated images."
        keywords="AI art collection, saved artwork, image gallery, Ta'anga collection"
      />
      <section className="w-full p-8">
        <h1 className="text-2xl font-bold mb-6">Your Collection</h1>
        {collection?.images?.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            Your collection is empty. Bookmark some images to see them here!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection?.images?.map(image => (
              <UserPostCard
                key={image.id}
                post={image}
                onBookmarkToggle={() => handleBookmarkToggle(image.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};
