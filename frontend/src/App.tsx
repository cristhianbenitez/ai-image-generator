import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthModal, Layout, LoadingSpinner } from '@components';
import { AuthCallback, Collection, Feed, History, Home } from '@pages';

import { useInitializeData } from '@hooks';
import { useAppSelector } from '@store/hooks';

function App() {
  const isAuthModalOpen = useAppSelector(state => state.auth.isAuthModalOpen);
  const { isInitialized } = useInitializeData();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/history" element={<History />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<AuthModal isOpen={true} />} />
      </Routes>
      <AuthModal isOpen={isAuthModalOpen} />
    </Layout>
  );
}

export default App;
