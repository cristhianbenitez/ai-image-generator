import { useAuth, useData } from '@hooks';
export const History = () => {
  const { user } = useAuth();
  const { userImages: images, loading, error } = useData();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray">Please sign in to view your history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
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
    <section className="w-full max-w-[1100px]">
      <h1 className="text-2xl font-normal mb-8">Generation History</h1>
      <div className="flex flex-col gap-10 w-full">
        {images.map(image => (
          <article
            key={image.id}
            className="flex gap-10 w-full border-b border-darkAlt pb-10"
          >
            {/* Image */}
            <div className="w-[327px] h-auto flex-shrink-0 bg-darkAlt rounded-lg p-1">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {/* Details */}
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
                  <h3 className="text-gray text-label mb-2">
                    Input Resolution
                  </h3>
                  <p className="text-white">{image.resolution}</p>
                </div>
              </div>
              <div>
                <h3 className="text-gray text-label mb-2">Seed</h3>
                <p className="text-white">{image.seed}</p>
              </div>
            </div>
          </article>
        ))}
        {images.length === 0 && (
          <div className="text-center text-gray py-8">
            <p>No generation history yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
