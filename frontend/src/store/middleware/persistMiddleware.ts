import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Actions that should trigger state persistence
const PERSIST_ACTIONS = [
  'auth/',
  'collection/fetchUserCollection/fulfilled',
  'collection/saveToCollection/fulfilled',
  'collection/removeFromCollection/fulfilled',
  'data/fetchAllData/fulfilled',
];

export const persistMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);

  // Check if the action should trigger persistence
  const shouldPersist = PERSIST_ACTIONS.some(actionType =>
    action.type.startsWith(actionType)
  );

  if (shouldPersist) {
    const state = store.getState();
    const persistedState = {
      auth: state.auth,
      collection: {
        ...state.collection,
        loading: false,
        error: null,
      },
      data: {
        ...state.data,
        loading: false,
        error: null,
      },
    };

    try {
      localStorage.setItem('reduxState', JSON.stringify(persistedState));
    } catch (err) {
      console.error('Error persisting state:', err);
    }
  }

  return result;
};
