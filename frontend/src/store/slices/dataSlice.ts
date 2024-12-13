import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { GeneratedImage } from '@types';
import { dataService } from '@services';
import { setBookmarkStatus } from './imageSlice';

interface DataState {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
  currentPage: number;
  hasMore: boolean;
}

const initialState: DataState = {
  allImages: [],
  userImages: [],
  loading: false,
  error: null,
  lastFetched: null,
  isInitialized: false,
  currentPage: 1,
  hasMore: true
};

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface FetchAllDataParams {
  userId?: string;
  forceRefresh?: boolean;
  page?: number;
}

export const fetchAllData = createAsyncThunk(
  'data/fetchAllData',
  async (
    { userId, forceRefresh = false, page = 1 }: FetchAllDataParams,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as { data: DataState };
      const { lastFetched, isInitialized } = state.data;

      // Skip if already initialized and cache is valid, unless force refresh is requested
      if (
        !forceRefresh &&
        isInitialized &&
        lastFetched &&
        Date.now() - lastFetched < CACHE_DURATION &&
        page === 1
      ) {
        return null;
      }

      const response = await dataService.fetchAllData({ userId, page });

      // Initialize bookmark status for each image
      response.allImages.forEach(image => {
        dispatch(
          setBookmarkStatus({
            imageId: image.id,
            isBookmarked: image.isBookmarked || false
          })
        );
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch data'
      );
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    invalidateCache: state => {
      state.lastFetched = null;
      state.currentPage = 1;
      state.hasMore = true;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        if (action.payload) {
          const { allImages, userImages, hasMore, currentPage } =
            action.payload;

          // If it's the first page or a refresh, replace the images
          // Otherwise, append the new images
          state.allImages =
            currentPage === 1 ? allImages : [...state.allImages, ...allImages];
          state.userImages = userImages;
          state.lastFetched = Date.now();
          state.hasMore = hasMore;
          state.currentPage = currentPage;
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
  }
});

export const { invalidateCache } = dataSlice.actions;
export default dataSlice.reducer;
