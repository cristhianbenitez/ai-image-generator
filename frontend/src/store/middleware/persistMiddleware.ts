import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const persistMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);

  if (action.type.startsWith('auth/')) {
    const state = store.getState();
    localStorage.setItem('reduxState', JSON.stringify({
      auth: state.auth
    }));
  }

  return result;
};
