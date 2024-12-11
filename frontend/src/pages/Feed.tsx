import SearchIcon from '@assets/icons/search.svg';
import { ErrorMessage, LoadingSpinner, UserPostCard } from '@components';
import { BREAKPOINT_COLUMNS } from '@constants';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import { lazy, Suspense, useCallback } from 'react';
// Lazy load Masonry component since it's a third-party library
const Masonry = lazy(() => import('react-masonry-css'));

export const Feed = () => {
  const dispatch = useAppDispatch();
  const { allImages, loading, error } = useAppSelector(state => state.data);

  const handleBookmarkChange = useCallback(() => {
    dispatch(fetchAllData(true));
  }, [dispatch]);

  if (loading && allImages.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="max-w-[1064px] mx-auto">
      <form
        role="search-bar"
        className="w-full px-4 py-2 h-[48px] max-w-lg flex items-center gap-2 bg-darkAlt rounded-lg text-white font-normal mb-10"
      >
        <input
          type="search"
          placeholder="Search"
          className="w-full h-full bg-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-primary text-white rounded-lg"
          aria-label="Search"
        >
          <img src={SearchIcon} alt="" width="24" height="24" />
        </button>
      </form>

      <Suspense fallback={<LoadingSpinner />}>
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className="flex w-full gap-6 pb-10"
          columnClassName="flex flex-col gap-6"
        >
          {allImages.map(image => (
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
              isBookmarked={image.isBookmarked}
              onBookmarkChange={handleBookmarkChange}
              variant="feed"
            />
          ))}
        </Masonry>
      </Suspense>
    </section>
  );
};
