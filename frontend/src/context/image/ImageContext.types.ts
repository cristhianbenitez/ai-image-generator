import { createContext } from 'react';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ImageContextType {
  generatedImage: string | null;
  status: GenerationStatus;
  error: string | null;
  generateImage: (formData: FormData) => Promise<void>;
  resetImage: () => void;
}

export const ImageContext = createContext<ImageContextType | undefined>(
  undefined,
);
