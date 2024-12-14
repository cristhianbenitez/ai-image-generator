import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collectionService } from '@services/collectionService';
import type { Collection } from '@types';
import type { RootState } from '@store';

interface CollectionState {
  collection: Collection | null;
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  collection: null,
  loading: false,
  error: null
};

export const fetchUserCollection = createAsyncThunk(
  'collection/fetchUserCollection',
  async (userId: number) => {
    const response = await collectionService.getUserCollection(userId);
    return response;
  }
);

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    resetCollection: state => {
      return initialState;
    },
    removeImageFromCollection: (state, action: PayloadAction<number>) => {
      if (state.collection?.images) {
        state.collection.images = state.collection.images.filter(
          image => image.id !== action.payload
        );
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserCollection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCollection.fulfilled, (state, action) => {
        state.collection = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collection';
      });
  }
});

export const { resetCollection, removeImageFromCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
