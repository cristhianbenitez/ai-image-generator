import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { imageService } from '@services';
import type { RootState } from '@store';
import type { FormData, GenerationStatus } from '@types';
import { imageUtils } from '@utils/imageUtils';
import { fetchAllData } from './dataSlice';

interface ImageState {
  generatedImage: string | null;
  status: GenerationStatus;
  error: string | null;
  formData: FormData;
}

const defaultFormData: FormData = {
  prompt: '',
  negativePrompt: '',
  color: '',
  resolution: '1024 × 1024 (1:1)',
  guidance: 7.0,
  seed: Math.floor(Math.random() * 2147483647),
};

const initialState: ImageState = {
  generatedImage: null,
  status: 'idle',
  error: null,
  formData: defaultFormData,
};

export const generateImage = createAsyncThunk(
  'image/generateImage',
  async (formData: FormData, { getState, dispatch }) => {
    const state = getState() as RootState;
    const user = state.auth.user;

    const blob = await imageService.generateImage(formData);
    const imageUrl = URL.createObjectURL(blob);

    // Save to history if user is logged in
    if (user) {
      try {
        const base64Image = await imageUtils.convertBlobToBase64(blob);
        await imageService.saveImageToHistory(
          parseInt(user.id),
          formData,
          base64Image,
        );
        // Refetch data after saving
        dispatch(fetchAllData(user.id));
      } catch (saveError) {
        console.error('Failed to save image:', saveError);
      }
    }

    return imageUrl;
  },
);

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<FormData>) => {
      state.formData = action.payload;
    },
    resetImage: state => {
      state.generatedImage = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateImage.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.status = 'success';
        state.generatedImage = action.payload;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to generate image';
      });
  },
});

export const { setFormData, resetImage } = imageSlice.actions;
export default imageSlice.reducer;
