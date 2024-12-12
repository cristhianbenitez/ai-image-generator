import React from 'react';

export const NoAuthMessage = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <p className="text-gray">Please sign in to view your messages</p>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red text-center">
    <p>Error: {message}</p>
  </div>
);

export const EmptyHistory = () => (
  <div className="text-center text-gray py-8">
    <p>No generation history yet</p>
  </div>
);

export const EmptyFeed = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center">
    <h2 className="text-2xl font-medium text-white mb-4">{title}</h2>
    <p className="text-gray">{description}</p>
  </div>
);
