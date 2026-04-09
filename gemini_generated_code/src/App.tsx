/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartProvider } from './hooks/useCart';
import HomePage from '@/src/pages/HomePage';
import CheckoutPage from '@/src/pages/CheckoutPage';
import AdminPage from '@/src/pages/AdminPage';
import Navbar from '@/src/components/Navbar';
import { Toaster } from '@/src/components/ui/sonner';
import './i18n/config';

export default function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'checkout': return <CheckoutPage setPage={setPage} />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar setPage={setPage} />
        <main className="py-8">
          {renderPage()}
        </main>
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

