import type { ImageContextType } from '@types';
import { createContext } from 'react';

export const ImageContext = createContext<ImageContextType | undefined>(
  undefined,
);
