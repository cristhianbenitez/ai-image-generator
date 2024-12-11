import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistMiddleware } from './middleware/persistMiddleware';
import authReducer from './slices/authSlice';
import collectionReducer from './slices/collectionSlice';
import dataReducer from './slices/dataSlice';
import imageReducer from './slices/imageSlice';

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

const rootReducer = combineReducers({
  auth: authReducer,
  image: imageReducer,
  data: dataReducer,
  collection: collectionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
