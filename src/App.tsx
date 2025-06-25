import { BrowserRouter, Route, Routes } from 'react-router';

import AppLayout from './layouts/AppLayout';
import Categories from './pages/Categories';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
