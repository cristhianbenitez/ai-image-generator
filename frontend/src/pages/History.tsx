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
      <h1 className="text-heading font-semibold mb-8">Generation History</h1>
      <div className="grid gap-6">
        {images.map(image => (
          <article
            key={image.id}
            className="bg-darkAlt rounded-lg p-6 flex gap-6"
          >
            <div className="w-[200px] h-[200px] flex-shrink-0">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <h3 className="text-label font-semibold mb-2">Prompt</h3>
                <p className="text-white">{image.prompt}</p>
              </div>
              {image.negativePrompt && (
                <div>
                  <h3 className="text-label font-semibold mb-2">
                    Negative Prompt
                  </h3>
                  <p className="text-gray">{image.negativePrompt}</p>
                </div>
              )}
              <div className="flex gap-6">
                <div>
                  <h3 className="text-label font-semibold mb-2">Resolution</h3>
                  <p className="text-gray">{image.resolution}</p>
                </div>
                {image.color && (
                  <div>
                    <h3 className="text-label font-semibold mb-2">
                      Color Theme
                    </h3>
                    <p className="text-gray">{image.color}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-label font-semibold mb-2">
                    Guidance Scale
                  </h3>
                  <p className="text-gray">{image.guidance}</p>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-small text-gray">
                  Generated on{' '}
                  {new Date(image.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
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
