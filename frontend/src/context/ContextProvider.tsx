import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { DataProvider } from './data/DataProvider';
import { ImageProvider } from './image/ImageProvider';

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
