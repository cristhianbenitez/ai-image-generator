import SearchIcon from '@assets/icons/search.svg';
import { UserPostCard } from '@components';
import { useData } from '@hooks';
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const Feed = () => {
  const { allImages, loading, error } = useData();

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="">
      <form
        role="search-bar"
        className="w-full px-4 py-2 h-[48px] max-w-lg flex items-center gap-2 bg-darkAlt rounded-lg text-white font-normal mb-10"
      >
        <input
          type="search"
          placeholder="Search"
          className="w-full h-full bg-transparent outline-none"
        />
        <button className="bg-primary text-whiterounded-lg">
          <img src={SearchIcon} alt="Search" />
        </button>
      </form>

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-full max-w-[1064px] gap-6 pb-10"
        columnClassName="flex flex-col gap-6"
      >
        {allImages.map(image => (
          <UserPostCard
            key={image.id}
            name={image.user.name}
            image={image.imageUrl}
            avatar={
              image.user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                image.user.name,
              )}`
            }
            isBookmarked={false}
          />
        ))}
      </Masonry>
    </section>
  );
};
