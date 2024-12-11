import { createSlice } from '@reduxjs/toolkit';
import type { AppDispatch } from '@store';
import type { User } from '@types';
import { fetchAllData, invalidateCache } from './dataSlice';

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
  if (import.meta.env.VERCEL_URL) {
    return `https://${import.meta.env.VERCEL_URL}`;
  }
  return 'http://localhost:8000';
};

export const setUserAndFetchData =
  (user: User | null) => async (dispatch: AppDispatch) => {
    dispatch(setUser(user));
    if (user) {
      dispatch(invalidateCache());
      dispatch(fetchAllData());
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
      window.location.href = `${getBackendUrl()}/auth/github`;
    },
    logout: state => {
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
