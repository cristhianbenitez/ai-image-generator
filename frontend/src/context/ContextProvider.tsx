import React from 'react';
import { AuthProvider } from './auth';
import { DataProvider } from './data/DataContext';
import { ImageProvider } from './image/ImageContext';

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <DataProvider>
        <ImageProvider>{children}</ImageProvider>
      </DataProvider>
    </AuthProvider>
  );
};
