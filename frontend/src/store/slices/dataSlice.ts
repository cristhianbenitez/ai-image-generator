import { API_ENDPOINTS } from '@config/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@store';
import type { GeneratedImage } from '@types';

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

export const fetchAllData = createAsyncThunk(
  'data/fetchAllData',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { lastFetched } = state.data;
    const user = state.auth.user;

    // Only check cache if user exists and cache is valid
    if (user && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      return null;
    }

    try {
      const [allImagesResponse, userImagesResponse] = await Promise.all([
        fetch(API_ENDPOINTS.IMAGES, { credentials: 'include' }),
        user
          ? fetch(API_ENDPOINTS.USER_IMAGES(parseInt(user.id)), {
              credentials: 'include',
            })
          : Promise.resolve(null),
      ]);

      if (!allImagesResponse.ok) {
        throw new Error('Failed to fetch images');
      }

      const allImages = await allImagesResponse.json();
      const userImages = userImagesResponse
        ? await userImagesResponse.json()
        : [];

      return { allImages, userImages };
    } catch (error) {
      console.error('Error fetching data:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch data',
      );
    }
  },
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    invalidateCache: state => {
      state.lastFetched = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllData.pending, state => {
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
      });
  },
});

export const { invalidateCache } = dataSlice.actions;
export default dataSlice.reducer;
