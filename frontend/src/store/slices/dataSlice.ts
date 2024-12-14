import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { GeneratedImage } from '@types';
import { dataService } from '@services';
import { setBookmarkStatus } from './imageSlice';

interface DataState {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  currentPage: number;
  hasMore: boolean;
}

const initialState: DataState = {
  allImages: [],
  userImages: [],
  loading: false,
  error: null,
  isInitialized: false,
  currentPage: 1,
  hasMore: true
};

interface FetchAllDataParams {
  userId?: string;
  page?: number;
}

export const fetchAllData = createAsyncThunk(
  'data/fetchAllData',
  async (
    { userId, page = 1 }: FetchAllDataParams,
    { dispatch, rejectWithValue }
  ) => {
    try {
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
    resetPagination: state => {
      state.currentPage = 1;
      state.hasMore = true;
    },
    resetState: state => {
      return initialState;
    },
    addNewImage: (state, action) => {
      // Check if image already exists
      const imageExists = state.allImages.some(img => img.id === action.payload.id);

      if (!imageExists) {
        // Add to beginning of allImages
        state.allImages.unshift(action.payload);

        // If the image belongs to the current user, add to userImages too
        if (action.payload.userId === state.userImages[0]?.userId) {
          state.userImages.unshift(action.payload);
        }
      }
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
          const { allImages, userImages, hasMore, currentPage } = action.payload;

          // If it's the first page, replace the images
          // Otherwise, append the new images
          if (currentPage === 1) {
            state.allImages = allImages;
            state.userImages = userImages;
          } else {
            state.allImages = [...state.allImages, ...allImages];
            if (userImages.length > 0) {
              state.userImages = [...state.userImages, ...userImages];
            }
          }

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

export const { resetPagination, resetState, addNewImage } = dataSlice.actions;
export default dataSlice.reducer;
