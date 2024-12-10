import { COLORS, RESOLUTIONS } from '@constants/image';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ImageContextType {
  generatedImage: string | null;
  status: GenerationStatus;
  error: string | null;
  generateImage: (formData: FormData) => Promise<void>;
  resetImage: () => void;
}

export interface FormData {
  prompt: string;
  negativePrompt: string;
  color: (typeof COLORS)[number] | '';
  resolution: (typeof RESOLUTIONS)[number];
  guidance: number;
  seed: number;
}
