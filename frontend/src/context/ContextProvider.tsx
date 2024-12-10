import React from 'react';
import { AuthProvider } from './auth';
import { ImageProvider } from './image/ImageContext';

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ImageProvider>{children}</ImageProvider>
    </AuthProvider>
  );
};
