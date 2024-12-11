import { AuthModal, Layout } from '@components';
import { AuthCallback, Collection, Feed, History, Home } from '@pages';

import { useAppSelector } from '@store/hooks';
import { Route, Routes } from 'react-router-dom';

function App() {
  const isAuthModalOpen = useAppSelector(state => state.auth.isAuthModalOpen);

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
