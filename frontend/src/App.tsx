import { Route, Routes } from 'react-router-dom';

import { Layout } from '@components/Layout';
import { Collection } from '@pages/Collection';
import { Feed } from '@pages/Feed';
import { Home } from '@pages/Home';
import Login from './components/Login';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </Layout>
  );
}

export default App;
