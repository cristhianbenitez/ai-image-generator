import { API_ENDPOINTS } from '@config/api';
import { apiRequest } from '@utils/api';

export const collectionService = {
  saveToCollection: async (
    userId: number,
    imageId: number,
  ): Promise<void> => {
    try {
      const endpoint = `${API_ENDPOINTS.COLLECTIONS}/${userId}`;
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          imageId,
        }),
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to save to collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  removeFromCollection: async (
    userId: number,
    imageId: number,
  ): Promise<void> => {
    try {
      const endpoint = `${API_ENDPOINTS.COLLECTIONS}/${userId}/images/${imageId}`;
      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to remove from collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getUserCollection: async (userId: number) => {
    try {
      const endpoint = `${API_ENDPOINTS.COLLECTIONS}/${userId}`;
      const response = await apiRequest(endpoint);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
