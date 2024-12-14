import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { imageService } from '@services';
import type { FormData } from '@types';
import { fetchAllData, resetPagination, resetState, addNewImage } from './dataSlice';
import { fetchUserCollection } from './collectionSlice';
import type { AppDispatch } from '@store';
import type { RootState } from '@store';
import type { GeneratedImage } from '@types';

// Note: For larger applications, it's recommended to move selectors to a separate
// 'selectors' directory for better organization and reusability. However, for
// smaller applications or when selectors are tightly coupled to a specific slice,
// it's acceptable to keep them in the same file as the slice.
//
// Current approach: Keep selectors with slice because:
// 1. These selectors are specific to the image slice
// 2. We have a relatively small number of selectors
// 3. It makes the code more discoverable for this specific feature
// 4. The selectors are not shared with other slices

// Selectors
export const selectBookmarkStatus = createSelector(
  [
    (state: RootState) => state.image.bookmarkStatus,
    (_: RootState, imageId: number) => imageId
  ],
  (bookmarkStatus, imageId) =>
    bookmarkStatus[imageId] || {
      isBookmarked: false,
      isLoading: false,
      error: null
    }
);

export const makeSelectBookmarkStatus = () => {
  return createSelector(
    [
      (state: RootState) => state.image.bookmarkStatus,
      (_: RootState, post: GeneratedImage) => post
    ],
    (bookmarkStatus, post) =>
      bookmarkStatus[post.id] || {
        isBookmarked: post.isBookmarked || false,
        isLoading: false,
        error: null
      }
  );
};

interface ImageState {
  generatedImage: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  formData: FormData;
  currentBlobUrl: string | null;
  bookmarkStatus: {
    [key: string]: {
      isBookmarked: boolean;
      isLoading: boolean;
      error: string | null;
    };
  };
}

const initialFormData: FormData = {
  prompt: '',
  negativePrompt: '',
  color: '',
  resolution: '1024 × 1024 (1:1)',
  guidance: 7,
  seed: Math.floor(Math.random() * 1000000)
};

const initialState: ImageState = {
  generatedImage: null,
  status: 'idle',
  error: null,
  formData: initialFormData,
  currentBlobUrl: null,
  bookmarkStatus: {}
};

// Helper function to revoke the old blob URL
const revokeBlobUrl = (url: string | null) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export const generateImage = createAsyncThunk(
  'image/generateImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const imageBlob = await imageService.generateImage(formData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  }
);

export const saveImageToHistory = createAsyncThunk(
  'image/saveToHistory',
  async (
    {
      userId,
      formData,
      imageUrl
    }: { userId: number; formData: FormData; imageUrl: string },
    { rejectWithValue }
  ) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to save image');
      }
      const savedImage = await imageService.saveImageToHistory(userId, formData, imageUrl);
      return savedImage;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to save image'
      );
    }
  }
);

// New thunk for bookmarking images
export const toggleBookmark = createAsyncThunk(
  'image/toggleBookmark',
  async (
    { imageId, userId }: { imageId: number; userId: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await imageService.toggleBookmark(userId, imageId);

      // Refresh collections after toggling bookmark
      await dispatch(fetchUserCollection(userId));

      return { imageId, success: true };
    } catch (error) {
      return rejectWithValue({
        imageId,
        error:
          error instanceof Error ? error.message : 'Failed to toggle bookmark'
      });
    }
  }
);

// Helper action creator to handle the full image generation flow
export const handleImageGeneration = createAsyncThunk(
  'image/generateImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const imageBlob = await imageService.generateImage(formData);
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    resetForm: state => {
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
    clearError: state => {
      state.error = null;
    },
    setBookmarkStatus: (state, action) => {
      const { imageId, isBookmarked } = action.payload;
      state.bookmarkStatus[imageId] = {
        isBookmarked,
        isLoading: false,
        error: null
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(generateImage.pending, state => {
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
      })
      // Handle bookmark status
      .addCase(toggleBookmark.pending, (state, action) => {
        const { imageId } = action.meta.arg;
        state.bookmarkStatus[imageId] = {
          ...state.bookmarkStatus[imageId],
          isLoading: true,
          error: null
        };
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { imageId } = action.meta.arg;
        const currentStatus = state.bookmarkStatus[imageId]?.isBookmarked;
        state.bookmarkStatus[imageId] = {
          isBookmarked: !currentStatus,
          isLoading: false,
          error: null
        };
      })
      .addCase(toggleBookmark.rejected, (state, action) => {
        const { imageId, error } = action.payload as {
          imageId: number;
          error: string;
        };
        state.bookmarkStatus[imageId] = {
          ...state.bookmarkStatus[imageId],
          isLoading: false,
          error
        };
      });
  }
});

export const { setFormData, resetForm, clearError, setBookmarkStatus } =
  imageSlice.actions;
export default imageSlice.reducer;
