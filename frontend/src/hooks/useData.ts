import type { RootState } from '@store';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import { useEffect } from 'react';

export const useData = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { allImages, userImages, loading, error, isInitialized } = useAppSelector(
    (state: RootState) => state.data,
  );

  useEffect(() => {
    if (user && (!isInitialized || !userImages.length)) {
      dispatch(fetchAllData());
    }
  }, [dispatch, user, isInitialized, userImages.length]);

  const refetchData = () => {
    dispatch(fetchAllData());
  };

  return {
    allImages,
    userImages,
    loading: loading || (!isInitialized && !!user),
    error,
    refetchData,
  };
};
