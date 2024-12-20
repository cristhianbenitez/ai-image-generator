import React, { FormEvent, useState, useEffect } from 'react';

import { ErrorMessage, ImageGeneratorForm, ImageModal, SEO } from '@components';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  generateImage,
  saveImageToHistory,
  setFormData,
  resetForm
} from '@store/slices/imageSlice';
import { addNewImage } from '@store/slices/dataSlice';
import { fetchUserCollection } from '@store/slices/collectionSlice';

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
      // Generate image for all users
      const result = await dispatch(generateImage(formData)).unwrap();

      // If user is logged in, save to history and update feed
      if (user?.id) {
        try {
          const userId = parseInt(user.id);
          const savedImage = await dispatch(
            saveImageToHistory({
              userId,
              formData,
              imageUrl: result
            })
          ).unwrap();

          // Add the new image to the feed
          await dispatch(addNewImage(savedImage));

          // Optionally refresh collection
          await dispatch(fetchUserCollection(userId));
        } catch (error) {
          console.error('Failed to save image:', error);
        }
      }
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  const handleFormChange = (newFormData: typeof formData) => {
    dispatch(setFormData(newFormData));
  };

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
      return <ErrorMessage message={error} />;
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
      <section className="h-full w-full flex flex-col md:flex-row items-center md:justify-center">
        <div className="w-full flex flex-col md:flex-row justify-center gap-[30px]">
          <ImageGeneratorForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />

          <div className="max-w-[511px] max-sm:mb-16 w-full h-[511px] bg-darkAlt rounded-lg flex items-center justify-center relative">
            {renderContent()}
          </div>
        </div>
      </section>
    </>
  );
};
