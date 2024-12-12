import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@store/hooks';
import { setUserAndFetchData, closeAuthModal } from '@store/slices/authSlice';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dataProcessed = useRef(false);

  useEffect(() => {
    const redirectToHome = () => navigate('/', { replace: true });
    const redirectToLogin = () => navigate('/login');

    const processUserData = (rawData: string) => {
      try {
        const data = JSON.parse(decodeURIComponent(rawData));

        if (!data || !data.user) {
          throw new Error('Invalid user data received');
        }

        const userToSet = {
          id: data.user.id.toString(),
          name: data.user.name,
          avatar: data.user.avatar
        };

        // Store the token if present
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

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
      const searchParams = new URLSearchParams(window.location.search);
      const data = searchParams.get('data');

      if (!data) {
        console.error('No data parameter found in URL');
        redirectToLogin();
        return;
      }

      processUserData(data);
    };

    if (!dataProcessed.current) {
      handleCallback();
    }

    return () => {
      // Cleanup
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
