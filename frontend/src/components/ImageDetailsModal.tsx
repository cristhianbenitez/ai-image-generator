import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { GeneratedImage } from '@types';
import { useAppDispatch } from '@store/hooks';
import { setFormData } from '@store/slices/imageSlice';

interface ImageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GeneratedImage;
}

export const ImageDetailsModal: React.FC<ImageDetailsModalProps> = ({
  isOpen,
  onClose,
  image
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleUseSettings = async () => {
    const { prompt, negativePrompt, color, resolution, guidance, seed } = image;
    await dispatch(
      setFormData({
        prompt,
        negativePrompt,
        color,
        resolution,
        guidance,
        seed
      })
    );
    onClose();
    navigate('/');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-darkBg p-6 rounded-lg shadow-lg max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Image Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-gray text-sm font-semibold mb-1">Prompt</h3>
            <p className="text-white">{image.prompt}</p>
          </div>

          {image.negativePrompt && (
            <div>
              <h3 className="text-gray text-sm font-semibold mb-1">
                Negative Prompt
              </h3>
              <p className="text-white">{image.negativePrompt}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray text-sm font-semibold mb-1">
                Resolution
              </h3>
              <p className="text-white">{image.resolution}</p>
            </div>
            <div>
              <h3 className="text-gray text-sm font-semibold mb-1">Color</h3>
              <p className="text-white capitalize">
                {image.color || 'No color selected'}
              </p>
            </div>
            <div>
              <h3 className="text-gray text-sm font-semibold mb-1">
                Guidance Scale
              </h3>
              <p className="text-white">{image.guidance.toFixed(1)}</p>
            </div>
            <div>
              <h3 className="text-gray text-sm font-semibold mb-1">Seed</h3>
              <p className="text-white">{image.seed}</p>
            </div>
          </div>

          <button
            onClick={handleUseSettings}
            className="w-full mt-6 bg-purple hover:bg-purple/90 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Use These Settings
          </button>
        </div>
      </div>
    </div>
  );
};
