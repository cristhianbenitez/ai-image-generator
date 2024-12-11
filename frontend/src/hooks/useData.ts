// Custom hook to use the data context
import { DataContext } from '@context';
import { useContext } from 'react';

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
