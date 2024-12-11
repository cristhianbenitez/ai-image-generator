import {
  EmptyHistory,
  ErrorMessage,
  LoadingSpinner,
  NoAuthMessage,
} from '@components';
import { useData } from '@hooks';
import { useAppSelector } from '@store/hooks';
import type { GeneratedImage } from '@types';

const HistoryItem = ({ image }: { image: GeneratedImage }) => (
  <article className="flex gap-10 w-full border-b border-darkAlt pb-10">
    <div className="w-[327px] h-auto flex-shrink-0 bg-darkAlt rounded-lg p-1">
      <img
        src={image.imageUrl}
        alt={image.prompt}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
    <div className="flex flex-col gap-6 flex-grow">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-gray text-label mb-2">Prompt details</h3>
          <p className="text-white">{image.prompt}</p>
        </div>
        <div>
          <h3 className="text-gray text-label mb-2">Negative prompt</h3>
          <p className="text-gray">{image.negativePrompt || 'Null'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-gray text-label mb-2">Created on</h3>
          <p className="text-white">
            {new Date(image.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div>
          <h3 className="text-gray text-label mb-2">Input Resolution</h3>
          <p className="text-white">{image.resolution}</p>
        </div>
      </div>
      <div>
        <h3 className="text-gray text-label mb-2">Seed</h3>
        <p className="text-white">{image.seed}</p>
      </div>
    </div>
  </article>
);

export const History = () => {
  const user = useAppSelector(state => state.auth.user);
  const { userImages: images, loading, error } = useData();

  if (!user) return <NoAuthMessage />;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="w-full max-w-[1100px]">
      <h1 className="text-2xl font-normal mb-8">Generation History</h1>
      <div className="flex flex-col gap-10 w-full">
        {images.length === 0 ? (
          <EmptyHistory />
        ) : (
          images.map(image => <HistoryItem key={image.id} image={image} />)
        )}
      </div>
    </section>
  );
};
