import React, { FormEvent, useState, useEffect } from 'react';

import { ImageGeneratorForm, ImageModal, SEO } from '@components';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  handleImageGeneration,
  setFormData,
  resetForm
} from '@store/slices/imageSlice';

// Import the image directly for type checking
import DefaultImage from '@assets/images/box-shapes.png';

export const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { generatedImage, status, error, formData } = useAppSelector(
    state => state.image
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only reset form when leaving the app, not when navigating between pages
  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(resetForm());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        handleImageGeneration(
          formData,
          user?.id ? parseInt(user.id) : undefined
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormChange = (newFormData: typeof formData) => {
    dispatch(setFormData(newFormData));
  };

  // Use regular img for loading state to avoid optimization overhead
  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
          <p className="text-gray text-sm">
            Generating image... This may take a minute
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try again</p>
        </div>
      );
    }

    // Use the imported default image or the generated image
    const currentImage = generatedImage || DefaultImage;

    return (
      <>
        <img
          src={currentImage}
          alt={formData.prompt || 'Preview area'}
          className="w-full h-full object-contain p-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        {isModalOpen && (
          <ImageModal
            isOpen={isModalOpen}
            imageUrl={currentImage}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  };

  return (
    <>
      <SEO
        title="Home | Ta'anga"
        description="Transform your ideas into stunning artwork with Ta'anga's AI image generator. Create unique, high-quality images from text descriptions instantly."
        keywords="AI art generator, text to image, AI artwork creator, digital art generator, Ta'anga home"
      />
      <section className="h-full w-full flex items-center justify-center">
        <div className="w-full mx-[72px] my-[52px] flex justify-center gap-[30px]">
          <ImageGeneratorForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />

          <div className="max-w-[511px] w-full h-[511px] bg-darkAlt rounded-lg flex items-center justify-center relative">
            {renderContent()}
          </div>
        </div>
      </section>
    </>
  );
};
