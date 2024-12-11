import type { RootState } from '@store';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAllData } from '@store/slices/dataSlice';
import { useEffect } from 'react';

export const useData = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { allImages, userImages, loading, error } = useAppSelector(
    (state: RootState) => state.data,
  );

  useEffect(() => {
    dispatch(fetchAllData(user?.id));
  }, [dispatch, user?.id]);

  const refetchData = () => {
    dispatch(fetchAllData(user?.id));
  };

  return {
    allImages,
    userImages,
    loading,
    error,
    refetchData,
  };
};
