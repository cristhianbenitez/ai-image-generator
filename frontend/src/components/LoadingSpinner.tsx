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

// Skeleton loader for feed items
export const FeedSkeleton: React.FC = () => {
  // Create an array of 8 items for the initial skeleton
  const skeletonItems = Array.from({ length: 8 }, (_, index) => (
    <div
      key={index}
      className="animate-pulse bg-darkAlt rounded-lg overflow-hidden"
      style={{ height: `${Math.floor(Math.random() * 200 + 200)}px` }}
      role="status"
      aria-label="Loading feed item"
    >
      <div className="h-full w-full bg-darkAlt2" />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/80 via-black/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-darkAlt2 rounded-full" />
          <div className="h-4 w-24 bg-darkAlt2 rounded" />
        </div>
        <div className="w-7 h-7 bg-darkAlt2 rounded-lg" />
      </div>
    </div>
  ));

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletonItems}
      </div>
    </div>
  );
};
