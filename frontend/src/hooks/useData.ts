// Custom hook to use the data context
import { useContext } from 'react';
import { DataContext } from '../context/data/DataContext';

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
