const API_BASE = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_LOCAL
  : import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  SEGMIND: 'https://api.segmind.com/v1/ssd-1b',
  IMAGES: `${API_BASE}/api/images`,
  USER_IMAGES: (userId: number) => `${API_BASE}/api/users/${userId}/images`,
} as const; 
