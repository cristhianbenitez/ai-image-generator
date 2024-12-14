import React, { FC, useState, useMemo } from 'react';

import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  toggleBookmark,
  makeSelectBookmarkStatus
} from '@store/slices/imageSlice';
import { openAuthModal } from '@store/slices/authSlice';
import type { GeneratedImage } from '@types';
import { RootState } from '@store';
import { ImageDetailsModal } from './ImageDetailsModal';

interface UserPostCardProps {
  post: GeneratedImage;
  onDelete?: () => void;
}

interface BookmarkButtonProps {
  isBookmarked: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  handleBookmark: () => void;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({
  isBookmarked,
  isLoading,
  isAuthenticated,
  handleBookmark
}) => (
  <button
    onClick={e => {
      e.stopPropagation();
      handleBookmark();
    }}
    disabled={isLoading}
    className={`w-7 h-7 flex z-30 items-center justify-center rounded-lg
        ${isBookmarked || isLoading ? 'bg-purple' : 'bg-darkAlt hover:bg-darkAlt2'}`}
    title={isAuthenticated ? 'Bookmark image' : 'Login to bookmark'}
  >
    <img src={BookmarkIcon} alt="Bookmark icon" />
  </button>
);

export const UserPostCard: FC<UserPostCardProps> = ({ post, onDelete }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  // Create memoized selector instance
  const selectBookmarkStatus = useMemo(makeSelectBookmarkStatus, []);

  // Use memoized selector
  const bookmarkStatus = useAppSelector(state =>
    selectBookmarkStatus(state, post)
  );

  const { id, prompt, imageUrl } = post;

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal());
      return;
    }

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

  const handleCardClick = () => {
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <div
        className="relative cursor-pointer rounded-lg overflow-hidden"
        onClick={handleCardClick}
      >
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 top-1/2 bg-gradient-to-t from-black/80 via-black/10 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
            <span
              className="text-sm text-white flex items-center gap-2 font-medium cursor-default"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-6 h-6 rounded-full"
              />
              {post.user.name}
            </span>
            <BookmarkButton
              isBookmarked={bookmarkStatus.isBookmarked}
              isLoading={bookmarkStatus.isLoading}
              isAuthenticated={isAuthenticated}
              handleBookmark={handleBookmark}
            />
          </div>
        </div>
      </div>

      <ImageDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        image={post}
      />
    </>
  );
};
