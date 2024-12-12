import React, { FC } from 'react';

import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleBookmark } from '@store/slices/imageSlice';
import type { GeneratedImage, User } from '@types';
import { RootState } from '@store';

interface UserPostCardProps {
  post: GeneratedImage;
  onDelete?: () => void;
}

interface BookmarkButtonProps {
  isBookmarked: boolean;
  isLoading: boolean;
  user: User | null;
  handleBookmark: () => void;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  isBookmarked,
  isLoading,
  user,
  handleBookmark
}) => (
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
  const { user } = useAppSelector((state: RootState) => state.auth);
  const bookmarkStatus = useAppSelector(
    (state: RootState) => state.image.bookmarkStatus[post.id]
  );

  const { id, prompt, imageUrl } = post;

  const handleBookmark = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      await dispatch(
        toggleBookmark({
          imageId: id,
          userId: parseInt(user.id)
        })
      ).unwrap();

      // If this is being called from a collection view and the image was unbookmarked
      if (onDelete && !bookmarkStatus?.isBookmarked) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to handle bookmark:', error);
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
            isBookmarked={bookmarkStatus?.isBookmarked || false}
            isLoading={bookmarkStatus?.isLoading || false}
            user={user}
            handleBookmark={handleBookmark}
          />
        </div>
      </div>
    </div>
  );
};
