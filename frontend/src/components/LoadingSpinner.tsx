export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-16 h-16 border-t-4 border-purple border-solid rounded-full animate-spin" />
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
