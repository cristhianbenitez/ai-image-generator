import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const dataProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // If we've already processed the data in this session, just navigate
      if (sessionStorage.getItem('auth_processed')) {
        navigate('/', { replace: true });
        return;
      }

      // If we've already processed the data in this component instance, skip
      if (dataProcessed.current) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const userData = searchParams.get('data');

      if (!userData) {
        // Only navigate to login if we haven't processed data yet
        if (!sessionStorage.getItem('auth_processed')) {
          navigate('/login');
        }
        return;
      }

      try {
        const data = JSON.parse(decodeURIComponent(userData));

        if (data.user) {
          const userToSet = {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email,
            avatar: data.githubUser.avatar_url,
          };

          dataProcessed.current = true;
          setUser(userToSet);
          localStorage.setItem('user', JSON.stringify(userToSet));
          sessionStorage.setItem('auth_processed', 'true');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error processing user data:', error);
        navigate('/login');
      }
    };

    handleCallback();

    return () => {
      // Only remove the session storage item if we're actually leaving the auth flow
      if (!dataProcessed.current) {
        sessionStorage.removeItem('auth_processed');
      }
    };
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBg">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
