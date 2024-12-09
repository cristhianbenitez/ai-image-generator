import { UserPostCard } from '@/components/UserPostCard';

const COLLECTION_POSTS = [
  {
    name: 'Michael Baccin',
    image: 'https://picsum.photos/400/500?random=1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isBookmarked: true,
  },
  {
    name: 'Sarah Johnson',
    image: 'https://picsum.photos/400/300?random=2',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isBookmarked: true,
  },
];

export const Collection = () => {
  return (
    <section className="flex flex-col gap-8">
      <h2 className=" text-title text-heading font-semibold">My Collection</h2>
      <div className="columns-2 md:columns-3 lg:columns-4 max-w-[1064px] pb-10">
        {COLLECTION_POSTS.map(post => (
          <UserPostCard key={post.name} {...post} />
        ))}
      </div>
    </section>
  );
};
