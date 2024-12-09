import React, { useState } from 'react';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID; // Accediendo a la variable de entorno
    const redirectUri = encodeURIComponent(
      import.meta.env.VITE_GITHUB_REDIRECT_URI,
    );

    if (!clientId) {
      alert(
        'No se encontró el client_id. Por favor, contacte al administrador.',
      );
      console.error('Error: El client_id no está definido');
      setIsLoading(false);
      return;
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read:user+user:email`;

    console.log('Redirecting to:', authUrl);
    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Login with GitHub</h1>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? 'Redirecting to GitHub...' : 'Login with GitHub'}
      </button>
    </div>
  );
};

export default Login;
