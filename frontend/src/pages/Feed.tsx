import SearchIcon from '@assets/icons/search.svg';
import { UserPostCard } from '@components';
import { useData } from '@hooks';

export const Feed = () => {
  const { allImages, loading, error } = useData();

  return (
    <section className="w-full">
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

      {loading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red text-center">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 max-w-[1100px] pb-10">
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
        </div>
      )}
    </section>
  );
};
