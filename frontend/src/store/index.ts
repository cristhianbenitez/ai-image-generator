import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';
import collectionReducer from './slices/collectionSlice';
import imageReducer from './slices/imageSlice';
import { persistMiddleware } from './middleware/persistMiddleware';

// Load persisted state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    collection: collectionReducer,
    image: imageReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
