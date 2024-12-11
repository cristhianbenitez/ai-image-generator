import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { GeneratedImage } from '@types';
import { API_ENDPOINTS } from '@config/api';

interface DataState {
  allImages: GeneratedImage[];
  userImages: GeneratedImage[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  allImages: [],
  userImages: [],
  loading: true,
  error: null,
};

export const fetchAllData = createAsyncThunk(
  'data/fetchAllData',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const allImagesResponse = await fetch(API_ENDPOINTS.IMAGES, {
        credentials: 'include',
      });

      if (!allImagesResponse.ok) {
        throw new Error('Failed to fetch images');
      }

      const allImagesData = await allImagesResponse.json();

      if (userId) {
        const userImagesResponse = await fetch(
          API_ENDPOINTS.USER_IMAGES(parseInt(userId)),
          {
            credentials: 'include',
          }
        );

        if (!userImagesResponse.ok) {
          throw new Error('Failed to fetch user images');
        }

        const userImagesData = await userImagesResponse.json();
        return { allImages: allImagesData, userImages: userImagesData };
      }

      return { allImages: allImagesData, userImages: [] };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch data');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearData: (state) => {
      state.allImages = [];
      state.userImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.allImages = action.payload.allImages;
        state.userImages = action.payload.userImages;
        state.error = null;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch data';
      });
  },
});

export const { clearData } = dataSlice.actions;
export default dataSlice.reducer;
