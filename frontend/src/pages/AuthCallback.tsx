import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { setUserAndFetchData, closeAuthModal } from '@store/slices/authSlice';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('data');
    const error = searchParams.get('error');

    if (error) {
      console.error('GitHub OAuth error:', error);
      navigate('/login');
      return;
    }

    if (data) {
      try {
        const parsedData = JSON.parse(data);

        if (!parsedData || !parsedData.user) {
          throw new Error('Invalid user data received');
        }

        const userToSet = {
          id: parsedData.user.id.toString(),
          name: parsedData.user.name,
          avatar: parsedData.user.avatar
        };

        if (parsedData.token) {
          localStorage.setItem('auth_token', parsedData.token);
        }

        dispatch(setUserAndFetchData(userToSet));
        dispatch(closeAuthModal());
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error processing authentication data:', error);
        navigate('/login');
      }
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBg">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};
