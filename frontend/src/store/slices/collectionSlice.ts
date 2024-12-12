import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collectionService } from '@services/collectionService';
import type { GeneratedImage } from '@types';
import type { RootState } from '@store';

interface CollectionState {
  images: GeneratedImage[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetched: number | null;
}

const initialState: CollectionState = {
  images: [],
  loading: false,
  error: null,
  isInitialized: false,
  lastFetched: null
};

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchUserCollection = createAsyncThunk(
  'collection/fetchUserCollection',
  async (userId: number, { getState }) => {
    const state = getState() as RootState;
    const { lastFetched, isInitialized } = state.collection;

    // Skip if already initialized and cache is valid
    if (
      isInitialized &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_DURATION
    ) {
      return null;
    }

    const collection = await collectionService.getUserCollection(userId);
    return collection.images || [];
  }
);

export const saveToCollection = createAsyncThunk(
  'collection/saveToCollection',
  async ({ userId, imageId }: { userId: number; imageId: number }) => {
    const response = await collectionService.saveToCollection(userId, imageId);
    return response.images || [];
  }
);

export const removeFromCollection = createAsyncThunk(
  'collection/removeFromCollection',
  async ({ userId, imageId }: { userId: number; imageId: number }) => {
    const response = await collectionService.removeFromCollection(userId, imageId);
    return response.images || [];
  }
);

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    clearCollectionError: (state) => {
      state.error = null;
    },
    invalidateCache: (state) => {
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch collection
      .addCase(fetchUserCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCollection.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.images = action.payload;
          state.lastFetched = Date.now();
        }
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(fetchUserCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collection';
        state.isInitialized = true;
      })
      // Save to collection
      .addCase(saveToCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveToCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(saveToCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save to collection';
      })
      // Remove from collection
      .addCase(removeFromCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(removeFromCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from collection';
      });
  }
});

export const { clearCollectionError, invalidateCache } = collectionSlice.actions;
export default collectionSlice.reducer;
