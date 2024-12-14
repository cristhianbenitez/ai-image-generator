import { API_ENDPOINTS } from '@config/api';
import type {
  GeneratedImage,
  PaginatedResponse,
  FetchImagesParams,
  FetchImagesResponse
} from '@types';
import { apiRequest } from '@utils/api';

export const dataService = {
  fetchImages: async ({
    userId,
    page = 1,
    limit = 20
  }: FetchImagesParams): Promise<PaginatedResponse<GeneratedImage>> => {
    try {
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
  }
};
