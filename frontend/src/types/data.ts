export interface GeneratedImage {
  id: number;
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
  imageUrl: string;
  createdAt: string;
  userId: number;
  user: {
    name: string;
    avatar: string;
  };
}

export interface DataContextType {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}
