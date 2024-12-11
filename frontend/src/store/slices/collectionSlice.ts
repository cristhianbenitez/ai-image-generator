import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { GeneratedImage } from '@types';
import { API_ENDPOINTS } from '@config/api';

interface CollectionImage extends GeneratedImage {
  user: {
    name: string;
    avatar: string;
  };
}

interface CollectionState {
  collection: {
    id: number;
    userId: number;
    images: CollectionImage[];
  } | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetched: number | null;
}

const initialState: CollectionState = {
  collection: null,
  loading: true,
  error: null,
  isInitialized: false,
  lastFetched: null,
};

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchCollection = createAsyncThunk(
  'collection/fetchCollection',
  async (userId: string, { getState, rejectWithValue }) => {
    const state = getState() as { collection: CollectionState };
    const { lastFetched, isInitialized } = state.collection;

    // Skip if already initialized and cache is valid
    if (
      isInitialized &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_DURATION
    ) {
      return null;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.COLLECTIONS}/${userId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }

      const data = await response.json();
      return data[0] || { id: 0, userId: parseInt(userId), images: [] };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load collection'
      );
    }
  }
);

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    removeImage: (state, action) => {
      if (state.collection) {
        state.collection.images = state.collection.images.filter(
          img => img.id !== action.payload
        );
      }
    },
    invalidateCache: state => {
      state.lastFetched = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCollection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collection = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { removeImage } = collectionSlice.actions;
export default collectionSlice.reducer; 
