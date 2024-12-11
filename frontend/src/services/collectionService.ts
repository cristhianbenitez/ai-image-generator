import { API_ENDPOINTS } from '@config/api';

export const collectionService = {
  saveToCollection: async (
    userId: number,
    imageId: number,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.COLLECTIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          imageId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ''
          }`,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save to collection:', errorMessage);
      throw error;
    }
  },

  removeFromCollection: async (
    userId: number,
    imageId: number,
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.COLLECTIONS}/${userId}/${imageId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ''
          }`,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to remove from collection:', errorMessage);
      throw error;
    }
  },

  getUserCollection: async (userId: number) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.COLLECTIONS}/${userId}`,
        {
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to fetch collection:', errorMessage);
      throw error;
    }
  },
}; 
