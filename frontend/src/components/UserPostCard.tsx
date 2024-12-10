import BookmarkIcon from '@assets/icons/bookmark.svg';
import { useState } from 'react';

export const UserPostCard = ({
  name,
  image,
  avatar,
  isBookmarked,
}: {
  name: string;
  image: string;
  avatar: string;
  isBookmarked: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="w-full max-w-[248px] mb-6 break-inside-avoid">
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
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors duration-200 ease-in-out hover:bg-darkAlt2 ${
            isBookmarked ? 'bg-purple' : 'bg-darkAlt'
          }`}
        >
          <img src={BookmarkIcon} alt="Bookmark icon" />
        </button>
      </div>
    </article>
  );
};
