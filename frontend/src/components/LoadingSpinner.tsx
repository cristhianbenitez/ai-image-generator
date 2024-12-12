import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size]} border-t-4 border-purple border-solid rounded-full animate-spin`}
        aria-hidden="true"
      />
      <p className="text-gray text-sm sr-only">{message}</p>
      <p className="text-gray text-sm" aria-hidden="true">
        {message}
      </p>
    </div>
  );
};

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="text-red text-center">
      <p>Error: {message}</p>
    </div>
  );
};
