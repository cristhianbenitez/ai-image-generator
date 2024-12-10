import AuthModal from '@components/AuthModal';
import { Layout } from '@components/Layout';
import AuthCallback from '@pages/AuthCallback';
import { Collection } from '@pages/Collection';
import { Feed } from '@pages/Feed';
import { Home } from '@pages/Home';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/collection" element={<Collection />} />
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
