export interface User {
  id: number;
  name: string | null;
  githubId: string;
  avatar: string | null;
  generatedImages: GeneratedImage[];
  collections: Collection[];
}

export interface GeneratedImage {
  id: number;
  prompt: string;
  negativePrompt?: string;
  color?: string;
  resolution: string;
  guidance: number;
  seed: number;
  imageUrl: string;
  createdAt: Date;
  userId: number;
  user: User;
  collections: Collection[];
}

export interface Collection {
  id: number;
  userId: number;
  user: User;
  images: GeneratedImage[];
}
