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
          <div className="w-[300px] h-[300px] bg-darkAlt animate-pulse" />
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
          className={`w-[1.75rem] h-[1.75rem] flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 ease-in-out bg-darkAlt hover:bg-darkAlt2 focus:bg-darkAlt2 ${
            isBookmarked ? 'bg-purple' : 'bg-darkAlt'
          }`}
        >
          <img src={BookmarkIcon} alt="Bookmark icon" />
        </button>
      </div>
    </article>
  );
};
