import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  saveToCollection,
  removeFromCollection
} from '@store/slices/collectionSlice';
import type { GeneratedImage } from '@types';
import { useEffect, useState } from 'react';

interface UserPostCardProps {
  post: GeneratedImage;
  onDelete?: () => void;
}

export const UserPostCard = ({ post, onDelete }: UserPostCardProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { images: collectionImages } = useAppSelector(
    (state) => state.collection
  );
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { id, prompt, imageUrl } = post;

  useEffect(() => {
    // Check if image is in collection
    setIsBookmarked(collectionImages.some((img) => img.id === id));
  }, [collectionImages, id]);

  const handleBookmark = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      if (isBookmarked) {
        await dispatch(
          removeFromCollection({ userId: parseInt(user.id), imageId: id })
        ).unwrap();
      } else {
        await dispatch(
          saveToCollection({ userId: parseInt(user.id), imageId: id })
        ).unwrap();
      }
    } catch (error) {
      console.error('Failed to handle bookmark:', error);
    }
  };

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-lg">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-sm mb-2">{prompt}</p>
          <div className="flex justify-between items-center">
            <button
              onClick={handleBookmark}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              {isBookmarked ? (
                <div className="w-6 h-6">
                  <img src={BookmarkIcon} alt="Bookmark" />
                </div>
              ) : (
                <div className="w-6 h-6">
                  <img src={BookmarkIcon} alt="Bookmark" />
                </div>
              )}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-white hover:text-red-500 transition-colors"
              >
                delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
