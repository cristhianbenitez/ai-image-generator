import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Actions that should trigger state persistence
const PERSIST_ACTIONS = [
  'auth/setUser',
  'auth/logout',
];

export const persistMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);

  // Check if the action should trigger persistence
  const shouldPersist = PERSIST_ACTIONS.some(actionType =>
    action.type === actionType
  );

  if (shouldPersist) {
    const state = store.getState();
    const persistedState = {
      auth: {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
        isAuthModalOpen: false,
        isLoading: false,
      }
    };

    try {
      localStorage.setItem('reduxState', JSON.stringify(persistedState));
    } catch (err) {
      console.error('Error persisting state:', err);
    }
  }

  return result;
};
