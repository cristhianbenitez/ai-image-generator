import { API_ENDPOINTS } from '@config/api';
import type {
  GeneratedImage,
  PaginatedResponse,
  FetchImagesParams,
  FetchImagesResponse
} from '@types';
import { apiRequest } from '@utils/api';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'taanga_cache_';
const MAX_ITEM_SIZE = 2 * 1024 * 1024; // 2MB per item

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private memoryCache: Map<string, CacheItem<any>> = new Map();

  private getCacheKey(key: string, params?: Record<string, any>): string {
    return `${CACHE_PREFIX}${key}${params ? '_' + JSON.stringify(params) : ''}`;
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_DURATION;
  }

  private getItemSize(item: any): number {
    return new Blob([JSON.stringify(item)]).size;
  }

  async get<T>(key: string, params?: Record<string, any>): Promise<T | null> {
    const cacheKey = this.getCacheKey(key, params);

    // Check memory cache first
    const memoryItem = this.memoryCache.get(cacheKey);
    if (memoryItem && !this.isExpired(memoryItem.timestamp)) {
      console.log('[CacheService] Memory cache hit:', { key, params });
      return memoryItem.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored);
        if (!this.isExpired(item.timestamp)) {
          // Update memory cache
          this.memoryCache.set(cacheKey, item);
          console.log('[CacheService] LocalStorage cache hit:', {
            key,
            params
          });
          return item.data;
        }
        // Clean up expired item
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.warn('[CacheService] Error reading from localStorage:', error);
    }

    return null;
  }

  set<T>(key: string, data: T, params?: Record<string, any>): void {
    const cacheKey = this.getCacheKey(key, params);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };

    // Always update memory cache
    this.memoryCache.set(cacheKey, item);

    // Check item size before attempting localStorage
    const itemSize = this.getItemSize(item);
    if (itemSize > MAX_ITEM_SIZE) {
      console.log(
        '[CacheService] Item too large for localStorage, using memory-only cache:',
        {
          key,
          size: `${(itemSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(MAX_ITEM_SIZE / 1024 / 1024).toFixed(2)}MB`
        }
      );
      return;
    }

    // Try to update localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(item));
      console.log('[CacheService] Cache updated:', { key, params });
    } catch (error) {
      // If localStorage is full, clear old items
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.log(
          '[CacheService] localStorage quota exceeded, clearing old items'
        );
        this.clearOldItems();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(item));
        } catch (retryError) {
          console.warn(
            '[CacheService] Still unable to write to localStorage after clearing, using memory-only cache'
          );
        }
      } else {
        console.warn('[CacheService] Error writing to localStorage:', error);
      }
    }
  }

  private clearOldItems(): void {
    const now = Date.now();
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (this.isExpired(item.timestamp)) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // If we can't parse the item, remove it
          localStorage.removeItem(key);
        }
      });
  }

  invalidate(key: string, params?: Record<string, any>): void {
    const cacheKey = this.getCacheKey(key, params);
    this.memoryCache.delete(cacheKey);
    try {
      localStorage.removeItem(cacheKey);
      console.log('[CacheService] Cache invalidated:', { key, params });
    } catch (error) {
      console.warn('[CacheService] Error removing from localStorage:', error);
    }
  }

  clear(): void {
    this.memoryCache.clear();
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      console.log('[CacheService] Cache cleared');
    } catch (error) {
      console.warn('[CacheService] Error clearing localStorage:', error);
    }
  }
}

const cacheService = new CacheService();

export const dataService = {
  fetchImages: async ({
    userId,
    page = 1,
    limit = 20
  }: FetchImagesParams): Promise<PaginatedResponse<GeneratedImage>> => {
    try {
      // Try to get from cache first (only for first page)
      if (page === 1) {
        const cached = await cacheService.get<
          PaginatedResponse<GeneratedImage>
        >('images', { userId });
        if (cached) return cached;
      }

      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      console.log('[dataService] Fetching images with params:', {
        userId,
        page,
        limit,
        url: `${API_ENDPOINTS.IMAGES}?${queryParams.toString()}`
      });

      const response = await apiRequest<PaginatedResponse<GeneratedImage>>(
        `${API_ENDPOINTS.IMAGES}?${queryParams.toString()}`
      );

      // Cache only first page
      if (page === 1) {
        cacheService.set('images', response, { userId });
      }

      console.log('[dataService] Successfully fetched images:', {
        totalImages: response.data.length,
        pagination: response.pagination
      });

      return response;
    } catch (error) {
      console.error('[dataService] Error fetching images:', {
        error,
        params: { userId, page, limit }
      });
      throw error;
    }
  },

  fetchUserImages: async (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<GeneratedImage>> => {
    try {
      // Try to get from cache first (only for first page)
      if (page === 1) {
        const cached = await cacheService.get<
          PaginatedResponse<GeneratedImage>
        >('userImages', { userId });
        if (cached) return cached;
      }

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      console.log('[dataService] Fetching user images:', {
        userId,
        page,
        limit,
        url: `${API_ENDPOINTS.USER_IMAGES(parseInt(userId))}?${queryParams.toString()}`
      });

      const response = await apiRequest<PaginatedResponse<GeneratedImage>>(
        `${API_ENDPOINTS.USER_IMAGES(parseInt(userId))}?${queryParams.toString()}`
      );

      // Cache only first page
      if (page === 1) {
        cacheService.set('userImages', response, { userId });
      }

      console.log('[dataService] Successfully fetched user images:', {
        totalImages: response.data.length,
        pagination: response.pagination
      });

      return response;
    } catch (error) {
      console.error('[dataService] Error fetching user images:', {
        error,
        userId
      });
      throw error;
    }
  },

  fetchAllData: async ({
    userId,
    page = 1,
    limit = 20
  }: FetchImagesParams): Promise<FetchImagesResponse> => {
    try {
      console.log('[dataService] Starting fetchAllData:', {
        userId,
        page,
        limit
      });

      const validUserId = userId?.trim() || undefined;
      console.log('[dataService] Validated userId:', {
        original: userId,
        validated: validUserId
      });

      const [imagesResponse, userImagesResponse] = await Promise.all([
        dataService.fetchImages({ userId: validUserId, page, limit }),
        validUserId
          ? dataService.fetchUserImages(validUserId, page, limit)
          : Promise.resolve({ data: [], pagination: { hasMore: false } })
      ]);

      console.log('[dataService] Successfully fetched all data:', {
        totalImages: imagesResponse.data.length,
        totalUserImages: userImagesResponse.data.length,
        hasMore: imagesResponse.pagination?.hasMore,
        currentPage: page
      });

      return {
        allImages: imagesResponse.data,
        userImages: userImagesResponse.data,
        hasMore: imagesResponse.pagination?.hasMore ?? false,
        currentPage: page
      };
    } catch (error) {
      console.error('[dataService] Error in fetchAllData:', {
        error,
        params: { userId, page, limit }
      });
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch data'
      );
    }
  },

  // Utility methods for cache management
  invalidateCache: () => {
    cacheService.clear();
  },

  invalidateUserCache: (userId: string) => {
    cacheService.invalidate('images', { userId });
    cacheService.invalidate('userImages', { userId });
  }
};
