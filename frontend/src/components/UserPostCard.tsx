import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useAuth } from '@hooks';
import { collectionService } from '@services';
import { useState } from 'react';

export const UserPostCard = ({
  id,
  name,
  image,
  avatar,
  isBookmarked: initialIsBookmarked,
  onRemove,
}: {
  id: number;
  name: string;
  image: string;
  avatar: string;
  isBookmarked: boolean;
  onRemove?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleBookmark = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (isBookmarked && onRemove) {
        await collectionService.removeFromCollection(parseInt(user.id), id);
        onRemove();
      } else {
        await collectionService.saveToCollection(parseInt(user.id), id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Failed to handle bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="w-full max-w-[248px] break-inside-avoid">
      <header className="w-full rounded-lg overflow-hidden p-1 bg-darkAlt ">
        {!imageLoaded && (
          <div className="w-full aspect-square bg-darkAlt2 animate-pulse rounded-lg" />
        )}
        <img
          src={image}
          alt=""
          className={`w-full h-auto rounded-lg ${!imageLoaded ? 'hidden' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
      </header>
      <div className="w-full flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <img
            src={avatar}
            alt=""
            className="w-6 h-6 object-cover rounded-full"
          />
          <p className="text-label font-normal">{name}</p>
        </div>
        <button
          onClick={handleBookmark}
          disabled={isLoading || !user}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors duration-200 ease-in-out
            ${isBookmarked ? 'bg-purple' : 'bg-darkAlt hover:bg-darkAlt2'}
            ${!user ? 'opacity-50 cursor-not-allowed' : ''}
            ${isLoading ? 'animate-pulse' : ''}`}
        >
          <img src={BookmarkIcon} alt="Bookmark icon" />
        </button>
      </div>
    </article>
  );
};
