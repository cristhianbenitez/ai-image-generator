import { useAppDispatch } from '@store/hooks';
import { setUserAndFetchData, closeAuthModal } from '@store/slices/authSlice';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dataProcessed = useRef(false);

  useEffect(() => {
    const redirectToHome = () => navigate('/', { replace: true });
    const redirectToLogin = () => navigate('/login');

    const processUserData = (rawUserData: string) => {
      try {
        const data = JSON.parse(decodeURIComponent(rawUserData));

        if (!data) {
          throw new Error('No user data received');
        }

        const userToSet = {
          id: data.id.toString(),
          name: data.name,
          avatar: data.avatar,
        };

        dispatch(setUserAndFetchData(userToSet));
        dispatch(closeAuthModal());
        dataProcessed.current = true;
        redirectToHome();
      } catch (error) {
        console.error('Error processing user data:', error);
        redirectToLogin();
      }
    };

    const handleCallback = () => {
      // Check if auth was already processed
      if (localStorage.getItem('auth_processed')) {
        redirectToHome();
        return;
      }

      // Skip if we've already processed data in this instance
      if (dataProcessed.current) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const userData = searchParams.get('data');

      if (!userData) {
        // Only redirect to login if auth hasn't been processed
        if (!localStorage.getItem('auth_processed')) {
          redirectToLogin();
        }
        return;
      }

      processUserData(userData);
    };

    handleCallback();

    return () => {
      if (!dataProcessed.current) {
        localStorage.removeItem('auth_processed');
      }
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBg">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};
