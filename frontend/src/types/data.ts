export interface GeneratedImage {
  id: number;
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
  seed: number;
  imageUrl: string;
  createdAt: string;
  userId: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  isBookmarked?: boolean;
}

export interface PaginationMetadata {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface FetchImagesParams {
  userId?: string | null;
  page?: number;
  limit?: number;
}

export interface FetchImagesResponse {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  hasMore: boolean;
  currentPage: number;
}

export interface DataContextType {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}
