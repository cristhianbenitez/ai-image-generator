import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';

export const useInitializeData = () => {
  const dispatch = useAppDispatch();
  const { isInitialized, loading } = useAppSelector(state => state.data);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (!isInitialized || user) {
      dispatch(fetchAllData());
    }
  }, [dispatch, isInitialized, user]);

  return { isInitialized, loading };
}; 
