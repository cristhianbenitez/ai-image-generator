import { Route, Routes } from 'react-router-dom';

import { Layout } from '@components/Layout';
import { Feed } from '@pages/Feed';
import { Home } from '@pages/Home';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Layout>
  );
}

export default App;
