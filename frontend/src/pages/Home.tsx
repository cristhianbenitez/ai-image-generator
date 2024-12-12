import DefaultImage from '@assets/images/box-shapes.png';
import { ImageGeneratorForm } from '@components/ImageGeneratorForm';
import { ImageModal } from '@components/ImageModal';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { handleImageGeneration, setFormData } from '@store/slices/imageSlice';
import { FormEvent, useState } from 'react';

export const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { generatedImage, status, error, formData } = useAppSelector((state) => state.image);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(handleImageGeneration(formData, user?.id ? parseInt(user.id) : undefined));
    } catch (error) {
      // Error will be handled by the image slice
    }
  };

  const handleFormChange = (newFormData: typeof formData) => {
    dispatch(setFormData(newFormData));
  };

  return (
    <section className="h-full w-full flex items-center justify-center">
      <div className="w-full mx-[72px] my-[52px] flex justify-center gap-[30px]">
        <ImageGeneratorForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          isLoading={status === 'loading'}
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
            <div className="text-red-500 text-center p-4">
              <p>Error: {error}</p>
              <p className="text-sm mt-2">Please try again</p>
            </div>
          ) : (
            <>
              <img
                src={generatedImage || DefaultImage}
                alt={formData.prompt || "Preview area"}
                className="w-full h-full object-contain p-4 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              {isModalOpen && (
                <ImageModal
                  isOpen={isModalOpen}
                  imageUrl={generatedImage || DefaultImage}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
