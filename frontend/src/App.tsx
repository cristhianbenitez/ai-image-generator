import { AuthModal, Layout } from '@components';
import { AuthCallback, Collection, Feed, History, Home } from '@pages';

import { ContextProvider } from '@context';
import { useAuth } from '@hooks';
import { Route, Routes } from 'react-router-dom';

function AppContent() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/history" element={<History />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/login"
          element={<AuthModal isOpen={true} onClose={closeAuthModal} />}
        />
      </Routes>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </Layout>
  );
}

// Wrapper component that provides context
function App() {
  return (
    <ContextProvider>
      <AppContent />
    </ContextProvider>
  );
}

export default App;
