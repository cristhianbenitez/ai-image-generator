import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imageService } from '@services/imageService';
import type { FormData } from '@types';
import { fetchAllData } from './dataSlice';
import { fetchUserCollection } from './collectionSlice';
import type { AppDispatch } from '@store';

interface ImageState {
  generatedImage: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  formData: FormData;
  currentBlobUrl: string | null;
}

const initialFormData: FormData = {
  prompt: '',
  negativePrompt: '',
  color: '',
  resolution: '1024 × 1024 (1:1)',
  guidance: 7,
  seed: Math.floor(Math.random() * 1000000),
};

const initialState: ImageState = {
  generatedImage: null,
  status: 'idle',
  error: null,
  formData: initialFormData,
  currentBlobUrl: null,
};

// Helper function to revoke the old blob URL
const revokeBlobUrl = (url: string | null) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export const generateImage = createAsyncThunk(
  'image/generateImage',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const imageBlob = await imageService.generateImage(formData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate image');
    }
  }
);

export const saveImageToHistory = createAsyncThunk(
  'image/saveToHistory',
  async ({ userId, formData, imageUrl }: { userId: number; formData: FormData; imageUrl: string }, { dispatch }) => {
    try {
      await imageService.saveImageToHistory(userId, formData, imageUrl);

      // Refresh data after saving
      await Promise.all([
        dispatch(fetchAllData({ userId: userId.toString(), forceRefresh: true })),
        dispatch(fetchUserCollection(userId))
      ]);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to save image');
    }
  }
);

// Helper action creator to handle the full image generation flow
export const handleImageGeneration = (formData: FormData, userId?: number) => async (dispatch: AppDispatch) => {
  try {
    // Generate the image
    const resultAction = await dispatch(generateImage(formData)).unwrap();

    // If user is logged in, save to history and refresh data
    if (userId && resultAction) {
      await dispatch(saveImageToHistory({
        userId,
        formData,
        imageUrl: resultAction
      })).unwrap();
    }

    return resultAction;
  } catch (error) {
    throw error;
  }
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    resetForm: (state) => {
      // Revoke the current blob URL if it exists
      if (state.currentBlobUrl) {
        revokeBlobUrl(state.currentBlobUrl);
      }
      state.formData = initialFormData;
      state.generatedImage = null;
      state.currentBlobUrl = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        // Revoke the old blob URL if it exists
        if (state.currentBlobUrl) {
          revokeBlobUrl(state.currentBlobUrl);
        }
        state.status = 'succeeded';
        state.generatedImage = action.payload;
        state.currentBlobUrl = action.payload;
        state.error = null;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(saveImageToHistory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to save image to history';
      });
  },
});

export const { setFormData, resetForm, clearError } = imageSlice.actions;
export default imageSlice.reducer;
