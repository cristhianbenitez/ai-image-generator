import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { GeneratedImage } from '@types';
import { useAppDispatch } from '@store/hooks';
import { setFormData } from '@store/slices/imageSlice';
import downloadIcon from '@assets/icons/download.svg';

interface ImageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GeneratedImage;
}

// Close button component
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    onClick={onClose}
    className="text-gray-500 absolute bg-darkAlt rounded-lg p-3 top-2 right-2 hover:text-gray-300 transition-colors"
    aria-label="Close modal"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
);

// Image preview section component
const ImagePreview: React.FC<{ image: GeneratedImage }> = ({ image }) => (
  <section className="flex flex-col gap-4">
    <figure className="p-1 bg-darkAlt rounded-md h-fit w-[292px]">
      <img
        src={image.imageUrl}
        alt={image.prompt}
        className="max-w-full h-auto"
      />
    </figure>

    <a
      href={image.imageUrl}
      download={`image-${image.id}.png`}
      className="bg-darkAlt hover:bg-darkAlt2 flex items-center gap-2 px-4 py-3 rounded-lg w-fit transition-colors"
      title="Download image"
    >
      <img src={downloadIcon} alt="Download icon" className="w-6 h-6" />
      <span>Download</span>
    </a>
  </section>
);

// Image details section component
const ImageDetails: React.FC<{
  image: GeneratedImage;
  onUseSettings: () => void;
}> = ({ image, onUseSettings }) => {
  const imageDetails = [
    { label: 'Prompt Details', value: image.prompt },
    { label: 'Negative prompt', value: image.negativePrompt || 'Null' },
    { label: 'Created on', value: null }, // Placeholder for created date
    { label: 'Input Resolution', value: image.resolution },
    { label: 'Seed', value: image.seed }
  ];

  return (
    <section className="flex justify-between mb-6 flex-col">
      <dl className="space-y-2">
        {imageDetails.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-gray font-semibold text-small mb-2">{label}</dt>
            <dd className="text-white">
              {value || value === 0 ? value : 'Not specified'}
            </dd>
          </div>
        ))}
      </dl>
      <button
        onClick={onUseSettings}
        className="w-full bg-[#7B61FF] hover:bg-[#7B61FF]/90 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        type="button"
      >
        Generate with these settings
      </button>
    </section>
  );
};

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
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#1A1B1E] relative p-8 rounded-xl flex shadow-lg gap-8 max-w-[820px] max-h-[592px] h-full w-full"
        onClick={e => e.stopPropagation()}
      >
        <CloseButton onClose={onClose} />
        <ImagePreview image={image} />
        <ImageDetails image={image} onUseSettings={handleUseSettings} />
      </div>
    </div>
  );
};
