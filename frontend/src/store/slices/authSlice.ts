import { createSlice } from '@reduxjs/toolkit';
import type { AppDispatch } from '@store';
import type { User } from '@types';
import { fetchAllData, invalidateCache } from './dataSlice';
import { fetchUserCollection } from './collectionSlice';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthModalOpen: false,
};

const getBackendUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://taanga-backend.vercel.app';
  }
  return import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:8000';
};

export const setUserAndFetchData =
  (user: User | null) => async (dispatch: AppDispatch) => {
    dispatch(setUser(user));
    if (user) {
      dispatch(invalidateCache());
      await Promise.all([
        dispatch(fetchAllData({ userId: user.id })),
        dispatch(fetchUserCollection(parseInt(user.id)))
      ]);
    }
  };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthModalOpen: (state, action) => {
      state.isAuthModalOpen = action.payload;
    },
    openAuthModal: state => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: state => {
      state.isAuthModalOpen = false;
    },
    login: () => {
      const backendUrl = getBackendUrl();
      const loginUrl = `${backendUrl}/auth/github`;
      window.location.href = loginUrl;
    },
    logout: state => {
      localStorage.removeItem('auth_token');
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthModalOpen = false;
    },
  },
});

export const {
  setUser,
  setLoading,
  setAuthModalOpen,
  openAuthModal,
  closeAuthModal,
  login,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
