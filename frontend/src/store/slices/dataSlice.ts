import { API_ENDPOINTS } from '@config/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@store';
import type { GeneratedImage } from '@types';
import { apiRequest } from '@utils/api';

interface DataState {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
}

const initialState: DataState = {
  allImages: [],
  userImages: [],
  loading: false,
  error: null,
  lastFetched: null,
  isInitialized: false,
};

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface FetchAllDataParams {
  userId?: string;
  forceRefresh?: boolean;
}

export const fetchAllData = createAsyncThunk(
  'data/fetchAllData',
  async ({ userId, forceRefresh = false }: FetchAllDataParams, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { lastFetched, isInitialized } = state.data;

    // Skip if already initialized and cache is valid, unless force refresh is requested
    if (
      !forceRefresh &&
      isInitialized &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_DURATION
    ) {
      return null;
    }

    try {
      const [allImages, userImages] = await Promise.all([
        apiRequest(`${API_ENDPOINTS.IMAGES}${userId ? `?userId=${userId}` : ''}`),
        userId ? apiRequest(API_ENDPOINTS.USER_IMAGES(parseInt(userId))) : Promise.resolve([]),
      ]);

      return { allImages, userImages };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch data');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        if (action.payload) {
          state.allImages = action.payload.allImages;
          state.userImages = action.payload.userImages;
          state.lastFetched = Date.now();
        }
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });
  },
});

export const { invalidateCache } = dataSlice.actions;
export default dataSlice.reducer;
