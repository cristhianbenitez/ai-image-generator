import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import { useEffect } from 'react';

export const useInitializeData = () => {
  const dispatch = useAppDispatch();
  const { isInitialized, loading } = useAppSelector(state => state.data);
  const user = useAppSelector(state => state.auth.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    // Fetch when:
    // 1. Not initialized
    // 2. User changes (login/logout)
    // 3. Authentication state changes
    if (!isInitialized || user || isAuthenticated) {
      dispatch(fetchAllData());
    }
  }, [dispatch, isInitialized, user, isAuthenticated]);

  return { isInitialized, loading };
};
