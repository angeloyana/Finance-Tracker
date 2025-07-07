import { BrowserRouter, Route, Routes } from 'react-router';

import AppLayout from './layouts/AppLayout';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
