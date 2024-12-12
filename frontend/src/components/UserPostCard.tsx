import React, { FC } from 'react';
import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  saveToCollection,
  removeFromCollection
} from '@store/slices/collectionSlice';
import type { GeneratedImage, User } from '@types';
import { useEffect, useState } from 'react';

interface UserPostCardProps {
  post: GeneratedImage;
  onDelete?: () => void;
}

const BookmarkButton: FC<{
  isBookmarked: boolean;
  isLoading: boolean;
  user: User | null;
  handleBookmark: () => void;
}> = ({ isBookmarked, isLoading, user, handleBookmark }) => (
  <button
    onClick={handleBookmark}
    disabled={isLoading || !user}
    className={`w-7 h-7 flex z-30 items-center justify-center rounded-lg
        ${isBookmarked ? 'bg-purple' : 'bg-darkAlt hover:bg-darkAlt2'}
        ${!user ? 'opacity-50 cursor-not-allowed' : ''}
        ${isLoading ? 'animate-pulse' : ''}`}
    title={user ? 'Bookmark image' : 'Login to bookmark'}
  >
    <img src={BookmarkIcon} alt="Bookmark icon" />
  </button>
);

export const UserPostCard: FC<UserPostCardProps> = ({ post, onDelete }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { images: collectionImages, loading } = useAppSelector(
    state => state.collection
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { id, prompt, imageUrl } = post;

  useEffect(() => {
    // Check if image is in collection
    setIsBookmarked(collectionImages.some(img => img.id === id));
  }, [collectionImages, id]);

  const handleBookmark = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsProcessing(true);
    try {
      if (isBookmarked) {
        const resultAction = await dispatch(
          removeFromCollection({ userId: parseInt(user.id), imageId: id })
        );
        if (removeFromCollection.fulfilled.match(resultAction)) {
          onDelete?.();
        } else if (removeFromCollection.rejected.match(resultAction)) {
          throw new Error(resultAction.error.message);
        }
      } else {
        const resultAction = await dispatch(
          saveToCollection({ userId: parseInt(user.id), imageId: id })
        );
        if (saveToCollection.rejected.match(resultAction)) {
          throw new Error(resultAction.error.message);
        }
      }
    } catch (error) {
      console.error('Failed to handle bookmark:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 top-1/2 bg-gradient-to-t from-black/80 via-black/10 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
          <span className="text-sm text-white flex items-center gap-2 font-medium cursor-default">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-6 h-6 rounded-full"
            />
            {user?.name}
          </span>
          <BookmarkButton
            isBookmarked={isBookmarked}
            isLoading={isProcessing || loading}
            user={user}
            handleBookmark={handleBookmark}
          />
        </div>
      </div>
    </div>
  );
};
