import { useContext } from 'react';
import { ImageContext } from '../context/image/ImageContext';

export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
