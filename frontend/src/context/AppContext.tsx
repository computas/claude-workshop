import { createContext, useContext, type ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage.js';
import { useCart } from '../hooks/useCart.js';
import type { Language } from '@workshop/shared';
import type { TranslationKey } from '../i18n/index.js';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  cart: ReturnType<typeof useCart>['cart'];
  sessionId: string;
  itemCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { cart, sessionId, itemCount, addToCart, updateQuantity, removeItem, refresh } = useCart();

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      cart, sessionId, itemCount,
      addToCart, updateQuantity, removeItem,
      refreshCart: refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
