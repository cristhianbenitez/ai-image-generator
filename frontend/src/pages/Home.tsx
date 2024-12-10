import DefaultImage from '@assets/images/box-shapes.png';
import { ImageGeneratorForm, ImageModal } from '@components';
import { useImage } from '@hooks';
import { FormEvent, useState } from 'react';

export const Home = () => {
  const {
    generatedImage,
    status,
    error,
    generateImage,
    formData,
    setFormData,
  } = useImage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    generateImage(formData);
  };

  return (
    <section className="h-full w-full flex items-center justify-center">
      <div className="w-full mx-[72px] my-[52px] flex justify-center gap-[30px] ">
        <ImageGeneratorForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />

        <div className="max-w-[511px] w-full h-[511px] bg-darkAlt rounded-lg flex items-center justify-center relative">
          {status === 'loading' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
              <p className="text-gray text-sm">
                Generating image... This may take a minute
              </p>
            </div>
          ) : error ? (
            <div className="text-red text-center p-4">
              <p>Error: {error}</p>
              <p className="text-sm mt-2">Please try again</p>
            </div>
          ) : (
            <>
              <img
                src={generatedImage || DefaultImage}
                alt="Preview area"
                className="w-full h-full object-contain p-4 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              <ImageModal
                isOpen={isModalOpen}
                imageUrl={generatedImage || DefaultImage}
                onClose={() => setIsModalOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
