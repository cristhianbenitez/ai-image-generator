import SearchIcon from '@assets/icons/search.svg';
import { UserPostCard } from '@components/UserPostCard';

// TODO: Remove this mock data
const USERPOSTS = [
  {
    name: 'Michael Baccin',
    image: 'https://picsum.photos/400/500?random=1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isBookmarked: false,
  },
  {
    name: 'Sarah Johnson',
    image: 'https://picsum.photos/400/300?random=2',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isBookmarked: true,
  },
  {
    name: 'David Chen',
    image: 'https://picsum.photos/400/600?random=3',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isBookmarked: false,
  },
  {
    name: 'Emma Wilson',
    image: 'https://picsum.photos/400/400?random=4',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isBookmarked: true,
  },
  {
    name: 'James Rodriguez',
    image: 'https://picsum.photos/400/350?random=5',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isBookmarked: false,
  },
  {
    name: 'Lisa Thompson',
    image: 'https://picsum.photos/400/450?random=6',
    avatar: 'https://i.pravatar.cc/150?img=6',
    isBookmarked: false,
  },
  {
    name: 'Alex Martinez',
    image: 'https://picsum.photos/400/550?random=7',
    avatar: 'https://i.pravatar.cc/150?img=7',
    isBookmarked: true,
  },
  {
    name: 'Sophie Anderson',
    image: 'https://picsum.photos/400/480?random=8',
    avatar: 'https://i.pravatar.cc/150?img=8',
    isBookmarked: false,
  },
  {
    name: 'Marcus Lee',
    image: 'https://picsum.photos/400/520?random=9',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isBookmarked: true,
  },
  {
    name: 'Isabella Garcia',
    image: 'https://picsum.photos/400/420?random=10',
    avatar: 'https://i.pravatar.cc/150?img=10',
    isBookmarked: false,
  },
];

export const Feed = () => {
  return (
    <section>
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

      <div className="columns-2 md:columns-3 lg:columns-4 max-w-[1064px] pb-10">
        {USERPOSTS.map(post => (
          <UserPostCard key={post.name} {...post} />
        ))}
      </div>
    </section>
  );
};
