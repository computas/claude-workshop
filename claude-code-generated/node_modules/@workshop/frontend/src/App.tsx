import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { Header } from './components/common/Header.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { OrderDetail } from './components/admin/OrderDetail.js';

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/orders/:id" element={<OrderDetail />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
